// Cálculo de ranking — funciones puras genéricas, testeables.
// Aceptan cualquier objeto con `xp: number` para que tests con fixtures parciales funcionen.

export function buildLeaderboard<T extends { xp: number }>(students: T[]): (T & { rank: number })[] {
  return [...students]
    .sort((a, b) => b.xp - a.xp)
    .map((s, i) => ({ ...s, rank: i + 1 }));
}

export function findRank<T extends { xp: number }>(
  students: T[],
  predicate: (s: T & { rank: number }) => boolean
): number | null {
  const board = buildLeaderboard(students);
  const found = board.find(predicate);
  return found ? found.rank : null;
}
