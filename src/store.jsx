
// ─── App State / Store ────────────────────────────────────────────────────────

const AppContext = React.createContext(null);

function AppProvider({ children }) {
  const me = STUDENTS.find(s => s.isMe);
  const [students, setStudents] = React.useState(STUDENTS);
  const [toast, setToast] = React.useState(null);
  const [activeView, setActiveView] = React.useState('dashboard');

  const myStudent = students.find(s => s.isMe);
  const levelInfo = getLevelInfo(myStudent.xp);

  // Sort leaderboard
  const leaderboard = [...students].sort((a, b) => b.xp - a.xp).map((s, i) => ({ ...s, rank: i + 1 }));
  const myRank = leaderboard.find(s => s.isMe)?.rank;

  function awardXp(studentId, amount, reason) {
    setStudents(prev => prev.map(s => s.id === studentId ? { ...s, xp: s.xp + amount } : s));
    showToast(`+${amount} XP otorgado — ${reason}`, 'gold');
  }

  function awardBadge(studentId, badgeId) {
    setStudents(prev => prev.map(s =>
      s.id === studentId && !s.earnedBadges.includes(badgeId)
        ? { ...s, earnedBadges: [...s.earnedBadges, badgeId] }
        : s
    ));
    const badge = BADGES.find(b => b.id === badgeId);
    showToast(`Insignia "${badge?.name}" otorgada`, 'success');
  }

  function showToast(message, type = 'success') {
    setToast({ message, type, id: Date.now() });
  }

  const ctx = { students, myStudent, levelInfo, leaderboard, myRank,
    activeView, setActiveView, awardXp, awardBadge, showToast, toast, setToast };

  return <AppContext.Provider value={ctx}>{children}</AppContext.Provider>;
}

function useApp() { return React.useContext(AppContext); }

Object.assign(window, { AppContext, AppProvider, useApp });
