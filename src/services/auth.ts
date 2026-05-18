// Login local (modo demo). Para magic link real ver auth-supabase.ts.
import { STUDENTS, TEACHERS } from '../data.js';
import type { LoginResult } from '../types.js';

const VALID_PASSWORDS = new Set(['osyane', '1234']);

export function loginLocal(email: string, password: string): LoginResult {
  if (!email || !password) return { ok: false, reason: 'empty' };
  const addr = email.trim().toLowerCase();
  const pwd = password.trim();
  if (!VALID_PASSWORDS.has(pwd)) return { ok: false, reason: 'bad-password' };

  const teacher = TEACHERS.find((t) => t.email.toLowerCase() === addr);
  if (teacher) return { ok: true, role: 'teacher', user: teacher };

  const student = STUDENTS.find((s) => s.email.toLowerCase() === addr);
  if (student) return { ok: true, role: 'student', user: student };

  return { ok: false, reason: 'not-found' };
}

// TODO[SSO] reemplazar por auth-supabase.sendMagicLink cuando esté listo.
export async function loginWithUtaSso(): Promise<never> {
  throw new Error('UTA SSO aún no está configurado. Usa magic link via Supabase.');
}
