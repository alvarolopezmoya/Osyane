-- ════════════════════════════════════════════════════════════════════════════
-- Osyane · Seed de datos de prueba
--
-- Ejecuta DESPUÉS de schema.sql. Solo en entornos de desarrollo.
-- NO ejecutes esto en producción — borra cualquier dato existente.
--
-- Como los `profiles` están atados a `auth.users`, este seed crea usuarios
-- demo en el sistema de auth con UUIDs fijos. En producción los perfiles se
-- crean automáticamente al hacer signup vía magic link.
-- ════════════════════════════════════════════════════════════════════════════

-- ⚠️  Limpia datos existentes (solo dev).
truncate public.audit_log, public.notifications, public.submissions, public.tasks, public.profiles cascade;

-- ── Seed perfiles ──────────────────────────────────────────────────────────
-- En un proyecto real, estos perfiles aparecen solo después de que los usuarios
-- hagan signup via magic link. Para demo, los insertamos con UUIDs fijos.
-- NOTA: como hay un FK a auth.users, en realidad necesitas crear usuarios via
-- el dashboard de Supabase primero, o usar la función admin_create_user de Edge.

-- Si solo quieres datos para ranking sin auth, comenta el FK en schema.sql.

insert into public.profiles (id, email, name, initials, role, xp, streak, earned_badges) values
  ('00000000-0000-0000-0000-000000000001', 'ogranda8821@uta.edu.ec', 'Osyan Granda',     'OG', 'student', 4580, 12, array['b01','b02','b03','b05','b06','b08','b10']),
  ('00000000-0000-0000-0000-000000000002', 'vtorres5543@uta.edu.ec', 'Valentina Torres', 'VT', 'student', 5210, 18, array['b01','b02','b04','b05','b06','b07','b09','b11']),
  ('00000000-0000-0000-0000-000000000003', 'smora6612@uta.edu.ec',   'Sebastián Mora',   'SM', 'student', 4990,  9, array['b01','b03','b06','b10','b13']),
  ('00000000-0000-0000-0000-000000000004', 'creyes7731@uta.edu.ec',  'Camila Reyes',     'CR', 'student', 4120, 22, array['b01','b02','b04','b08','b11']),
  ('00000000-0000-0000-0000-000000000005', 'dalmeida4423@uta.edu.ec','Diego Almeida',    'DA', 'student', 3850,  5, array['b01','b05','b12']),
  ('00000000-0000-0000-0000-000000000010', 'cpinto@uta.edu.ec',      'Dr. Carlos Pinto', 'CP', 'teacher', 0, 0, array[]::text[]),
  ('00000000-0000-0000-0000-000000000011', 'msalinas@uta.edu.ec',    'Ing. María Salinas','MS','teacher', 0, 0, array[]::text[])
on conflict (id) do update set
  name = excluded.name, xp = excluded.xp, streak = excluded.streak,
  earned_badges = excluded.earned_badges, role = excluded.role;

-- ── Seed tareas ────────────────────────────────────────────────────────────
insert into public.tasks (id, title, description, subject, xp, deadline, created_by) values
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1', 'Proyecto API REST',       'Implementar API RESTful con Node.js y Express. Incluir autenticación JWT.', 'Ing. de Software', 200, '2026-06-15', '00000000-0000-0000-0000-000000000010'),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa2', 'Normalización BD',        'Normalizar el esquema hasta la Tercera Forma Normal (3FN).',                'Base de Datos',    100, '2026-06-10', '00000000-0000-0000-0000-000000000010'),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa3', 'Algoritmos de Ordenación','Implementar QuickSort y MergeSort. Análisis de complejidad O(n).',         'Programación OO',  80,  '2026-06-20', '00000000-0000-0000-0000-000000000011')
on conflict (id) do nothing;

-- ── Notificaciones de bienvenida ───────────────────────────────────────────
insert into public.notifications (user_id, icon, text, unread)
select id, '👋', 'Bienvenido a Osyane', true from public.profiles where role = 'student';
