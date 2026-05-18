// Tipos compartidos en toda la app. Importa desde aquí, no redeclares.
// Las tablas de Supabase usan snake_case; cuando hagamos la migración del store
// los tipos `*Row` representarán las filas de la BD y el front mapeará a las
// versiones camelCase de abajo.

export type Role = 'student' | 'teacher' | 'admin' | 'coordinator';
export type Theme = 'dark' | 'light';
export type Locale = 'es' | 'en';
export type ToastType = 'success' | 'gold' | 'info';

export type SubmissionStatus = 'pending' | 'submitted' | 'approved' | 'rejected';

// ── Level / XP ─────────────────────────────────────────────────────────────
export interface Level {
  n: number;
  title: string;
  min: number;
  max: number;
}
export interface LevelInfo extends Level {
  xp: number;
  progress: number; // 0..1
}

// ── Badges ─────────────────────────────────────────────────────────────────
export interface Badge {
  id: string;
  icon: string;
  name: string;
  desc: string;
  cat: string;
  xp: number;
  rare: boolean;
}

// ── Subjects ───────────────────────────────────────────────────────────────
export interface Subject {
  id: string;
  name: string;
  color: string;
}

// ── Profiles (estudiantes + docentes) ──────────────────────────────────────
export interface Student {
  id: string;
  name: string;
  initials: string;
  email: string;
  xp: number;
  earnedBadges: string[];
  streak: number;
  isMe: boolean;
}

export interface Teacher {
  id: string;
  name: string;
  initials: string;
  email: string;
  role: 'teacher';
}

export interface RankedStudent extends Student {
  rank: number;
}

// ── Tasks ──────────────────────────────────────────────────────────────────
export interface Task {
  id: string;
  title: string;
  desc: string;
  subject: string;
  xp: number;
  deadline: string; // YYYY-MM-DD
}

export interface TaskDraft {
  title: string;
  desc: string;
  subject: string;
  xp: number;
  deadline: string;
}

// ── Submissions ────────────────────────────────────────────────────────────
export interface Submission {
  id: string;
  taskId: string;
  studentId: string;
  status: SubmissionStatus;
  note: string;
  submittedAt: string;
  reviewedAt?: string;
}

// ── Notifications ──────────────────────────────────────────────────────────
export interface Notification {
  id: string;
  icon: string;
  text: string;
  time: string;
  unread: boolean;
}

// ── XP history / charts ────────────────────────────────────────────────────
export interface XpDataPoint {
  week: string;
  xp: number;
}
export interface SubjectXp {
  subject: string;
  xp: number;
  maxXp: number;
}
export interface Activity {
  id: string;
  type: 'xp' | 'badge' | 'rank';
  icon: string;
  text: string;
  time: string;
  xp: number | null;
}
export interface Competencia {
  area: string;
  value: number;
}

// ── Login result ───────────────────────────────────────────────────────────
export type LoginResult =
  | { ok: true; role: 'teacher'; user: Teacher }
  | { ok: true; role: 'student'; user: Student }
  | { ok: false; reason: 'empty' | 'bad-password' | 'not-found' };

// ── i18n ───────────────────────────────────────────────────────────────────
export interface LocaleOption {
  code: Locale;
  label: string;
  flag: string;
}

// ── Realtime events emitidos por services/notifications ────────────────────
export type AppEvent =
  | { type: 'xp.awarded'; studentId: string; amount: number; reason: string }
  | { type: 'badge.earned'; studentId: string; badgeId: string }
  | { type: 'task.assigned'; task: Task }
  | { type: 'task.approved'; submissionId: string };
