import { createContext, useContext, useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { STUDENTS, TEACHERS, INITIAL_TASKS, INITIAL_NOTIFICATIONS, BADGES } from './data.js';
import { getLevelInfo } from './utils/levels.js';
import { buildLeaderboard } from './utils/ranking.js';
import { SUBMISSION_STATUS } from './utils/tasks.js';
import { usePersistedState, load } from './utils/storage.js';
import { DS, THEMES, applyTheme } from './components/ds.js';
import { loginLocal } from './services/auth.js';
import { emit as emitNotif, makeNotification } from './services/notifications.js';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  // ── Persisted state ──────────────────────────────────────────────────────
  const [students, setStudents]           = usePersistedState('students', STUDENTS);
  const [tasks, setTasks]                 = usePersistedState('tasks', INITIAL_TASKS);
  const [submissions, setSubmissions]     = usePersistedState('submissions', []);
  const [notifications, setNotifications] = usePersistedState('notifications', INITIAL_NOTIFICATIONS);
  const [theme, setThemeState]            = usePersistedState('theme', 'dark');

  // ── Session state (NOT persisted: login is per-session) ──────────────────
  const [activeView, setActiveView]         = useState('dashboard');
  const [showRealNames, setShowRealNames]   = useState(true);
  const [notifOpen, setNotifOpen]           = useState(false);
  const [toast, setToast]                   = useState(null);
  const [loggedIn, setLoggedIn]             = useState(() => !!load('session', null));
  const [userRole, setUserRole]             = useState(() => load('session', null)?.role || null);
  const [currentTeacher, setCurrentTeacher] = useState(() => {
    const s = load('session', null);
    return s?.role === 'teacher' ? s.user : null;
  });

  // ── Theme application ────────────────────────────────────────────────────
  // Mutate DS in place so every component re-reads the new tokens on next render.
  Object.assign(DS, THEMES[theme] || THEMES.dark);
  useLayoutEffect(() => { applyTheme(theme); }, [theme]);

  function toggleTheme() { setThemeState((t) => (t === 'dark' ? 'light' : 'dark')); }
  function setTheme(t) { setThemeState(t); }

  // ── Restore "isMe" from session ──────────────────────────────────────────
  useEffect(() => {
    const session = load('session', null);
    if (session?.role === 'student' && session.user) {
      setStudents((prev) => prev.map((s) => ({ ...s, isMe: s.id === session.user.id })));
    }
  }, []);

  // ── Derived values ───────────────────────────────────────────────────────
  const myStudent = useMemo(
    () => students.find((s) => s.isMe) || students[0],
    [students]
  );
  const levelInfo  = useMemo(() => getLevelInfo(myStudent?.xp || 0), [myStudent?.xp]);
  const leaderboard = useMemo(() => buildLeaderboard(students), [students]);
  const myRank     = useMemo(() => leaderboard.find((s) => s.isMe)?.rank ?? null, [leaderboard]);
  const unreadCount = notifications.filter((n) => n.unread).length;

  // ── Auth ─────────────────────────────────────────────────────────────────
  function login(email, password) {
    const res = loginLocal(email, password);
    if (!res.ok) return false;

    if (res.role === 'teacher') {
      setCurrentTeacher(res.user);
      setUserRole('teacher');
      setLoggedIn(true);
      setActiveView('teacher');
      try { localStorage.setItem('osyane:session', JSON.stringify({ role: 'teacher', user: res.user })); } catch {}
      return true;
    }
    // student
    setStudents((prev) => prev.map((s) => ({ ...s, isMe: s.id === res.user.id })));
    setCurrentTeacher(null);
    setUserRole('student');
    setLoggedIn(true);
    setActiveView('dashboard');
    try { localStorage.setItem('osyane:session', JSON.stringify({ role: 'student', user: res.user })); } catch {}
    return true;
  }

  function logout() {
    setLoggedIn(false);
    setUserRole(null);
    setCurrentTeacher(null);
    try { localStorage.removeItem('osyane:session'); } catch {}
  }

  function maskName(student) {
    if (showRealNames || student.isMe) return student.name;
    const rank = leaderboard.find((s) => s.id === student.id)?.rank || '?';
    return `Estudiante #${rank}`;
  }

  // ── XP / Badges ──────────────────────────────────────────────────────────
  function awardXp(studentId, amount, reason) {
    setStudents((prev) => prev.map((s) => (s.id === studentId ? { ...s, xp: s.xp + amount } : s)));
    pushNotif(makeNotification(`+${amount} XP — ${reason}`, '⚡'));
    showToastMsg(`+${amount} XP otorgado — ${reason}`, 'gold');
    emitNotif({ type: 'xp.awarded', studentId, amount, reason });
  }

  function awardBadge(studentId, badgeId) {
    setStudents((prev) => prev.map((s) =>
      s.id === studentId && !s.earnedBadges.includes(badgeId)
        ? { ...s, earnedBadges: [...s.earnedBadges, badgeId] }
        : s
    ));
    const badge = BADGES.find((b) => b.id === badgeId);
    pushNotif(makeNotification(`Insignia desbloqueada: "${badge?.name}"`, '🏅'));
    showToastMsg(`Insignia "${badge?.name}" otorgada`, 'success');
    emitNotif({ type: 'badge.earned', studentId, badgeId });
  }

  // ── Tasks ────────────────────────────────────────────────────────────────
  function addTask(task) {
    const newTask = { ...task, id: 'tk' + Date.now() };
    setTasks((prev) => [newTask, ...prev]);
    pushNotif(makeNotification(`Nueva tarea: "${task.title}"`, '📋'));
    showToastMsg(`Tarea "${task.title}" creada`, 'success');
    emitNotif({ type: 'task.assigned', task: newTask });
  }
  function deleteTask(taskId) {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
    setSubmissions((prev) => prev.filter((s) => s.taskId !== taskId));
    showToastMsg('Tarea eliminada', 'info');
  }

  // ── Submissions ──────────────────────────────────────────────────────────
  function submitTask(taskId, studentId, note = '') {
    setSubmissions((prev) => {
      const existing = prev.find((s) => s.taskId === taskId && s.studentId === studentId);
      if (existing && existing.status === SUBMISSION_STATUS.APPROVED) return prev;
      const next = prev.filter((s) => !(s.taskId === taskId && s.studentId === studentId));
      next.unshift({
        id: 'sb' + Date.now(),
        taskId, studentId, note,
        status: SUBMISSION_STATUS.SUBMITTED,
        submittedAt: new Date().toISOString(),
      });
      return next;
    });
    showToastMsg('Entrega enviada — pendiente de revisión', 'info');
  }

  function approveSubmission(submissionId) {
    let target;
    setSubmissions((prev) => prev.map((s) => {
      if (s.id !== submissionId) return s;
      target = s;
      return { ...s, status: SUBMISSION_STATUS.APPROVED, reviewedAt: new Date().toISOString() };
    }));
    // Defer awardXp until after state update applies cleanly.
    queueMicrotask(() => {
      if (!target) return;
      const task = tasks.find((t) => t.id === target.taskId);
      if (task) awardXp(target.studentId, task.xp, `Tarea "${task.title}" aprobada`);
    });
  }

  function rejectSubmission(submissionId) {
    setSubmissions((prev) => prev.map((s) =>
      s.id === submissionId
        ? { ...s, status: SUBMISSION_STATUS.REJECTED, reviewedAt: new Date().toISOString() }
        : s
    ));
    showToastMsg('Entrega rechazada', 'info');
  }

  // ── Notifications ────────────────────────────────────────────────────────
  function pushNotif(n) {
    setNotifications((prev) => [n, ...prev].slice(0, 30));
  }
  function markAllRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  }

  function showToastMsg(message, type = 'success') {
    setToast({ message, type, id: Date.now() });
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
    submissions, submitTask, approveSubmission, rejectSubmission,
    theme, setTheme, toggleTheme,
  };

  return <AppContext.Provider value={ctx}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp debe usarse dentro de <AppProvider>');
  return ctx;
}

