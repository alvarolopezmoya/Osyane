-- ════════════════════════════════════════════════════════════════════════════
-- Osyane · Schema completo de Supabase
--
-- Ejecuta este archivo en el SQL Editor de tu proyecto Supabase.
-- Es idempotente: puedes correrlo varias veces sin romper nada.
-- ════════════════════════════════════════════════════════════════════════════

-- ── Extensiones ────────────────────────────────────────────────────────────
create extension if not exists "uuid-ossp";

-- ════════════════════════════════════════════════════════════════════════════
-- 1 · PROFILES (extiende auth.users con info de gamificación)
-- ════════════════════════════════════════════════════════════════════════════

create table if not exists public.profiles (
  id              uuid primary key references auth.users(id) on delete cascade,
  email           text not null unique,
  name            text not null,
  initials        text not null,
  role            text not null check (role in ('student', 'teacher', 'admin', 'coordinator')) default 'student',
  xp              integer not null default 0 check (xp >= 0),
  streak          integer not null default 0 check (streak >= 0),
  earned_badges   text[] not null default '{}',
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index if not exists profiles_xp_idx  on public.profiles (xp desc);
create index if not exists profiles_role_idx on public.profiles (role);

-- ════════════════════════════════════════════════════════════════════════════
-- 2 · TASKS
-- ════════════════════════════════════════════════════════════════════════════

create table if not exists public.tasks (
  id          uuid primary key default uuid_generate_v4(),
  title       text not null,
  description text default '',
  subject     text not null,
  xp          integer not null check (xp > 0 and xp <= 1000),
  deadline    date not null,
  created_by  uuid references public.profiles(id) on delete set null,
  created_at  timestamptz not null default now()
);

create index if not exists tasks_deadline_idx on public.tasks (deadline);

-- ════════════════════════════════════════════════════════════════════════════
-- 3 · SUBMISSIONS
-- ════════════════════════════════════════════════════════════════════════════

create table if not exists public.submissions (
  id            uuid primary key default uuid_generate_v4(),
  task_id       uuid not null references public.tasks(id) on delete cascade,
  student_id    uuid not null references public.profiles(id) on delete cascade,
  status        text not null check (status in ('submitted', 'approved', 'rejected')) default 'submitted',
  note          text default '',
  submitted_at  timestamptz not null default now(),
  reviewed_at   timestamptz,
  reviewed_by   uuid references public.profiles(id) on delete set null,
  unique (task_id, student_id)
);

create index if not exists submissions_student_idx on public.submissions (student_id);
create index if not exists submissions_status_idx  on public.submissions (status);

-- ════════════════════════════════════════════════════════════════════════════
-- 4 · NOTIFICATIONS
-- ════════════════════════════════════════════════════════════════════════════

create table if not exists public.notifications (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid not null references public.profiles(id) on delete cascade,
  icon        text default '📣',
  text        text not null,
  unread      boolean not null default true,
  created_at  timestamptz not null default now()
);

create index if not exists notifications_user_idx on public.notifications (user_id, created_at desc);

-- ════════════════════════════════════════════════════════════════════════════
-- 5 · AUDIT LOG (inmutable — registra cada acción crítica)
-- ════════════════════════════════════════════════════════════════════════════

create table if not exists public.audit_log (
  id          uuid primary key default uuid_generate_v4(),
  actor_id    uuid references public.profiles(id) on delete set null,
  action      text not null,
  target_type text,
  target_id   uuid,
  metadata    jsonb,
  created_at  timestamptz not null default now()
);

create index if not exists audit_log_actor_idx   on public.audit_log (actor_id, created_at desc);
create index if not exists audit_log_target_idx  on public.audit_log (target_type, target_id);

-- ════════════════════════════════════════════════════════════════════════════
-- 6 · TRIGGERS
-- ════════════════════════════════════════════════════════════════════════════

-- a) Al crear un usuario en auth.users, crear su perfil con dominio UTA validado.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  if new.email !~* '@uta\.edu\.ec$' then
    raise exception 'Solo correos @uta.edu.ec están permitidos.';
  end if;
  insert into public.profiles (id, email, name, initials, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    upper(substring(coalesce(new.raw_user_meta_data->>'name', new.email) from 1 for 2)),
    'student'
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- b) updated_at automático en profiles.
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end;
$$;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- c) Cuando una entrega pasa a 'approved' → otorgar XP del task + notificación + audit_log.
create or replace function public.handle_submission_approved()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  task_record public.tasks%rowtype;
begin
  if new.status = 'approved' and (old.status is null or old.status <> 'approved') then
    select * into task_record from public.tasks where id = new.task_id;
    if task_record.id is null then return new; end if;

    update public.profiles
      set xp = xp + task_record.xp
      where id = new.student_id;

    insert into public.notifications (user_id, icon, text)
    values (new.student_id, '⚡', format('+%s XP — "%s" aprobada', task_record.xp, task_record.title));

    insert into public.audit_log (actor_id, action, target_type, target_id, metadata)
    values (
      new.reviewed_by, 'submission.approved', 'submission', new.id,
      jsonb_build_object('xp', task_record.xp, 'task_id', new.task_id, 'student_id', new.student_id)
    );
  end if;
  return new;
end;
$$;

drop trigger if exists on_submission_approved on public.submissions;
create trigger on_submission_approved
  after update on public.submissions
  for each row execute function public.handle_submission_approved();

-- d) RPC: otorgar XP manual (acción del docente).
create or replace function public.award_xp(p_student_id uuid, p_amount integer, p_reason text)
returns void
language plpgsql
security definer set search_path = public
as $$
begin
  if p_amount <= 0 or p_amount > 1000 then
    raise exception 'Amount must be between 1 and 1000';
  end if;

  update public.profiles set xp = xp + p_amount where id = p_student_id;

  insert into public.notifications (user_id, icon, text)
  values (p_student_id, '⚡', format('+%s XP — %s', p_amount, p_reason));

  insert into public.audit_log (actor_id, action, target_type, target_id, metadata)
  values (
    auth.uid(), 'xp.awarded', 'profile', p_student_id,
    jsonb_build_object('amount', p_amount, 'reason', p_reason)
  );
end;
$$;

-- e) RPC: otorgar insignia.
create or replace function public.award_badge(p_student_id uuid, p_badge_id text)
returns void
language plpgsql
security definer set search_path = public
as $$
begin
  update public.profiles
    set earned_badges = array_append(earned_badges, p_badge_id)
    where id = p_student_id and not (p_badge_id = any(earned_badges));

  insert into public.notifications (user_id, icon, text)
  values (p_student_id, '🏅', format('Insignia desbloqueada: %s', p_badge_id));

  insert into public.audit_log (actor_id, action, target_type, target_id, metadata)
  values (
    auth.uid(), 'badge.awarded', 'profile', p_student_id,
    jsonb_build_object('badge_id', p_badge_id)
  );
end;
$$;

-- ════════════════════════════════════════════════════════════════════════════
-- 7 · ROW LEVEL SECURITY
-- ════════════════════════════════════════════════════════════════════════════

alter table public.profiles      enable row level security;
alter table public.tasks         enable row level security;
alter table public.submissions   enable row level security;
alter table public.notifications enable row level security;
alter table public.audit_log     enable row level security;

-- Helper: ¿el actor actual es docente o admin?
create or replace function public.is_teacher()
returns boolean
language sql stable security definer set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role in ('teacher', 'admin', 'coordinator')
  );
$$;

-- ── Profiles ────────────────────────────────────────────────────────────────
drop policy if exists "profiles: todos leen para ranking" on public.profiles;
create policy "profiles: todos leen para ranking" on public.profiles
  for select using (auth.role() = 'authenticated');

drop policy if exists "profiles: actualizar el propio" on public.profiles;
create policy "profiles: actualizar el propio" on public.profiles
  for update using (auth.uid() = id);

-- ── Tasks ───────────────────────────────────────────────────────────────────
drop policy if exists "tasks: todos los autenticados leen" on public.tasks;
create policy "tasks: todos los autenticados leen" on public.tasks
  for select using (auth.role() = 'authenticated');

drop policy if exists "tasks: solo docentes insertan" on public.tasks;
create policy "tasks: solo docentes insertan" on public.tasks
  for insert with check (public.is_teacher());

drop policy if exists "tasks: solo docentes actualizan" on public.tasks;
create policy "tasks: solo docentes actualizan" on public.tasks
  for update using (public.is_teacher());

drop policy if exists "tasks: solo docentes borran" on public.tasks;
create policy "tasks: solo docentes borran" on public.tasks
  for delete using (public.is_teacher());

-- ── Submissions ─────────────────────────────────────────────────────────────
drop policy if exists "submissions: estudiante lee las suyas" on public.submissions;
create policy "submissions: estudiante lee las suyas" on public.submissions
  for select using (auth.uid() = student_id or public.is_teacher());

drop policy if exists "submissions: estudiante crea/actualiza las suyas" on public.submissions;
create policy "submissions: estudiante crea/actualiza las suyas" on public.submissions
  for insert with check (auth.uid() = student_id);

drop policy if exists "submissions: docente revisa todas" on public.submissions;
create policy "submissions: docente revisa todas" on public.submissions
  for update using (public.is_teacher() or auth.uid() = student_id);

-- ── Notifications ───────────────────────────────────────────────────────────
drop policy if exists "notifications: solo las propias" on public.notifications;
create policy "notifications: solo las propias" on public.notifications
  for all using (auth.uid() = user_id);

-- ── Audit log ───────────────────────────────────────────────────────────────
drop policy if exists "audit_log: solo docentes leen" on public.audit_log;
create policy "audit_log: solo docentes leen" on public.audit_log
  for select using (public.is_teacher());

-- ════════════════════════════════════════════════════════════════════════════
-- 8 · REALTIME
-- Activa Postgres CDC para que el front reciba cambios en vivo.
-- ════════════════════════════════════════════════════════════════════════════
alter publication supabase_realtime add table public.profiles;
alter publication supabase_realtime add table public.tasks;
alter publication supabase_realtime add table public.submissions;
alter publication supabase_realtime add table public.notifications;

-- ════════════════════════════════════════════════════════════════════════════
-- ✓ Schema listo. Siguiente paso: ejecutar supabase/seed.sql (opcional)
--   para tener datos de prueba mientras desarrollas.
-- ════════════════════════════════════════════════════════════════════════════
