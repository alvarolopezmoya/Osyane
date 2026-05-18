// Cálculo de ranking — funciones puras, testeables.
import type { Student, RankedStudent } from '../types.js';

export function buildLeaderboard(students: Student[]): RankedStudent[] {
  return [...students]
    .sort((a, b) => b.xp - a.xp)
    .map((s, i) => ({ ...s, rank: i + 1 }));
}

export function findRank(
  students: Student[],
  predicate: (s: RankedStudent) => boolean
): number | null {
  const board = buildLeaderboard(students);
  const found = board.find(predicate);
  return found ? found.rank : null;
}
