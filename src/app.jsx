
// ─── App Shell (mobile-responsive) ───────────────────────────────────────────

const NAV_ITEMS = [
  { id: 'dashboard',   label: 'Dashboard',  icon: IcoDashboard, num: 1 },
  { id: 'leaderboard', label: 'Ranking',    icon: IcoRanking,   num: 2 },
  { id: 'badges',      label: 'Insignias',  icon: IcoBadge,     num: 3 },
  { id: 'progress',    label: 'Progreso',   icon: IcoProgress,  num: 4 },
  { id: 'teacher',     label: 'Docente',    icon: IcoTeacher,   num: 5 },
];

const VIEW_LABELS = {
  dashboard:   'Panel del estudiante',
  leaderboard: 'Ranking',
  badges:      'Insignias',
  progress:    'Progreso',
  teacher:     'Panel del Docente',
};

function useIsMobile() {
  const [mobile, setMobile] = React.useState(window.innerWidth < 768);
  React.useEffect(() => {
    const fn = () => setMobile(window.innerWidth < 768);
    window.addEventListener('resize', fn);
    return () => window.removeEventListener('resize', fn);
  }, []);
  return mobile;
}

function App() {
  return (
    <AppProvider>
      <AppShell />
    </AppProvider>
  );
}

// ── Profile Modal ──────────────────────────────────────────────────────────────
function ProfileModal({ open, onClose }) {
  const { myStudent, levelInfo, myRank, leaderboard } = useApp();
  if (!open) return null;
  const earnedBadges = BADGES.filter(b => myStudent.earnedBadges.includes(b.id));
  const xpToNext = levelInfo.max === Infinity ? 0 : levelInfo.max - levelInfo.xp;

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,19,32,0.5)', zIndex: 1000,
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}
      onClick={onClose}>
      <div onClick={e => e.stopPropagation()} className="rise-in"
        style={{ background: '#fff', borderRadius: 18, width: 420, maxWidth: '100%',
          boxShadow: '0 24px 80px rgba(15,19,32,0.22)', overflow: 'hidden' }}>

        {/* Header banner */}
        <div style={{ background: '#003087', padding: '28px 28px 20px', position: 'relative', overflow: 'hidden' }}>
          <div className="hatch-blue" style={{ position: 'absolute', inset: 0, opacity: 0.35 }} />
          <button onClick={onClose} style={{ position: 'absolute', top: 14, right: 14, background: 'rgba(255,255,255,0.15)',
            border: 'none', borderRadius: 6, cursor: 'pointer', color: '#fff', display: 'flex', padding: 6 }}>
            <IcoClose size={14} />
          </button>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 18 }}>
            <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#FFB800',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 22, fontWeight: 900, color: '#2a1a00', fontFamily: 'JetBrains Mono, monospace',
              boxShadow: '0 0 0 4px rgba(255,184,0,0.25)', flexShrink: 0 }}>
              {myStudent.initials}
            </div>
            <div>
              <div style={{ fontSize: 18, fontWeight: 800, color: '#fff', marginBottom: 4 }}>{myStudent.name}</div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                <span style={{ background: '#FFB800', color: '#2a1a00', borderRadius: 5, padding: '2px 8px',
                  fontSize: 10, fontWeight: 800, letterSpacing: '.05em' }}>N{levelInfo.n} · {levelInfo.title}</span>
                {myStudent.streak > 0 && (
                  <span style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', borderRadius: 5,
                    padding: '2px 8px', fontSize: 10, fontWeight: 700 }}>🔥 {myStudent.streak} días</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Body */}
        <div style={{ padding: '20px 28px 24px' }}>
          {/* XP bar */}
          <div style={{ marginBottom: 18 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ fontSize: 12, color: '#6b7293' }}>Progreso al nivel {levelInfo.n + 1}</span>
              <span style={{ fontSize: 12, fontFamily: 'JetBrains Mono, monospace', fontWeight: 700, color: '#003087' }}>
                {myStudent.xp.toLocaleString()} XP
              </span>
            </div>
            <XPBar progress={levelInfo.progress} height={8} />
            <div style={{ fontSize: 11, color: '#9097b5', marginTop: 5, textAlign: 'right' }}>
              {levelInfo.max !== Infinity ? `Faltan ${xpToNext.toLocaleString()} XP` : 'Nivel máximo'}
            </div>
          </div>

          {/* Stats grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 18 }}>
            {[
              { label: 'XP Total', value: myStudent.xp.toLocaleString() },
              { label: 'Ranking', value: `#${myRank}` },
              { label: 'Insignias', value: earnedBadges.length },
            ].map((s, i) => (
              <div key={i} style={{ background: '#f5f7fc', borderRadius: 10, padding: '10px 12px', textAlign: 'center' }}>
                <div style={{ fontSize: 17, fontWeight: 800, color: '#1b2036', fontFamily: 'JetBrains Mono, monospace' }}>{s.value}</div>
                <div style={{ fontSize: 10, color: '#9097b5', marginTop: 3, fontWeight: 600, letterSpacing: '.04em', textTransform: 'uppercase' }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Badges earned */}
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#9097b5', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 10 }}>
              Insignias obtenidas
            </div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {earnedBadges.map(b => (
                <div key={b.id} title={b.name} style={{ width: 38, height: 38, borderRadius: 9,
                  background: '#fffaec', border: '1.5px solid #FFB800',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>
                  {b.icon}
                </div>
              ))}
              {earnedBadges.length === 0 && (
                <span style={{ fontSize: 12, color: '#c0c5da' }}>Aún no has ganado insignias</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AppShell() {
  const { activeView, setActiveView, myStudent, levelInfo, toast, setToast,
    showRealNames, setShowRealNames, notifications, unreadCount, notifOpen, setNotifOpen, markAllRead } = useApp();
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const [collapsed, setCollapsed] = React.useState(false);
  const [profileOpen, setProfileOpen] = React.useState(false);

  // Close sidebar on nav on mobile
  function navigate(id) {
    setActiveView(id);
    if (isMobile) setSidebarOpen(false);
  }

  const showSidebar = isMobile ? sidebarOpen : true;
  const sidebarWidth = isMobile ? 220 : (collapsed ? 64 : 200);

  return (
    <div style={{ display: 'flex', height: '100dvh', background: '#fbfaf6', fontFamily: 'Inter, sans-serif', overflow: 'hidden', position: 'relative' }}>

      {/* Mobile overlay */}
      {isMobile && sidebarOpen && (
        <div onClick={() => setSidebarOpen(false)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(15,19,32,0.45)', zIndex: 90 }} />
      )}

      {/* Sidebar */}
      {(showSidebar || !isMobile) && (
        <aside style={{
          width: sidebarWidth, flexShrink: 0, background: '#fff',
          borderRight: '1px solid #e6e8f1', display: 'flex', flexDirection: 'column',
          transition: 'width .2s ease, transform .25s ease',
          overflow: 'hidden',
          ...(isMobile ? {
            position: 'fixed', top: 0, left: 0, bottom: 0, zIndex: 100,
            transform: sidebarOpen ? 'translateX(0)' : 'translateX(-100%)',
            boxShadow: sidebarOpen ? '4px 0 24px rgba(15,19,32,0.18)' : 'none',
          } : {})
        }}>

          {/* Logo area */}
          <div style={{ padding: '14px 16px 12px', borderBottom: '1px solid #ebeef7' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <img src="assets/uta-logo.jpg" alt="UTA"
                style={{ width: 36, height: 36, borderRadius: 8, objectFit: 'cover', flexShrink: 0 }} />
              {(!collapsed || isMobile) && (
                <div style={{ overflow: 'hidden' }}>
                  <div style={{ fontSize: 13, fontWeight: 800, color: '#003087', whiteSpace: 'nowrap' }}>Osyane</div>
                  <div style={{ fontSize: 10, color: '#9097b5', whiteSpace: 'nowrap' }}>FISEI · UTA</div>
                </div>
              )}
            </div>
          </div>

          {/* Nav */}
          <nav style={{ padding: '12px 8px', flex: 1 }}>
            {(!collapsed || isMobile) && (
              <div style={{ fontSize: 9, fontWeight: 700, color: '#c0c5da', letterSpacing: '.1em',
                padding: '0 8px', marginBottom: 8, textTransform: 'uppercase' }}>Navegación</div>
            )}
            {NAV_ITEMS.map(item => {
              const active = activeView === item.id;
              const IcoComponent = item.icon;
              return (
                <button key={item.id} onClick={() => navigate(item.id)}
                  title={(collapsed && !isMobile) ? item.label : ''}
                  style={{ width: '100%', display: 'flex', alignItems: 'center',
                    gap: (collapsed && !isMobile) ? 0 : 8,
                    padding: (collapsed && !isMobile) ? '10px' : '10px 10px',
                    justifyContent: (collapsed && !isMobile) ? 'center' : 'flex-start',
                    borderRadius: 8, border: 'none', cursor: 'pointer', marginBottom: 2,
                    background: active ? '#003087' : 'transparent',
                    color: active ? '#fff' : '#4a5170',
                    transition: 'all .15s', fontFamily: 'Inter, sans-serif' }}
                  onMouseEnter={e => { if (!active) e.currentTarget.style.background = '#eef3fb'; }}
                  onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent'; }}>
                  <IcoComponent size={17} />
                  {(!collapsed || isMobile) && (
                    <>
                      <span style={{ flex: 1, fontSize: 13, fontWeight: active ? 700 : 500, textAlign: 'left' }}>{item.label}</span>
                      <span style={{ fontSize: 10, fontWeight: 700, opacity: 0.4, fontFamily: 'JetBrains Mono, monospace' }}>{item.num}</span>
                    </>
                  )}
                </button>
              );
            })}
          </nav>

          {/* User card */}
          <div style={{ padding: '12px 10px', borderTop: '1px solid #ebeef7' }}>
            {(collapsed && !isMobile)
              ? <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <Avatar initials={myStudent.initials} size={32} colorIndex={0} />
                </div>
              : (
                <div onClick={() => setProfileOpen(true)}
                  style={{ background: '#eef3fb', borderRadius: 10, padding: '10px 12px', cursor: 'pointer', transition: 'background .15s' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#dce8fa'}
                  onMouseLeave={e => e.currentTarget.style.background = '#eef3fb'}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                    <Avatar initials={myStudent.initials} size={30} colorIndex={0} />
                    <div style={{ overflow: 'hidden' }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: '#1b2036', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{myStudent.name}</div>
                      <div style={{ fontSize: 10, color: '#9097b5' }}>N{levelInfo.n} · {levelInfo.title}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                    <span style={{ fontSize: 10, color: '#9097b5', fontWeight: 600, letterSpacing: '.04em' }}>XP</span>
                    <span style={{ fontSize: 10, fontFamily: 'JetBrains Mono, monospace', color: '#6b7293' }}>{myStudent.xp.toLocaleString()}</span>
                  </div>
                  <XPBar progress={levelInfo.progress} height={4} shine={false} />
                </div>
              )
            }
            {!isMobile && (
              <button onClick={() => setCollapsed(c => !c)}
                style={{ width: '100%', marginTop: 8, padding: '6px', borderRadius: 6,
                  border: '1px solid #ebeef7', background: 'none', cursor: 'pointer', color: '#9097b5',
                  display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <IcoChevron size={14} dir={collapsed ? 'right' : 'left'} />
              </button>
            )}
            {(!collapsed || isMobile) && (
              <p style={{ fontSize: 9, color: '#c0c5da', textAlign: 'center', margin: '8px 0 0', lineHeight: 1.4 }}>
                Sistema de Gamificación<br />y Ranking Académico<br />Prototipo MVP · 2025-A
              </p>
            )}
          </div>
        </aside>
      )}

      {/* Main content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>

        {/* Top bar */}
        <header style={{ height: 52, borderBottom: '1px solid #e6e8f1', background: '#fff',
          display: 'flex', alignItems: 'center', padding: '0 16px', gap: 8, flexShrink: 0 }}>

          {/* Mobile hamburger */}
          {isMobile && (
            <button onClick={() => setSidebarOpen(s => !s)}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center',
                width: 34, height: 34, border: '1px solid #e6e8f1', borderRadius: 8,
                background: '#fff', cursor: 'pointer', marginRight: 4, flexShrink: 0 }}>
              <IcoMenu size={18} />
            </button>
          )}

          {/* UTA logo always visible in topbar */}
          <img src="assets/uta-logo.jpg" alt="UTA"
            style={{ width: 28, height: 28, borderRadius: 6, objectFit: 'cover', flexShrink: 0 }} />

          {!isMobile && (
            <>
              <span style={{ fontSize: 12, color: '#9097b5' }}>FISEI</span>
              <IcoChevron size={12} dir="right" />
              <span style={{ fontSize: 12, color: '#9097b5' }}>Ingeniería en Software</span>
              <IcoChevron size={12} dir="right" />
            </>
          )}
          <span style={{ fontSize: isMobile ? 14 : 12, fontWeight: 700, color: '#1b2036', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {VIEW_LABELS[activeView]}
          </span>

          <div style={{ flex: 1 }} />

          {!isMobile && (
            <button onClick={() => setShowRealNames(v => !v)}
              style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '5px 12px',
                border: '1px solid #e6e8f1', borderRadius: 8,
                background: showRealNames ? '#fff' : '#eef3fb',
                cursor: 'pointer', fontSize: 12,
                color: showRealNames ? '#4a5170' : '#003087',
                fontFamily: 'Inter, sans-serif', transition: 'all .15s' }}>
              <IcoEye size={14} />
              <span>{showRealNames ? 'Ocultar nombres' : 'Mostrar nombres'}</span>
            </button>
          )}
          <div style={{ width: 1, height: 24, background: '#e6e8f1' }} />
          <div style={{ position: 'relative' }}>
            <button onClick={() => { setNotifOpen(v => !v); markAllRead(); }}
              style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center',
                width: 34, height: 34, border: '1px solid #e6e8f1', borderRadius: 8, background: notifOpen ? '#eef3fb' : '#fff',
                cursor: 'pointer', flexShrink: 0 }}>
              <IcoBell size={16} />
              {unreadCount > 0 && (
                <span style={{ position: 'absolute', top: 5, right: 5, width: 8, height: 8,
                  borderRadius: '50%', background: '#FFB800', border: '1.5px solid #fff' }} className="pulse-dot" />
              )}
            </button>
            {notifOpen && (
              <div style={{ position: 'absolute', top: 42, right: 0, width: 320, background: '#fff',
                border: '1px solid #e6e8f1', borderRadius: 14, boxShadow: '0 12px 40px rgba(15,19,32,0.15)',
                zIndex: 500, overflow: 'hidden' }}>
                <div style={{ padding: '14px 18px 10px', borderBottom: '1px solid #ebeef7', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 700, fontSize: 14, color: '#1b2036' }}>Notificaciones</span>
                  <button onClick={() => setNotifOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9097b5', display: 'flex' }}>
                    <IcoClose size={14} />
                  </button>
                </div>
                {notifications.map((n, i) => (
                  <div key={n.id} style={{ display: 'flex', gap: 12, padding: '11px 18px',
                    background: n.unread ? '#f8f9ff' : '#fff',
                    borderBottom: i < notifications.length - 1 ? '1px solid #f0f2f8' : 'none',
                    transition: 'background .12s' }}
                    onMouseEnter={e => e.currentTarget.style.background = '#f0f4ff'}
                    onMouseLeave={e => e.currentTarget.style.background = n.unread ? '#f8f9ff' : '#fff'}>
                    <div style={{ width: 34, height: 34, borderRadius: '50%', background: '#f5f7fc',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, flexShrink: 0 }}>
                      {n.icon}
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ margin: 0, fontSize: 12, color: '#2b3250', lineHeight: 1.4, fontWeight: n.unread ? 600 : 400 }}>{n.text}</p>
                      <span style={{ fontSize: 11, color: '#b0b6cc' }}>{n.time}</span>
                    </div>
                    {n.unread && <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#003087', flexShrink: 0, marginTop: 6 }} />}
                  </div>
                ))}
                <div style={{ padding: '10px 18px', textAlign: 'center', borderTop: '1px solid #ebeef7' }}>
                  <button onClick={() => setNotifOpen(false)} style={{ fontSize: 12, color: '#003087', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}>
                    Ver todas las notificaciones
                  </button>
                </div>
              </div>
            )}
          </div>
        </header>

        {/* View content */}
        <main style={{ flex: 1, overflowY: 'auto', WebkitOverflowScrolling: 'touch' }}>
          {activeView === 'dashboard'   && <ViewDashboard />}
          {activeView === 'leaderboard' && <ViewLeaderboard />}
          {activeView === 'badges'      && <ViewBadges />}
          {activeView === 'progress'    && <ViewProgress />}
          {activeView === 'teacher'     && <ViewTeacher />}
        </main>

        {/* Mobile bottom nav */}
        {isMobile && (
          <nav style={{ display: 'flex', borderTop: '1px solid #e6e8f1', background: '#fff',
            padding: '6px 0 env(safe-area-inset-bottom)', flexShrink: 0 }}>
            {NAV_ITEMS.map(item => {
              const active = activeView === item.id;
              const IcoComponent = item.icon;
              return (
                <button key={item.id} onClick={() => navigate(item.id)}
                  style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
                    gap: 2, padding: '6px 4px', border: 'none', background: 'none', cursor: 'pointer',
                    color: active ? '#003087' : '#9097b5', fontFamily: 'Inter, sans-serif',
                    transition: 'color .15s' }}>
                  <IcoComponent size={20} />
                  <span style={{ fontSize: 9, fontWeight: active ? 700 : 500 }}>{item.label}</span>
                </button>
              );
            })}
          </nav>
        )}
      </div>

      {/* Toast */}
      {toast && <Toast key={toast.id} message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* Profile Modal */}
      <ProfileModal open={profileOpen} onClose={() => setProfileOpen(false)} />
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
