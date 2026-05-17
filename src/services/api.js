// ────────────────────────────────────────────────────────────────────────────
// API client — stub local. En producción esto será un backend real.
//
// TODO[BACKEND] Backend ligero multi-usuario:
//   Elegir una de estas tres pilas:
//     • Firebase Firestore + Firebase Auth (más simple, free tier 1 GB).
//         npm i firebase
//         import { initializeApp } from 'firebase/app';
//         import { getFirestore, collection, doc, getDocs, setDoc, onSnapshot } from 'firebase/firestore';
//     • Supabase (Postgres + Auth + Realtime + Storage).
//         npm i @supabase/supabase-js
//         export const supabase = createClient(VITE_SUPABASE_URL, VITE_SUPABASE_KEY);
//     • Express + SQLite (self-hosted en Render/Fly, ~$0/mes en idle).
//         GET /api/students, POST /api/tasks, etc.
//
//   Mapear cada función de este archivo a un endpoint/colección:
//     fetchStudents() → GET /students   o  collection('students')
//     fetchTasks()    → GET /tasks      o  collection('tasks')
//     awardXp()       → POST /students/:id/xp   (Firestore: updateDoc + increment(amt))
//     createTask()    → POST /tasks
//     submitTask()    → POST /submissions
//     approveSubmission() → PATCH /submissions/:id  → trigger awardXp en backend
//   Las credenciales viven en .env (VITE_* las expone Vite al cliente).
// ────────────────────────────────────────────────────────────────────────────

import {
  STUDENTS, TEACHERS, INITIAL_TASKS, INITIAL_NOTIFICATIONS,
} from '../data.js';
import { load, save } from '../utils/storage.js';

const DELAY = 0; // Simular latencia (ms). 0 = instantáneo.
const wait = (ms = DELAY) => (ms ? new Promise((r) => setTimeout(r, ms)) : Promise.resolve());

// ── Students ────────────────────────────────────────────────────────────────
export async function fetchStudents() {
  await wait();
  return load('students', STUDENTS);
}
export async function saveStudents(students) {
  await wait();
  save('students', students);
  return students;
}

// ── Teachers ────────────────────────────────────────────────────────────────
export async function fetchTeachers() {
  await wait();
  return TEACHERS;
}

// ── Tasks ───────────────────────────────────────────────────────────────────
export async function fetchTasks() {
  await wait();
  return load('tasks', INITIAL_TASKS);
}
export async function saveTasks(tasks) {
  await wait();
  save('tasks', tasks);
  return tasks;
}

// ── Submissions ─────────────────────────────────────────────────────────────
// shape: { id, taskId, studentId, status: 'submitted'|'approved'|'rejected', submittedAt, reviewedAt, note }
export async function fetchSubmissions() {
  await wait();
  return load('submissions', []);
}
export async function saveSubmissions(submissions) {
  await wait();
  save('submissions', submissions);
  return submissions;
}

// ── Notifications ───────────────────────────────────────────────────────────
export async function fetchNotifications() {
  await wait();
  return load('notifications', INITIAL_NOTIFICATIONS);
}
export async function saveNotifications(list) {
  await wait();
  save('notifications', list);
  return list;
}
