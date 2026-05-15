// ─── App State / Store ────────────────────────────────────────────────────────

const AppContext = React.createContext(null);

// ── Theme palettes ────────────────────────────────────────────────────────────
const THEMES = {
  dark: {
    bg:        '#060912',  sidebar:   '#040710',  card:      '#0b1121',  card2:     '#080e1e',
    raised:    '#111c35',
    bd:        'rgba(255,255,255,0.07)',
    bdMd:      'rgba(255,255,255,0.11)',
    bdHi:      'rgba(255,255,255,0.19)',
    t1: '#e8edf8', t2: '#5a6a8a', t3: '#2c3a58',
    blue: '#4f8ef7', blueBright: '#7db3ff',
    blueDim: 'rgba(79,142,247,0.12)', blueGlow: 'rgba(79,142,247,0.38)', blueMid: 'rgba(79,142,247,0.22)',
    gold: '#f5a623', goldBright: '#ffcc5c',
    goldDim: 'rgba(245,166,35,0.13)', goldGlow: 'rgba(245,166,35,0.42)',
    green:  '#0fd9a0', red: '#f43f5e', purple: '#a78bfa',
  },
  light: {
    bg:        '#f4f6fb',  sidebar:   '#ffffff',  card:      '#ffffff',  card2:     '#f8fafc',
    raised:    '#eef2f7',
    bd:        'rgba(15,19,32,0.07)',
    bdMd:      'rgba(15,19,32,0.14)',
    bdHi:      'rgba(15,19,32,0.22)',
    t1: '#0f1320', t2: '#6b7293', t3: '#a0a7c0',
    blue: '#3b82f6', blueBright: '#1d4ed8',
    blueDim: 'rgba(59,130,246,0.09)', blueGlow: 'rgba(59,130,246,0.25)', blueMid: 'rgba(59,130,246,0.18)',
    gold: '#d97706', goldBright: '#b45309',
    goldDim: 'rgba(217,119,6,0.10)', goldGlow: 'rgba(217,119,6,0.32)',
    green: '#059669', red: '#dc2626', purple: '#7c3aed',
  },
};

const NOTIFICATIONS = [
  { id: 'n1', icon: '⚡', text: 'Ganaste 120 XP en "Patrones de Diseño"', time: 'hace 2 h', unread: true },
  { id: 'n2', icon: '🏅', text: 'Nueva insignia desbloqueada: "Precisión"',  time: 'hace 5 h', unread: true },
  { id: 'n3', icon: '📈', text: 'Subiste al puesto #1 en Programación OO',   time: 'ayer',    unread: true },
  { id: 'n4', icon: '🔥', text: 'Racha de 12 días — ¡sigue así!',            time: 'ayer',    unread: false },
  { id: 'n5', icon: '🎯', text: 'Nuevo desafío: "Semana de Algoritmos"',     time: 'hace 2 d',unread: false },
];

const INITIAL_TASKS = [
  { id: 'tk01', title: 'Proyecto API REST',        desc: 'Implementar API RESTful con Node.js y Express. Incluir autenticación JWT.',  subject: 'Ing. de Software', xp: 200, deadline: '2025-06-15' },
  { id: 'tk02', title: 'Normalización BD',          desc: 'Normalizar el esquema de base de datos hasta la Tercera Forma Normal (3FN).', subject: 'Base de Datos',    xp: 100, deadline: '2025-06-10' },
  { id: 'tk03', title: 'Algoritmos de Ordenación',  desc: 'Implementar QuickSort y MergeSort. Análisis de complejidad O(n).',           subject: 'Programación OO',  xp: 80,  deadline: '2025-06-20' },
];

function AppProvider({ children }) {
  const [students, setStudents]       = React.useState(STUDENTS);
  const [toast, setToast]             = React.useState(null);
  const [activeView, setActiveView]   = React.useState('dashboard');
  const [showRealNames, setShowRealNames] = React.useState(true);
  const [notifications, setNotifications] = React.useState(NOTIFICATIONS);
  const [notifOpen, setNotifOpen]     = React.useState(false);
  const [loggedIn, setLoggedIn]       = React.useState(false);
  const [userRole, setUserRole]       = React.useState(null);
  const [currentTeacher, setCurrentTeacher] = React.useState(null);
  const [tasks, setTasks]             = React.useState(INITIAL_TASKS);
  const [theme, setThemeState]        = React.useState(() => {
    try { return localStorage.getItem('osyane-theme') || 'dark'; } catch { return 'dark'; }
  });

  // ── Live theme mutation: mutate the shared DS object so every component re-reads new values
  Object.assign(DS, THEMES[theme]);

  React.useLayoutEffect(() => {
    document.documentElement.dataset.theme = theme;
    try { localStorage.setItem('osyane-theme', theme); } catch {}
  }, [theme]);

  function setTheme(t) { setThemeState(t); }
  function toggleTheme() { setThemeState(t => t === 'dark' ? 'light' : 'dark'); }

  const myStudent  = students.find(s => s.isMe);
  const levelInfo  = getLevelInfo(myStudent.xp);
  const leaderboard = [...students].sort((a, b) => b.xp - a.xp).map((s, i) => ({ ...s, rank: i + 1 }));
  const myRank     = leaderboard.find(s => s.isMe)?.rank;
  const unreadCount = notifications.filter(n => n.unread).length;

  function login(email, password) {
    if (!email || !password) return false;
    const addr = email.trim().toLowerCase();
    const pwd  = password.trim();
    if (pwd !== 'osyane' && pwd !== '1234') return false;

    // Check teachers first
    const teacher = TEACHERS.find(t => t.email.toLowerCase() === addr);
    if (teacher) {
      setCurrentTeacher(teacher);
      setUserRole('teacher');
      setLoggedIn(true);
      setActiveView('teacher');
      return true;
    }

    // Check students
    const matched = STUDENTS.find(s => s.email.toLowerCase() === addr);
    if (!matched) return false;
    setStudents(prev => prev.map(s => ({ ...s, isMe: s.id === matched.id })));
    setCurrentTeacher(null);
    setUserRole('student');
    setLoggedIn(true);
    setActiveView('dashboard');
    return true;
  }

  function logout() {
    setLoggedIn(false);
    setUserRole(null);
    setCurrentTeacher(null);
  }

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

  function addTask(task) {
    const newTask = { ...task, id: 'tk' + Date.now() };
    setTasks(prev => [newTask, ...prev]);
    showToastMsg(`Tarea "${task.title}" creada`, 'success');
  }

  function deleteTask(taskId) {
    setTasks(prev => prev.filter(t => t.id !== taskId));
    showToastMsg('Tarea eliminada', 'info');
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
    loggedIn, login, logout,
    userRole, currentTeacher,
    tasks, addTask, deleteTask,
    theme, setTheme, toggleTheme,
  };

  return <AppContext.Provider value={ctx}>{children}</AppContext.Provider>;
}

function useApp() { return React.useContext(AppContext); }

Object.assign(window, { AppContext, AppProvider, useApp, NOTIFICATIONS, INITIAL_TASKS });
