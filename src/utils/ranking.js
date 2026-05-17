// Cálculo de ranking — función pura, testeable.
export function buildLeaderboard(students) {
  return [...students]
    .sort((a, b) => b.xp - a.xp)
    .map((s, i) => ({ ...s, rank: i + 1 }));
}

export function findRank(students, predicate) {
  const board = buildLeaderboard(students);
  const found = board.find(predicate);
  return found ? found.rank : null;
}
