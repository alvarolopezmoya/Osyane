import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest';
import {
  validateTask, daysUntilDeadline, isOverdue, submissionFor, canSubmit,
  SUBMISSION_STATUS, TASK_SUBJECTS,
} from '../src/utils/tasks.js';

// Congelar "hoy" para que los tests sean determinísticos.
beforeAll(() => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date('2026-05-16T12:00:00Z'));
});
afterAll(() => { vi.useRealTimers(); });

describe('validateTask', () => {
  const valid = {
    title: 'Proyecto API',
    desc: 'Construir un API REST',
    subject: 'Ing. de Software',
    xp: 200,
    deadline: '2026-06-15',
  };

  it('acepta tareas válidas', () => {
    const { ok, errors } = validateTask(valid);
    expect(ok).toBe(true);
    expect(errors).toEqual({});
  });

  it('rechaza título vacío', () => {
    const { ok, errors } = validateTask({ ...valid, title: '   ' });
    expect(ok).toBe(false);
    expect(errors.title).toBeDefined();
  });

  it('rechaza asignatura no listada', () => {
    const { ok, errors } = validateTask({ ...valid, subject: 'Filosofía' });
    expect(ok).toBe(false);
    expect(errors.subject).toBeDefined();
  });

  it('acepta cualquier asignatura listada', () => {
    for (const subject of TASK_SUBJECTS) {
      expect(validateTask({ ...valid, subject }).ok).toBe(true);
    }
  });

  it('rechaza XP <= 0', () => {
    expect(validateTask({ ...valid, xp: 0 }).ok).toBe(false);
    expect(validateTask({ ...valid, xp: -10 }).ok).toBe(false);
  });

  it('rechaza XP > 1000', () => {
    const { ok, errors } = validateTask({ ...valid, xp: 1001 });
    expect(ok).toBe(false);
    expect(errors.xp).toBeDefined();
  });

  it('rechaza XP no numérico', () => {
    expect(validateTask({ ...valid, xp: 'cien' }).ok).toBe(false);
  });

  it('rechaza fecha inválida o vacía', () => {
    expect(validateTask({ ...valid, deadline: '' }).ok).toBe(false);
    expect(validateTask({ ...valid, deadline: 'not-a-date' }).ok).toBe(false);
  });

  it('maneja null y undefined sin crashear', () => {
    expect(validateTask(null).ok).toBe(false);
    expect(validateTask(undefined).ok).toBe(false);
  });
});

describe('daysUntilDeadline / isOverdue', () => {
  it('devuelve días positivos para fecha futura', () => {
    expect(daysUntilDeadline('2026-05-20')).toBe(4);
  });

  it('devuelve negativo cuando ya pasó', () => {
    const d = daysUntilDeadline('2026-05-10');
    expect(d).toBeLessThan(0);
  });

  it('isOverdue detecta correctamente', () => {
    expect(isOverdue('2026-05-10')).toBe(true);
    expect(isOverdue('2026-05-20')).toBe(false);
  });

  it('null/undefined no es overdue', () => {
    expect(isOverdue(null)).toBe(false);
    expect(daysUntilDeadline(null)).toBeNull();
  });
});

describe('submissionFor / canSubmit', () => {
  const task = { id: 't1', deadline: '2026-05-20' };
  const subs = [
    { id: 's1', taskId: 't1', studentId: 'u1', status: SUBMISSION_STATUS.SUBMITTED },
    { id: 's2', taskId: 't2', studentId: 'u1', status: SUBMISSION_STATUS.APPROVED },
  ];

  it('submissionFor encuentra la entrega del estudiante para la tarea', () => {
    expect(submissionFor(task, subs, 'u1')?.id).toBe('s1');
  });

  it('submissionFor devuelve null si no existe', () => {
    expect(submissionFor(task, subs, 'u9')).toBeNull();
  });

  it('canSubmit es true cuando no hay entrega y la tarea no venció', () => {
    expect(canSubmit(task, null)).toBe(true);
  });

  it('canSubmit es false si la tarea está vencida', () => {
    expect(canSubmit({ ...task, deadline: '2026-05-10' }, null)).toBe(false);
  });

  it('canSubmit es false si ya hay entrega SUBMITTED', () => {
    expect(canSubmit(task, { status: SUBMISSION_STATUS.SUBMITTED })).toBe(false);
  });

  it('canSubmit es false si ya hay entrega APPROVED', () => {
    expect(canSubmit(task, { status: SUBMISSION_STATUS.APPROVED })).toBe(false);
  });

  it('canSubmit es true si fue REJECTED (puede reintentar)', () => {
    expect(canSubmit(task, { status: SUBMISSION_STATUS.REJECTED })).toBe(true);
  });
});
