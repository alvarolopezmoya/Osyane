
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

function AppShell() {
  const { activeView, setActiveView, myStudent, levelInfo, toast, setToast } = useApp();
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const [collapsed, setCollapsed] = React.useState(false);

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
                <div style={{ background: '#eef3fb', borderRadius: 10, padding: '10px 12px' }}>
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
            <button style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '5px 12px',
              border: '1px solid #e6e8f1', borderRadius: 8, background: '#fff',
              cursor: 'pointer', fontSize: 12, color: '#4a5170', fontFamily: 'Inter, sans-serif' }}>
              <IcoEye size={14} />
              <span>Nombre real</span>
            </button>
          )}
          <div style={{ width: 1, height: 24, background: '#e6e8f1' }} />
          <button style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center',
            width: 34, height: 34, border: '1px solid #e6e8f1', borderRadius: 8, background: '#fff', cursor: 'pointer', flexShrink: 0 }}>
            <IcoBell size={16} />
            <span style={{ position: 'absolute', top: 6, right: 6, width: 7, height: 7,
              borderRadius: '50%', background: '#FFB800', border: '1.5px solid #fff' }} className="pulse-dot" />
          </button>
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
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
