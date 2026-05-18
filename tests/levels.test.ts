import { describe, it, expect } from 'vitest';
import { getLevelInfo, LEVELS } from '../src/utils/levels.js';

describe('getLevelInfo', () => {
  it('devuelve nivel 1 (Aprendiz) cuando XP = 0', () => {
    const info = getLevelInfo(0);
    expect(info.n).toBe(1);
    expect(info.title).toBe('Aprendiz');
    expect(info.progress).toBe(0);
  });

  it('clamp XP negativo a 0 sin romper', () => {
    const info = getLevelInfo(-500);
    expect(info.n).toBe(1);
    expect(info.xp).toBe(0);
    expect(info.progress).toBe(0);
  });

  it('clamp XP no numérico a 0', () => {
    const info = getLevelInfo(NaN);
    expect(info.n).toBe(1);
    expect(info.xp).toBe(0);
  });

  it('en el borde inferior de un nivel devuelve ese nivel con progress 0', () => {
    const info = getLevelInfo(500); // Inicio de Explorador
    expect(info.n).toBe(2);
    expect(info.title).toBe('Explorador');
    expect(info.progress).toBe(0);
  });

  it('en la mitad de un nivel devuelve progress ~0.5', () => {
    // Explorador: 500–1200 (rango 700). Mitad: 850.
    const info = getLevelInfo(850);
    expect(info.n).toBe(2);
    expect(info.progress).toBeCloseTo(0.5, 5);
  });

  it('justo antes del techo devuelve progress < 1', () => {
    const info = getLevelInfo(1199);
    expect(info.n).toBe(2);
    expect(info.progress).toBeLessThan(1);
  });

  it('XP exacto al techo sube al siguiente nivel', () => {
    const info = getLevelInfo(1200);
    expect(info.n).toBe(3);
  });

  it('XP >= 17000 devuelve nivel 10 (Leyenda) con progress 1', () => {
    const info = getLevelInfo(17000);
    expect(info.n).toBe(10);
    expect(info.title).toBe('Leyenda');
    expect(info.progress).toBe(1);
  });

  it('XP enorme también devuelve Leyenda con progress 1', () => {
    const info = getLevelInfo(1_000_000);
    expect(info.n).toBe(10);
    expect(info.progress).toBe(1);
  });

  it('cada nivel definido es continuo: max de N = min de N+1', () => {
    for (let i = 0; i < LEVELS.length - 1; i++) {
      expect(LEVELS[i].max).toBe(LEVELS[i + 1].min);
    }
  });

  it('exactamente 10 niveles', () => {
    expect(LEVELS).toHaveLength(10);
  });
});
