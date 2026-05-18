// CRUD contra Supabase — usado por los hooks de TanStack Query.
// Todas las funciones esperan al cliente vía `await requireSupabase()` que lo
// importa lazy desde @supabase/supabase-js (no entra en el bundle inicial).
import type { RealtimePostgresChangesPayload } from '@supabase/supabase-js';
import { requireSupabase } from './supabase.js';
import type { ProfileRow } from './auth-supabase.js';

export interface TaskRow {
  id: string;
  title: string;
  description: string;
  subject: string;
  xp: number;
  deadline: string;
  created_by: string | null;
  created_at: string;
}

export interface SubmissionRow {
  id: string;
  task_id: string;
  student_id: string;
  status: 'submitted' | 'approved' | 'rejected';
  note: string;
  submitted_at: string;
  reviewed_at: string | null;
  reviewed_by: string | null;
}

export interface NotificationRow {
  id: string;
  user_id: string;
  icon: string;
  text: string;
  unread: boolean;
  created_at: string;
}

// ── Profiles ───────────────────────────────────────────────────────────────
export async function fetchProfiles(): Promise<ProfileRow[]> {
  const sb = await requireSupabase();
  const { data, error } = await sb.from('profiles').select('*').order('xp', { ascending: false });
  if (error) throw error;
  return (data as ProfileRow[]) ?? [];
}

export async function fetchProfile(id: string): Promise<ProfileRow> {
  const sb = await requireSupabase();
  const { data, error } = await sb.from('profiles').select('*').eq('id', id).single();
  if (error) throw error;
  return data as ProfileRow;
}

// ── Tasks ──────────────────────────────────────────────────────────────────
export async function fetchTasks(): Promise<TaskRow[]> {
  const sb = await requireSupabase();
  const { data, error } = await sb.from('tasks').select('*').order('deadline', { ascending: true });
  if (error) throw error;
  return (data as TaskRow[]) ?? [];
}

export type CreateTaskInput = Pick<TaskRow, 'title' | 'description' | 'subject' | 'xp' | 'deadline'>;

export async function createTask(task: CreateTaskInput): Promise<TaskRow> {
  const sb = await requireSupabase();
  const { data, error } = await sb.from('tasks').insert(task).select().single();
  if (error) throw error;
  return data as TaskRow;
}

export async function deleteTask(id: string): Promise<void> {
  const sb = await requireSupabase();
  const { error } = await sb.from('tasks').delete().eq('id', id);
  if (error) throw error;
}

// ── Submissions ────────────────────────────────────────────────────────────
export async function fetchSubmissions(): Promise<SubmissionRow[]> {
  const sb = await requireSupabase();
  const { data, error } = await sb.from('submissions').select('*').order('submitted_at', { ascending: false });
  if (error) throw error;
  return (data as SubmissionRow[]) ?? [];
}

export async function submitTask(
  args: { taskId: string; studentId: string; note: string }
): Promise<SubmissionRow> {
  const sb = await requireSupabase();
  const { data, error } = await sb
    .from('submissions')
    .insert({ task_id: args.taskId, student_id: args.studentId, note: args.note, status: 'submitted' })
    .select()
    .single();
  if (error) throw error;
  return data as SubmissionRow;
}

export async function reviewSubmission(
  args: { id: string; status: 'approved' | 'rejected' }
): Promise<SubmissionRow> {
  const sb = await requireSupabase();
  const { data, error } = await sb
    .from('submissions')
    .update({ status: args.status, reviewed_at: new Date().toISOString() })
    .eq('id', args.id)
    .select()
    .single();
  if (error) throw error;
  return data as SubmissionRow;
}

// ── XP / Badges (RPCs) ─────────────────────────────────────────────────────
export async function awardXp(
  args: { studentId: string; amount: number; reason: string }
): Promise<void> {
  const sb = await requireSupabase();
  const { error } = await sb.rpc('award_xp', {
    p_student_id: args.studentId,
    p_amount: args.amount,
    p_reason: args.reason,
  });
  if (error) throw error;
}

export async function awardBadge(args: { studentId: string; badgeId: string }): Promise<void> {
  const sb = await requireSupabase();
  const { error } = await sb.rpc('award_badge', {
    p_student_id: args.studentId,
    p_badge_id: args.badgeId,
  });
  if (error) throw error;
}

// ── Notifications ──────────────────────────────────────────────────────────
export async function fetchMyNotifications(): Promise<NotificationRow[]> {
  const sb = await requireSupabase();
  const { data, error } = await sb
    .from('notifications')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(30);
  if (error) throw error;
  return (data as NotificationRow[]) ?? [];
}

export async function markAllNotificationsRead(): Promise<void> {
  const sb = await requireSupabase();
  const { error } = await sb.from('notifications').update({ unread: false }).eq('unread', true);
  if (error) throw error;
}

// ── Realtime (suscripción a cambios de tablas) ─────────────────────────────
// Igual que onAuthChange: devuelve cleanup síncrono mientras el cliente carga.
export function subscribeToTable(
  table: string,
  callback: (payload: RealtimePostgresChangesPayload<Record<string, unknown>>) => void
): () => void {
  let cancelled = false;
  let cleanup: (() => void) | null = null;

  requireSupabase().then((sb) => {
    if (cancelled) return;
    const channel = sb
      .channel(`public:${table}`)
      .on(
        'postgres_changes' as unknown as never,
        { event: '*', schema: 'public', table } as never,
        callback as never,
      )
      .subscribe();
    cleanup = () => { sb.removeChannel(channel); };
  }).catch(() => { /* silent */ });

  return () => {
    cancelled = true;
    cleanup?.();
  };
}
