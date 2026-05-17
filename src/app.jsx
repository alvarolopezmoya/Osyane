import { useEffect, useState } from 'react';
import { useApp } from './store.jsx';
import { useI18n, LOCALES } from './i18n/index.jsx';
import { BADGES } from './data.js';
import { DS } from './components/ds.js';
import { Avatar, XPBar, Toast } from './components/UI.jsx';
import {
  IcoDashboard, IcoRanking, IcoBadge, IcoProgress, IcoTeacher, IcoTasks,
  IcoBell, IcoEye, IcoChevron, IcoClose, IcoMenu, IcoSun, IcoMoon, IcoGlobe,
} from './components/Icons.jsx';
import LoginScreen from './views/Login.jsx';
import ViewDashboard from './views/Dashboard.jsx';
import ViewLeaderboard from './views/Leaderboard.jsx';
import ViewBadges from './views/Badges.jsx';
import ViewProgress from './views/Progress.jsx';
import ViewTeacher from './views/Teacher.jsx';
import ViewStudentTasks from './views/StudentTasks.jsx';

const NAV_ITEMS = [
  { id: 'dashboard',   labelKey: 'nav.dashboard',   icon: IcoDashboard, role: 'student' },
  { id: 'leaderboard', labelKey: 'nav.leaderboard', icon: IcoRanking,   role: 'both'    },
  { id: 'badges',      labelKey: 'nav.badges',      icon: IcoBadge,     role: 'student' },
  { id: 'progress',    labelKey: 'nav.progress',    icon: IcoProgress,  role: 'student' },
  { id: 'tasks',       labelKey: 'nav.tasks',       icon: IcoTasks,     role: 'student' },
  { id: 'teacher',     labelKey: 'nav.teacher',     icon: IcoTeacher,   role: 'teacher' },
];

function useIsMobile() {
  const [m, setM] = useState(window.innerWidth < 768);
  useEffect(() => {
    const fn = () => setM(window.innerWidth < 768);
    window.addEventListener('resize', fn);
    return () => window.removeEventListener('resize', fn);
  }, []);
  return m;
}

function ProfileModal({ open, onClose }) {
  const { myStudent, levelInfo, myRank } = useApp();
  if (!open) return null;
  const earned = BADGES.filter((b) => myStudent.earnedBadges.includes(b.id));
  const xpLeft = levelInfo.max === Infinity ? null : levelInfo.max - myStudent.xp;
  return (
    <div className="fade-in" onClick={onClose} style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      background: 'rgba(0,0,0,0.82)', backdropFilter: 'blur(10px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20
    }}>
      <div onClick={(e) => e.stopPropagation()} className="rise-in" style={{
        background: DS.card, border: `1px solid ${DS.bdMd}`,
        borderRadius: 22, width: 420, maxWidth: '100%',
        boxShadow: '0 40px 100px rgba(0,0,0,0.85)',
        overflow: 'hidden'
      }}>
        <div style={{
          background: 'linear-gradient(135deg,#04091a 0%,#091e40 50%,#04091a 100%)',
          padding: '28px 28px 24px', position: 'relative', overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute', top: -80, right: -60, width: 320, height: 260,
            background: 'radial-gradient(circle,rgba(79,142,247,0.22) 0%,transparent 70%)',
            pointerEvents: 'none'
          }} />
          <button onClick={onClose} style={{
            position: 'absolute', top: 14, right: 14,
            background: 'rgba(255,255,255,0.08)', border: 'none',
            borderRadius: 7, cursor: 'pointer', color: DS.t2,
            display: 'flex', padding: 7, transition: 'background .15s'
          }}>
            <IcoClose size={14} />
          </button>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 18 }}>
            <Avatar initials={myStudent.initials} size={64} colorIndex={0} glow />
            <div>
              <div className="head" style={{ fontSize: 19, fontWeight: 800, color: '#e8edf8', marginBottom: 8, letterSpacing: '-.02em' }}>
                {myStudent.name}
              </div>
              <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap' }}>
                <span style={{
                  background: 'linear-gradient(135deg,#b45309,#f59e0b)',
                  color: '#fff', borderRadius: 7, padding: '3px 12px',
                  fontSize: 11, fontWeight: 700, letterSpacing: '.05em',
                  boxShadow: '0 2px 10px rgba(245,166,35,0.4)'
                }}>N{levelInfo.n} · {levelInfo.title}</span>
                {myStudent.streak > 0 &&
                  <span style={{ background: 'rgba(255,255,255,0.08)', color: '#94a3b8', borderRadius: 7, padding: '3px 10px', fontSize: 11, fontWeight: 600 }}>
                    🔥 {myStudent.streak}d
                  </span>
                }
              </div>
            </div>
          </div>
        </div>
        <div style={{ padding: '22px 28px 28px' }}>
          <div style={{ marginBottom: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ fontSize: 12, color: DS.t2 }}>Nivel {levelInfo.n + 1}</span>
              <span className="num" style={{ fontSize: 12, fontWeight: 700, color: DS.goldBright }}>
                {myStudent.xp.toLocaleString()} XP
              </span>
            </div>
            <XPBar progress={levelInfo.progress} height={8} />
            <div style={{ fontSize: 11, color: DS.t3, marginTop: 5, textAlign: 'right' }}>
              {xpLeft ? `Faltan ${xpLeft.toLocaleString()} XP` : 'Nivel máximo ✦'}
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 20 }}>
            {[
              { label: 'XP Total', val: myStudent.xp.toLocaleString() },
              { label: 'Posición', val: `#${myRank}` },
              { label: 'Insignias', val: earned.length },
            ].map((s, i) => (
              <div key={i} style={{ background: DS.card2, border: `1px solid ${DS.bd}`, borderRadius: 11, padding: '10px 12px', textAlign: 'center' }}>
                <div className="num" style={{ fontSize: 18, fontWeight: 800, color: DS.t1 }}>{s.val}</div>
                <div style={{ fontSize: 10, color: DS.t2, marginTop: 3, fontWeight: 600, letterSpacing: '.05em', textTransform: 'uppercase' }}>{s.label}</div>
              </div>
            ))}
          </div>
          <div style={{ fontSize: 11, fontWeight: 700, color: DS.t3, textTransform: 'uppercase', letterSpacing: '.07em', marginBottom: 10 }}>
            Insignias obtenidas
          </div>
          <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap' }}>
            {earned.map((b) => (
              <div key={b.id} title={b.name} style={{
                width: 38, height: 38, borderRadius: 9,
                background: DS.goldDim, border: `1px solid ${DS.gold}44`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18
              }}>{b.icon}</div>
            ))}
            {earned.length === 0 && <span style={{ fontSize: 12, color: DS.t3 }}>Sin insignias todavía</span>}
          </div>
        </div>
      </div>
    </div>
  );
}

function LanguageMenu({ open, onClose, current, onChange }) {
  if (!open) return null;
  return (
    <div style={{
      position: 'fixed', top: 58, right: 110, zIndex: 2000,
      background: DS.card, border: `1px solid ${DS.bdMd}`,
      borderRadius: 11, padding: 4, boxShadow: '0 16px 40px rgba(0,0,0,0.6)',
      display: 'flex', flexDirection: 'column', minWidth: 160,
    }} onClick={(e) => e.stopPropagation()}>
      {LOCALES.map((loc) => (
        <button key={loc.code} onClick={() => { onChange(loc.code); onClose(); }}
          style={{
            display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px',
            background: current === loc.code ? DS.blueDim : 'transparent',
            color: current === loc.code ? DS.blueBright : DS.t1,
            border: 'none', borderRadius: 7, cursor: 'pointer',
            fontSize: 13, fontFamily: "'Inter',sans-serif", fontWeight: current === loc.code ? 700 : 500,
            textAlign: 'left',
          }}>
          <span style={{ fontSize: 16 }}>{loc.flag}</span>
          <span style={{ flex: 1 }}>{loc.label}</span>
          {current === loc.code && <span style={{ fontSize: 11 }}>✓</span>}
        </button>
      ))}
    </div>
  );
}

function AppShell() {
  const {
    activeView, setActiveView, myStudent, levelInfo,
    toast, setToast, showRealNames, setShowRealNames,
    notifications, unreadCount, notifOpen, setNotifOpen, markAllRead,
    logout, userRole, currentTeacher, theme, toggleTheme,
  } = useApp();
  const { t, locale, setLocale } = useI18n();
  const isTeacher = userRole === 'teacher';
  const visibleNav = NAV_ITEMS.filter((item) =>
    item.role === 'both' ||
    (isTeacher && item.role === 'teacher') ||
    (!isTeacher && item.role === 'student')
  );
  const isMobile = useIsMobile();
  const [sideOpen, setSideOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const sw = isMobile ? 252 : collapsed ? 68 : 252;

  function go(id) { setActiveView(id); if (isMobile) setSideOpen(false); }

  return (
    <div style={{ display: 'flex', height: '100dvh', background: DS.bg, overflow: 'hidden', position: 'relative' }}>

      {isMobile && sideOpen &&
        <div onClick={() => setSideOpen(false)} style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.72)',
          backdropFilter: 'blur(4px)', zIndex: 90
        }} />
      }

      <aside style={{
        width: sw, flexShrink: 0,
        background: DS.sidebar,
        borderRight: `1px solid ${DS.bd}`,
        display: 'flex', flexDirection: 'column',
        transition: 'width .22s cubic-bezier(.4,0,.2,1), transform .25s ease, background .2s',
        overflow: 'hidden',
        ...(isMobile ? {
          position: 'fixed', top: 0, left: 0, bottom: 0, zIndex: 100,
          transform: sideOpen ? 'translateX(0)' : 'translateX(-100%)',
          boxShadow: sideOpen ? '16px 0 60px rgba(0,0,0,0.4)' : 'none',
        } : {}),
      }}>

        <div style={{
          padding: collapsed && !isMobile ? '18px 0' : '18px 18px 16px',
          borderBottom: `1px solid ${DS.bd}`,
          display: 'flex', alignItems: 'center',
          justifyContent: collapsed && !isMobile ? 'center' : 'flex-start', gap: 12
        }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10, flexShrink: 0,
            background: 'linear-gradient(135deg,#1d4ed8,#4f8ef7)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 17, fontWeight: 900, color: '#fff',
            fontFamily: "'Plus Jakarta Sans',sans-serif",
            boxShadow: '0 0 20px rgba(79,142,247,0.45)'
          }}>O</div>
          {(!collapsed || isMobile) &&
            <div>
              <div className="head" style={{ fontSize: 15, fontWeight: 800, color: DS.t1, letterSpacing: '-.02em' }}>{t('app.title')}</div>
              <div style={{ fontSize: 10, color: DS.t3, fontWeight: 600, letterSpacing: '.05em' }}>FISEI · UTA</div>
            </div>
          }
        </div>

        <nav style={{ padding: collapsed && !isMobile ? '12px 8px' : '14px 12px', flex: 1, overflowY: 'auto' }}>
          {(!collapsed || isMobile) &&
            <div style={{ fontSize: 10, fontWeight: 700, color: DS.t2, letterSpacing: '.12em', textTransform: 'uppercase', marginBottom: 8, paddingLeft: 4 }}>
              {t('nav.menu')}
            </div>
          }
          {visibleNav.map((item) => {
            const active = activeView === item.id;
            const Ico = item.icon;
            return (
              <button key={item.id} onClick={() => go(item.id)}
                title={collapsed && !isMobile ? t(item.labelKey) : ''}
                className={`nav-link${active ? ' active' : ''}${collapsed && !isMobile ? ' solo' : ''}`}>
                <Ico size={16} />
                {(!collapsed || isMobile) && <span style={{ flex: 1 }}>{t(item.labelKey)}</span>}
              </button>
            );
          })}
          {(!collapsed || isMobile) &&
            <>
              <div style={{ fontSize: 10, fontWeight: 700, color: DS.t2, letterSpacing: '.12em', textTransform: 'uppercase', margin: '18px 0 8px', paddingLeft: 4 }}>{t('nav.options')}</div>
              {isTeacher && (
                <button onClick={() => setShowRealNames((v) => !v)} className="nav-link">
                  <IcoEye size={16} />
                  <span style={{ flex: 1 }}>{showRealNames ? t('nav.hideNames') : t('nav.showNames')}</span>
                </button>
              )}
            </>
          }
        </nav>

        <div style={{ padding: collapsed && !isMobile ? '12px 8px' : '14px 14px', borderTop: `1px solid ${DS.bd}` }}>
          {collapsed && !isMobile ?
            <div style={{ display: 'flex', justifyContent: 'center', cursor: 'pointer' }} onClick={() => !isTeacher && setProfileOpen(true)}>
              <Avatar initials={isTeacher ? currentTeacher?.initials : myStudent.initials} size={34} colorIndex={isTeacher ? 5 : 0} />
            </div> :
            isTeacher ? (
              <div style={{ background: 'rgba(167,139,250,0.08)', border: '1px solid rgba(167,139,250,0.2)', borderRadius: 12, padding: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Avatar initials={currentTeacher?.initials || 'TC'} size={32} colorIndex={5} />
                  <div style={{ flex: 1, overflow: 'hidden' }}>
                    <div className="head" style={{ fontSize: 12, fontWeight: 700, color: DS.t1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{currentTeacher?.name}</div>
                    <div style={{ fontSize: 10, marginTop: 1, display: 'flex', alignItems: 'center', gap: 4 }}>
                      <span style={{ background: 'rgba(167,139,250,0.2)', color: '#a78bfa', borderRadius: 4, padding: '1px 6px', fontSize: 9, fontWeight: 700, letterSpacing: '.05em' }}>{t('login.teacher')}</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div onClick={() => setProfileOpen(true)} style={{
                background: 'rgba(255,255,255,0.04)', border: `1px solid ${DS.bd}`,
                borderRadius: 12, padding: '12px', cursor: 'pointer', transition: 'all .15s'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                  <Avatar initials={myStudent.initials} size={32} colorIndex={0} />
                  <div style={{ flex: 1, overflow: 'hidden' }}>
                    <div className="head" style={{ fontSize: 12, fontWeight: 700, color: DS.t1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{myStudent.name}</div>
                    <div style={{ fontSize: 10, color: DS.t2, marginTop: 1 }}>N{levelInfo.n} · {levelInfo.title}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span className="num" style={{ fontSize: 10, color: DS.goldBright, fontWeight: 700 }}>{myStudent.xp.toLocaleString()} XP</span>
                  <span style={{ fontSize: 10, color: DS.t2 }}>{Math.round(levelInfo.progress * 100)}%</span>
                </div>
                <XPBar progress={levelInfo.progress} height={3} />
              </div>
            )
          }
          {!isMobile &&
            <button onClick={() => setCollapsed((c) => !c)} style={{
              width: '100%', marginTop: 8, padding: '7px',
              borderRadius: 8, border: `1px solid ${DS.bd}`,
              background: 'transparent', cursor: 'pointer', color: DS.t3,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <IcoChevron size={13} dir={collapsed ? 'right' : 'left'} />
            </button>
          }
          <button onClick={logout} style={{
            width: '100%', marginTop: 6, padding: collapsed && !isMobile ? '7px' : '7px 10px',
            borderRadius: 8, border: `1px solid ${DS.bd}`,
            background: 'transparent', cursor: 'pointer', color: DS.t3,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            gap: 6, fontSize: 11, fontFamily: "'Inter',sans-serif", fontWeight: 500,
          }}>
            <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" />
            </svg>
            {(!collapsed || isMobile) && <span>{t('nav.logout')}</span>}
          </button>
        </div>
      </aside>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>

        <header style={{
          height: 56, flexShrink: 0,
          background: DS.sidebar,
          borderBottom: `1px solid ${DS.bd}`,
          display: 'flex', alignItems: 'center', padding: '0 20px', gap: 12,
          transition: 'background .2s, border-color .2s',
        }}>
          {isMobile &&
            <button onClick={() => setSideOpen((s) => !s)} style={{
              width: 36, height: 36, border: `1px solid ${DS.bd}`,
              borderRadius: 8, background: 'rgba(255,255,255,0.05)',
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: DS.t2, flexShrink: 0,
            }}><IcoMenu size={18} /></button>
          }
          <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
            {!isMobile &&
              <>
                <span style={{ fontSize: 12, color: DS.t3, fontWeight: 500 }}>FISEI</span>
                <IcoChevron size={10} dir="right" />
                <span style={{ fontSize: 12, color: DS.t3, fontWeight: 500 }}>Ing. Software</span>
                <IcoChevron size={10} dir="right" />
              </>
            }
            <span className="head" style={{ fontSize: 14, fontWeight: 700, color: DS.t1 }}>
              {t(`nav.${activeView}`)}
            </span>
          </div>
          <div style={{ flex: 1 }} />
          {!isMobile &&
            <div style={{
              display: 'flex', alignItems: 'center', gap: 7,
              background: 'rgba(255,255,255,0.05)', border: `1px solid ${DS.bd}`,
              borderRadius: 7, padding: '4px 12px'
            }}>
              <div className="pulse-dot" style={{ width: 6, height: 6, borderRadius: '50%', background: DS.green, boxShadow: `0 0 8px ${DS.green}` }} />
              <span style={{ fontSize: 11, color: DS.t2, fontWeight: 600 }}>2025‑A</span>
            </div>
          }
          <div style={{ width: 1, height: 24, background: DS.bd }} />

          <button onClick={() => setLangOpen((v) => !v)} title={t('common.language')} style={{
            width: 36, height: 36, border: `1px solid ${DS.bd}`,
            borderRadius: 9, background: 'transparent',
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: DS.t2, position: 'relative',
          }}>
            <IcoGlobe size={16} />
            <span style={{ position: 'absolute', bottom: -2, right: -2, fontSize: 9 }}>{LOCALES.find((l) => l.code === locale)?.flag}</span>
          </button>

          <button onClick={toggleTheme} title={theme === 'dark' ? t('common.light') : t('common.dark')} style={{
            width: 36, height: 36, border: `1px solid ${DS.bd}`,
            borderRadius: 9, background: 'transparent',
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: theme === 'dark' ? DS.gold : DS.purple, transition: 'all .2s',
          }}>
            {theme === 'dark' ? <IcoSun size={16} /> : <IcoMoon size={16} />}
          </button>

          <div style={{ position: 'relative' }}>
            <button onClick={() => { setNotifOpen((v) => !v); markAllRead(); }} style={{
              position: 'relative', width: 36, height: 36,
              border: `1px solid ${notifOpen ? DS.blue + '55' : DS.bd}`,
              borderRadius: 9,
              background: notifOpen ? DS.blueDim : 'rgba(255,255,255,0.05)',
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: notifOpen ? DS.blueBright : DS.t2,
            }}>
              <IcoBell size={16} />
              {unreadCount > 0 &&
                <span className="pulse-dot" style={{
                  position: 'absolute', top: 7, right: 7,
                  width: 7, height: 7, borderRadius: '50%',
                  background: DS.gold, border: `2px solid ${DS.sidebar}`,
                  boxShadow: `0 0 8px ${DS.gold}`
                }} />
              }
            </button>
            {notifOpen &&
              <div style={{
                position: 'fixed', top: 58, right: 20, width: 340,
                background: DS.card, border: `1px solid ${DS.bdMd}`,
                borderRadius: 16, boxShadow: '0 24px 64px rgba(0,0,0,0.65)',
                zIndex: 2000, overflow: 'hidden',
              }}>
                <div style={{ padding: '14px 18px 12px', borderBottom: `1px solid ${DS.bd}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span className="head" style={{ fontWeight: 700, fontSize: 14, color: DS.t1 }}>{t('notifications.title')}</span>
                  <button onClick={() => setNotifOpen(false)} style={{ background: 'rgba(255,255,255,0.07)', border: 'none', borderRadius: 6, cursor: 'pointer', color: DS.t2, display: 'flex', padding: 5 }}><IcoClose size={13} /></button>
                </div>
                {notifications.length === 0 ? (
                  <div style={{ padding: 24, textAlign: 'center', fontSize: 12, color: DS.t2 }}>{t('notifications.empty')}</div>
                ) : notifications.map((n, i) => (
                  <div key={n.id} style={{
                    display: 'flex', gap: 12, padding: '12px 18px',
                    background: n.unread ? `${DS.blue}0a` : 'transparent',
                    borderBottom: i < notifications.length - 1 ? `1px solid ${DS.bd}` : 'none',
                  }}>
                    <div style={{ width: 34, height: 34, borderRadius: '50%', background: DS.card2, border: `1px solid ${DS.bd}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, flexShrink: 0 }}>{n.icon}</div>
                    <div style={{ flex: 1 }}>
                      <p style={{ margin: 0, fontSize: 12, color: DS.t1, lineHeight: 1.45, fontWeight: n.unread ? 600 : 400 }}>{n.text}</p>
                      <span style={{ fontSize: 11, color: DS.t2 }}>{n.time}</span>
                    </div>
                    {n.unread && <div style={{ width: 7, height: 7, borderRadius: '50%', background: DS.blue, flexShrink: 0, marginTop: 8, boxShadow: `0 0 8px ${DS.blue}` }} />}
                  </div>
                ))}
                <div style={{ padding: '10px 18px', textAlign: 'center', borderTop: `1px solid ${DS.bd}` }}>
                  <button onClick={() => setNotifOpen(false)} style={{ fontSize: 12, color: DS.blueBright, fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer', fontFamily: "'Inter',sans-serif" }}>{t('notifications.viewAll')}</button>
                </div>
              </div>
            }
          </div>

          <div onClick={() => !isTeacher && setProfileOpen(true)} style={{ cursor: 'pointer' }}>
            <Avatar initials={isTeacher ? currentTeacher?.initials || 'TC' : myStudent.initials} size={32} colorIndex={isTeacher ? 5 : 0} />
          </div>
        </header>

        <main style={{ flex: 1, overflowY: 'auto', WebkitOverflowScrolling: 'touch' }}>
          <div key={activeView} className="rise-in">
            {activeView === 'dashboard'   && <ViewDashboard />}
            {activeView === 'leaderboard' && <ViewLeaderboard />}
            {activeView === 'badges'      && <ViewBadges />}
            {activeView === 'progress'    && <ViewProgress />}
            {activeView === 'tasks'       && <ViewStudentTasks />}
            {activeView === 'teacher'     && <ViewTeacher />}
          </div>
        </main>

        {isMobile &&
          <nav style={{ display: 'flex', borderTop: `1px solid ${DS.bd}`, background: DS.sidebar, padding: '6px 0 env(safe-area-inset-bottom)', flexShrink: 0 }}>
            {visibleNav.map((item) => {
              const active = activeView === item.id;
              const Ico = item.icon;
              return (
                <button key={item.id} onClick={() => go(item.id)} style={{
                  flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
                  gap: 3, padding: '6px 4px', border: 'none', background: 'none', cursor: 'pointer',
                  color: active ? DS.blueBright : DS.t3, transition: 'color .15s'
                }}>
                  <Ico size={20} />
                  <span style={{ fontSize: 9, fontWeight: active ? 700 : 500, fontFamily: "'Inter',sans-serif" }}>{t(item.labelKey)}</span>
                </button>
              );
            })}
          </nav>
        }
      </div>

      {toast && <Toast key={toast.id} message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <ProfileModal open={profileOpen} onClose={() => setProfileOpen(false)} />
      {langOpen && <div onClick={() => setLangOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 1500 }} />}
      <LanguageMenu open={langOpen} onClose={() => setLangOpen(false)} current={locale} onChange={setLocale} />
    </div>
  );
}

export default function App() {
  const { loggedIn } = useApp();
  return loggedIn ? <AppShell /> : <LoginScreen />;
}
