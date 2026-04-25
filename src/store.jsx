
// ─── App State / Store ────────────────────────────────────────────────────────

const AppContext = React.createContext(null);

const NOTIFICATIONS = [
  { id: 'n1', icon: '⚡', text: 'Ganaste 120 XP en "Patrones de Diseño"', time: 'hace 2 h', unread: true },
  { id: 'n2', icon: '🏅', text: 'Nueva insignia desbloqueada: "Precisión"', time: 'hace 5 h', unread: true },
  { id: 'n3', icon: '📈', text: 'Subiste al puesto #1 en Programación OO', time: 'ayer', unread: true },
  { id: 'n4', icon: '🔥', text: 'Racha de 12 días — ¡sigue así!', time: 'ayer', unread: false },
  { id: 'n5', icon: '🎯', text: 'Nuevo desafío disponible: "Semana de Algoritmos"', time: 'hace 2 d', unread: false },
];

function AppProvider({ children }) {
  const [students, setStudents] = React.useState(STUDENTS);
  const [toast, setToast] = React.useState(null);
  const [activeView, setActiveView] = React.useState('dashboard');
  const [showRealNames, setShowRealNames] = React.useState(true);
  const [notifications, setNotifications] = React.useState(NOTIFICATIONS);
  const [notifOpen, setNotifOpen] = React.useState(false);

  const myStudent = students.find(s => s.isMe);
  const levelInfo = getLevelInfo(myStudent.xp);
  const leaderboard = [...students].sort((a, b) => b.xp - a.xp).map((s, i) => ({ ...s, rank: i + 1 }));
  const myRank = leaderboard.find(s => s.isMe)?.rank;
  const unreadCount = notifications.filter(n => n.unread).length;

  function maskName(student) {
    if (showRealNames || student.isMe) return student.name;
    const rank = leaderboard.find(s => s.id === student.id)?.rank || '?';
    return `Estudiante #${rank}`;
  }

  function awardXp(studentId, amount, reason) {
    setStudents(prev => prev.map(s => s.id === studentId ? { ...s, xp: s.xp + amount } : s));
    showToastMsg(`+${amount} XP otorgado — ${reason}`, 'gold');
  }

  function awardBadge(studentId, badgeId) {
    setStudents(prev => prev.map(s =>
      s.id === studentId && !s.earnedBadges.includes(badgeId)
        ? { ...s, earnedBadges: [...s.earnedBadges, badgeId] } : s
    ));
    const badge = BADGES.find(b => b.id === badgeId);
    showToastMsg(`Insignia "${badge?.name}" otorgada`, 'success');
  }

  function showToastMsg(message, type = 'success') {
    setToast({ message, type, id: Date.now() });
  }

  function markAllRead() {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
  }

  const ctx = {
    students, myStudent, levelInfo, leaderboard, myRank,
    activeView, setActiveView,
    showRealNames, setShowRealNames,
    notifications, unreadCount, notifOpen, setNotifOpen, markAllRead,
    awardXp, awardBadge,
    showToast: showToastMsg, toast, setToast,
    maskName,
  };

  return <AppContext.Provider value={ctx}>{children}</AppContext.Provider>;
}

function useApp() { return React.useContext(AppContext); }

Object.assign(window, { AppContext, AppProvider, useApp, NOTIFICATIONS });
