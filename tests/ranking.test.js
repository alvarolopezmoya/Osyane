import { describe, it, expect } from 'vitest';
import { buildLeaderboard, findRank } from '../src/utils/ranking.js';

const SAMPLE = [
  { id: 'a', name: 'Ana',   xp: 100 },
  { id: 'b', name: 'Beto',  xp: 300, isMe: true },
  { id: 'c', name: 'Cami',  xp: 200 },
];

describe('buildLeaderboard', () => {
  it('ordena por XP descendente', () => {
    const board = buildLeaderboard(SAMPLE);
    expect(board.map((s) => s.id)).toEqual(['b', 'c', 'a']);
  });

  it('asigna rank consecutivo empezando en 1', () => {
    const board = buildLeaderboard(SAMPLE);
    expect(board.map((s) => s.rank)).toEqual([1, 2, 3]);
  });

  it('no muta el array original', () => {
    const before = SAMPLE.map((s) => s.id);
    buildLeaderboard(SAMPLE);
    expect(SAMPLE.map((s) => s.id)).toEqual(before);
  });

  it('XP iguales son determinísticos según orden de entrada (stable sort)', () => {
    const tied = [
      { id: 'x', xp: 500 },
      { id: 'y', xp: 500 },
      { id: 'z', xp: 500 },
    ];
    const board = buildLeaderboard(tied);
    expect(board.map((s) => s.id)).toEqual(['x', 'y', 'z']);
  });

  it('array vacío devuelve []', () => {
    expect(buildLeaderboard([])).toEqual([]);
  });
});

describe('findRank', () => {
  it('encuentra rank de "isMe"', () => {
    expect(findRank(SAMPLE, (s) => s.isMe)).toBe(1);
  });

  it('encuentra rank por id', () => {
    expect(findRank(SAMPLE, (s) => s.id === 'a')).toBe(3);
  });

  it('devuelve null si no encuentra', () => {
    expect(findRank(SAMPLE, () => false)).toBeNull();
  });
});
