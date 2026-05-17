// Validaciones y helpers de tareas — funciones puras, testeables.

export const TASK_SUBJECTS = [
  'Programación OO',
  'Base de Datos',
  'Redes',
  'Ing. de Software',
  'Cálculo',
];

export const SUBMISSION_STATUS = {
  PENDING:   'pending',
  SUBMITTED: 'submitted',
  APPROVED:  'approved',
  REJECTED:  'rejected',
};

export function validateTask(task) {
  const errors = {};
  if (!task || typeof task !== 'object') return { ok: false, errors: { _: 'Tarea inválida' } };
  if (!task.title || !task.title.trim()) errors.title = 'El título es obligatorio';
  if (!task.subject || !TASK_SUBJECTS.includes(task.subject)) errors.subject = 'Asignatura inválida';
  if (!task.deadline) errors.deadline = 'La fecha límite es obligatoria';
  else if (Number.isNaN(Date.parse(task.deadline))) errors.deadline = 'Fecha inválida';
  const xp = parseInt(task.xp, 10);
  if (!Number.isFinite(xp) || xp <= 0) errors.xp = 'El XP debe ser un número positivo';
  if (xp > 1000) errors.xp = 'El XP no puede superar 1000';
  return { ok: Object.keys(errors).length === 0, errors };
}

// Días restantes hasta el deadline. Cuando se vence, devuelve negativo.
export function daysUntilDeadline(deadline, now = new Date()) {
  if (!deadline) return null;
  const d = new Date(deadline);
  if (Number.isNaN(d.getTime())) return null;
  const ms = d.setHours(23, 59, 59, 999) - now.getTime();
  return Math.ceil(ms / 86_400_000);
}

export function isOverdue(deadline, now = new Date()) {
  const d = daysUntilDeadline(deadline, now);
  return d != null && d < 0;
}

// Estado consolidado de una entrega del estudiante para una tarea dada.
export function submissionFor(task, submissions, studentId) {
  return submissions.find((s) => s.taskId === task.id && s.studentId === studentId) || null;
}

export function canSubmit(task, submission, now = new Date()) {
  if (!task) return false;
  if (isOverdue(task.deadline, now)) return false;
  if (submission && (submission.status === SUBMISSION_STATUS.SUBMITTED || submission.status === SUBMISSION_STATUS.APPROVED)) return false;
  return true;
}
