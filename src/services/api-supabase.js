// CRUD contra Supabase — usado por los hooks de TanStack Query (src/hooks/*).
// Estas funciones asumen que Supabase está habilitado; los hooks lo verifican antes.

import { requireSupabase } from './supabase.js';

// ── Profiles (estudiantes + docentes) ───────────────────────────────────────
export async function fetchProfiles() {
  const sb = requireSupabase();
  const { data, error } = await sb
    .from('profiles')
    .select('*')
    .order('xp', { ascending: false });
  if (error) throw error;
  return data;
}

export async function fetchProfile(id) {
  const sb = requireSupabase();
  const { data, error } = await sb.from('profiles').select('*').eq('id', id).single();
  if (error) throw error;
  return data;
}

// ── Tasks ───────────────────────────────────────────────────────────────────
export async function fetchTasks() {
  const sb = requireSupabase();
  const { data, error } = await sb
    .from('tasks')
    .select('*')
    .order('deadline', { ascending: true });
  if (error) throw error;
  return data;
}

export async function createTask(task) {
  const sb = requireSupabase();
  const { data, error } = await sb.from('tasks').insert(task).select().single();
  if (error) throw error;
  return data;
}

export async function deleteTask(id) {
  const sb = requireSupabase();
  const { error } = await sb.from('tasks').delete().eq('id', id);
  if (error) throw error;
}

// ── Submissions ─────────────────────────────────────────────────────────────
export async function fetchSubmissions() {
  const sb = requireSupabase();
  const { data, error } = await sb
    .from('submissions')
    .select('*')
    .order('submitted_at', { ascending: false });
  if (error) throw error;
  return data;
}

export async function submitTask({ taskId, studentId, note }) {
  const sb = requireSupabase();
  const { data, error } = await sb
    .from('submissions')
    .insert({ task_id: taskId, student_id: studentId, note, status: 'submitted' })
    .select()
    .single();
  if (error) throw error;
  return data;
}

// `status: 'approved'` dispara el trigger que otorga XP automáticamente (ver schema.sql).
export async function reviewSubmission({ id, status }) {
  const sb = requireSupabase();
  const { data, error } = await sb
    .from('submissions')
    .update({ status, reviewed_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

// ── XP / Badges (acciones explícitas del docente) ──────────────────────────
export async function awardXp({ studentId, amount, reason }) {
  const sb = requireSupabase();
  // RPC porque combina UPDATE en profiles + INSERT en audit_log de forma atómica.
  const { error } = await sb.rpc('award_xp', {
    p_student_id: studentId,
    p_amount: amount,
    p_reason: reason,
  });
  if (error) throw error;
}

export async function awardBadge({ studentId, badgeId }) {
  const sb = requireSupabase();
  const { error } = await sb.rpc('award_badge', {
    p_student_id: studentId,
    p_badge_id: badgeId,
  });
  if (error) throw error;
}

// ── Notifications ───────────────────────────────────────────────────────────
export async function fetchMyNotifications() {
  const sb = requireSupabase();
  const { data, error } = await sb
    .from('notifications')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(30);
  if (error) throw error;
  return data;
}

export async function markAllNotificationsRead() {
  const sb = requireSupabase();
  const { error } = await sb
    .from('notifications')
    .update({ unread: false })
    .eq('unread', true);
  if (error) throw error;
}

// ── Realtime (suscribirse a cambios de tablas) ─────────────────────────────
// Devuelve una función para desuscribirse. Útil para notificaciones en vivo.
export function subscribeToTable(table, callback) {
  const sb = requireSupabase();
  const channel = sb
    .channel(`public:${table}`)
    .on('postgres_changes', { event: '*', schema: 'public', table }, callback)
    .subscribe();
  return () => { sb.removeChannel(channel); };
}
