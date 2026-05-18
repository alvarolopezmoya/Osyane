// Validación y helpers de tareas — funciones puras, testeables.
// Las validaciones formales viven en src/schemas/tasks.ts con Zod.

import { z } from 'zod';
import type { Submission, SubmissionStatus, Task } from '../types.js';

export const TASK_SUBJECTS = [
  'Programación OO',
  'Base de Datos',
  'Redes',
  'Ing. de Software',
  'Cálculo',
] as const;

export type TaskSubject = typeof TASK_SUBJECTS[number];

export const SUBMISSION_STATUS = {
  PENDING:   'pending',
  SUBMITTED: 'submitted',
  APPROVED:  'approved',
  REJECTED:  'rejected',
} as const satisfies Record<string, SubmissionStatus>;

// ── Zod schema para una tarea creada por el docente ───────────────────────
export const taskDraftSchema = z.object({
  title:    z.string().trim().min(1, 'El título es obligatorio').max(120, 'Máximo 120 caracteres'),
  desc:     z.string().trim().max(2000, 'Máximo 2000 caracteres').default(''),
  subject:  z.enum(TASK_SUBJECTS, { errorMap: () => ({ message: 'Asignatura inválida' }) }),
  xp:       z.number().int('XP debe ser entero').positive('XP debe ser positivo').max(1000, 'Máximo 1000 XP'),
  deadline: z
    .string()
    .min(1, 'La fecha límite es obligatoria')
    .refine((s) => !Number.isNaN(Date.parse(s)), 'Fecha inválida'),
});

export type TaskDraftInput = z.input<typeof taskDraftSchema>;

export interface ValidationResult {
  ok: boolean;
  errors: Record<string, string>;
}

export function validateTask(input: unknown): ValidationResult {
  if (!input || typeof input !== 'object') return { ok: false, errors: { _: 'Tarea inválida' } };
  // Normalizar XP que llega como string desde formularios.
  const raw = input as Record<string, unknown>;
  const normalized = { ...raw, xp: typeof raw.xp === 'string' ? parseInt(raw.xp, 10) : raw.xp };
  const result = taskDraftSchema.safeParse(normalized);
  if (result.success) return { ok: true, errors: {} };
  const errors: Record<string, string> = {};
  for (const issue of result.error.issues) {
    const field = issue.path[0]?.toString() ?? '_';
    if (!errors[field]) errors[field] = issue.message;
  }
  return { ok: false, errors };
}

// ── Deadlines (timezone-safe, ver tests/tasks.test.js) ─────────────────────
export function daysUntilDeadline(deadline: string | null | undefined, now: Date = new Date()): number | null {
  if (!deadline) return null;
  const d = new Date(deadline);
  if (Number.isNaN(d.getTime())) return null;
  const deadlineDay = Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());
  const nowDay      = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
  return Math.round((deadlineDay - nowDay) / 86_400_000);
}

export function isOverdue(deadline: string | null | undefined, now: Date = new Date()): boolean {
  const d = daysUntilDeadline(deadline, now);
  return d != null && d < 0;
}

// ── Submissions ───────────────────────────────────────────────────────────
export function submissionFor(
  task: Pick<Task, 'id'>,
  submissions: Submission[],
  studentId: string
): Submission | null {
  return submissions.find((s) => s.taskId === task.id && s.studentId === studentId) ?? null;
}

export function canSubmit(
  task: Pick<Task, 'deadline'> | null | undefined,
  submission: Pick<Submission, 'status'> | null | undefined,
  now: Date = new Date()
): boolean {
  if (!task) return false;
  if (isOverdue(task.deadline, now)) return false;
  if (
    submission &&
    (submission.status === SUBMISSION_STATUS.SUBMITTED ||
      submission.status === SUBMISSION_STATUS.APPROVED)
  ) {
    return false;
  }
  return true;
}
