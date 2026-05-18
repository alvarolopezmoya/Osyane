// API local (modo demo). Persiste en localStorage.
// Para producción real, usar src/services/api-supabase.ts.
//
// TODO[BACKEND] migrar el store para que use api-supabase cuando isSupabaseEnabled.

import { STUDENTS, INITIAL_TASKS, INITIAL_NOTIFICATIONS, TEACHERS } from '../data.js';
import { load, save } from '../utils/storage.js';
import type { Student, Task, Notification, Submission, Teacher } from '../types.js';

const DELAY = 0;
const wait = (ms: number = DELAY): Promise<void> =>
  ms ? new Promise((r) => setTimeout(r, ms)) : Promise.resolve();

// ── Students ───────────────────────────────────────────────────────────────
export async function fetchStudents(): Promise<Student[]> {
  await wait();
  return load<Student[]>('students', STUDENTS);
}
export async function saveStudents(students: Student[]): Promise<Student[]> {
  await wait();
  save('students', students);
  return students;
}

// ── Teachers ───────────────────────────────────────────────────────────────
export async function fetchTeachers(): Promise<Teacher[]> {
  await wait();
  return TEACHERS;
}

// ── Tasks ──────────────────────────────────────────────────────────────────
export async function fetchTasks(): Promise<Task[]> {
  await wait();
  return load<Task[]>('tasks', INITIAL_TASKS);
}
export async function saveTasks(tasks: Task[]): Promise<Task[]> {
  await wait();
  save('tasks', tasks);
  return tasks;
}

// ── Submissions ────────────────────────────────────────────────────────────
export async function fetchSubmissions(): Promise<Submission[]> {
  await wait();
  return load<Submission[]>('submissions', []);
}
export async function saveSubmissions(submissions: Submission[]): Promise<Submission[]> {
  await wait();
  save('submissions', submissions);
  return submissions;
}

// ── Notifications ──────────────────────────────────────────────────────────
export async function fetchNotifications(): Promise<Notification[]> {
  await wait();
  return load<Notification[]>('notifications', INITIAL_NOTIFICATIONS);
}
export async function saveNotifications(list: Notification[]): Promise<Notification[]> {
  await wait();
  save('notifications', list);
  return list;
}
