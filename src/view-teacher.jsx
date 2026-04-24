
// ─── Teacher View (Docente) ───────────────────────────────────────────────────

function ViewTeacher() {
  const { students, leaderboard, awardXp, awardBadge, showToast } = useApp();
  const [search, setSearch] = React.useState('');
  const [selectedStudent, setSelectedStudent] = React.useState(null);
  const [xpModal, setXpModal] = React.useState(false);
  const [badgeModal, setBadgeModal] = React.useState(false);
  const [xpAmount, setXpAmount] = React.useState('');
  const [xpReason, setXpReason] = React.useState('');
  const [selectedBadge, setSelectedBadge] = React.useState('');

  const sorted = [...leaderboard].filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  const totalXp = students.reduce((a, s) => a + s.xp, 0);
  const avgXp = Math.round(totalXp / students.length);
  const topStudent = leaderboard[0];

  function handleAwardXp() {
    const amt = parseInt(xpAmount);
    if (!selectedStudent || !amt || amt <= 0) return;
    awardXp(selectedStudent.id, amt, xpReason || 'Otorgado por docente');
    setXpModal(false);
    setXpAmount('');
    setXpReason('');
  }

  function handleAwardBadge() {
    if (!selectedStudent || !selectedBadge) return;
    awardBadge(selectedStudent.id, selectedBadge);
    setBadgeModal(false);
    setSelectedBadge('');
  }

  const availableBadges = selectedStudent
    ? BADGES.filter(b => !selectedStudent.earnedBadges.includes(b.id))
    : [];

  return (
    <div className="rise-in" style={{ padding: 'clamp(14px,3vw,28px) clamp(14px,3vw,32px)', maxWidth: 1100, margin: '0 auto' }}>

      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ margin: '0 0 4px', fontSize: 22, fontWeight: 800, color: '#1b2036' }}>Panel del Docente</h1>
        <p style={{ margin: 0, fontSize: 13, color: '#9097b5' }}>Gestión de XP e insignias · Ingeniería en Software</p>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(160px,1fr))', gap: 16, marginBottom: 24 }}>
        <StatCard label="Estudiantes" value={students.length} sub="En el grupo" icon={<IcoTeacher size={18} />} accent="#003087" />
        <StatCard label="XP promedio" value={avgXp.toLocaleString()} sub="Por estudiante" icon={<IcoXp size={18} />} accent="#FFB800" />
        <StatCard label="Líder" value={topStudent?.name.split(' ')[0]} sub={`${topStudent?.xp.toLocaleString()} XP`} icon={<IcoTrophy size={18} />} accent="#b87d00" />
        <StatCard label="Total XP" value={(totalXp / 1000).toFixed(1) + 'K'} sub="En todo el grupo" icon={<IcoStar size={18} />} accent="#1f7a4a" />
      </div>

      {/* Roster */}
      <div style={{ background: '#fff', border: '1px solid #e6e8f1', borderRadius: 16, overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #e6e8f1', display: 'flex', gap: 12, alignItems: 'center' }}>
          <Input placeholder="Buscar estudiante…" value={search} onChange={e => setSearch(e.target.value)}
            icon={<IcoSearch size={15} />} style={{ flex: 1 }} />
          <span style={{ fontSize: 12, color: '#9097b5', whiteSpace: 'nowrap' }}>{sorted.length} estudiantes</span>
        </div>

        {/* Table header */}
        <div style={{ display: 'grid', gridTemplateColumns: window.innerWidth < 600 ? '36px 1fr 80px 70px' : '44px 1fr 100px 80px 80px 120px',
          padding: '10px 20px', borderBottom: '1px solid #ebeef7',
          fontSize: 11, fontWeight: 700, color: '#9097b5', textTransform: 'uppercase', letterSpacing: '.06em' }}>
          <span>#</span><span>Estudiante</span>
          <span style={{ textAlign: 'right' }}>XP</span>
          <span style={{ textAlign: 'center' }}>Nivel</span>
          <span style={{ textAlign: 'center' }}>Insignias</span>
          <span style={{ textAlign: 'center' }}>Acciones</span>
        </div>

        {sorted.map((s, i) => {
          const lvl = getLevelInfo(s.xp);
          return (
            <div key={s.id} style={{ display: 'grid', gridTemplateColumns: window.innerWidth < 600 ? '36px 1fr 80px 70px' : '44px 1fr 100px 80px 80px 120px',
              padding: '10px 20px', alignItems: 'center',
              background: i % 2 === 0 ? '#fff' : '#fafbfd',
              borderBottom: '1px solid #ebeef7', transition: 'background .12s' }}
              onMouseEnter={e => e.currentTarget.style.background = '#eef3fb'}
              onMouseLeave={e => e.currentTarget.style.background = i % 2 === 0 ? '#fff' : '#fafbfd'}>
              <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 12, color: '#9097b5' }}>#{s.rank}</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <Avatar initials={s.initials} size={30} colorIndex={parseInt(s.id.slice(1)) - 1} />
                <div>
                  <div style={{ fontSize: 13, fontWeight: 500, color: '#1b2036' }}>{s.name}</div>
                  <div style={{ fontSize: 11, color: '#9097b5' }}>{lvl.title}</div>
                </div>
              </div>
              <div style={{ textAlign: 'right', fontFamily: 'JetBrains Mono, monospace', fontSize: 13, fontWeight: 700, color: '#1b2036' }}>
                {s.xp.toLocaleString()}
              </div>
              <div style={{ textAlign: 'center' }}>
                <span style={{ background: '#eef3fb', color: '#003087', borderRadius: 6, padding: '3px 8px',
                  fontSize: 11, fontWeight: 700, fontFamily: 'JetBrains Mono, monospace' }}>N{lvl.n}</span>
              </div>
              <div style={{ textAlign: 'center' }}>
                <span style={{ fontSize: 13 }}>{s.earnedBadges.length}</span>
              </div>
              <div style={{ display: 'flex', gap: 6, justifyContent: 'center' }}>
                <button onClick={() => { setSelectedStudent(s); setXpModal(true); }}
                  style={{ padding: '4px 10px', borderRadius: 6, border: '1.5px solid #dde1ef',
                    background: '#fff', cursor: 'pointer', fontSize: 11, fontWeight: 700, color: '#003087',
                    fontFamily: 'Inter, sans-serif', transition: 'all .15s' }}
                  onMouseEnter={e => { e.currentTarget.style.background = '#eef3fb'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = '#fff'; }}>
                  +XP
                </button>
                <button onClick={() => { setSelectedStudent(s); setBadgeModal(true); }}
                  style={{ padding: '4px 10px', borderRadius: 6, border: '1.5px solid #dde1ef',
                    background: '#fff', cursor: 'pointer', fontSize: 11, fontWeight: 700, color: '#b87d00',
                    fontFamily: 'Inter, sans-serif', transition: 'all .15s' }}
                  onMouseEnter={e => { e.currentTarget.style.background = '#fffaec'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = '#fff'; }}>
                  🏅
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Award XP Modal */}
      <Modal open={xpModal} onClose={() => setXpModal(false)} title={`Otorgar XP — ${selectedStudent?.name}`} width={420}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#4a5170', marginBottom: 6 }}>Cantidad de XP</label>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 8 }}>
              {[25, 50, 100, 150, 200, 300].map(v => (
                <button key={v} onClick={() => setXpAmount(String(v))}
                  style={{ padding: '5px 12px', borderRadius: 6, border: '1.5px solid',
                    borderColor: xpAmount === String(v) ? '#003087' : '#dde1ef',
                    background: xpAmount === String(v) ? '#003087' : '#fff',
                    color: xpAmount === String(v) ? '#fff' : '#4a5170',
                    fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'JetBrains Mono, monospace' }}>
                  +{v}
                </button>
              ))}
            </div>
            <Input placeholder="O escribe un valor personalizado…" value={xpAmount}
              onChange={e => setXpAmount(e.target.value.replace(/\D/g, ''))} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#4a5170', marginBottom: 6 }}>Motivo</label>
            <Input placeholder="Ej: Proyecto entregado con excelencia" value={xpReason} onChange={e => setXpReason(e.target.value)} />
          </div>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
            <Btn variant="ghost" onClick={() => setXpModal(false)}>Cancelar</Btn>
            <Btn variant="gold" onClick={handleAwardXp} disabled={!xpAmount || parseInt(xpAmount) <= 0}>
              <IcoXp size={14} /> Otorgar {xpAmount ? `+${xpAmount} XP` : 'XP'}
            </Btn>
          </div>
        </div>
      </Modal>

      {/* Award Badge Modal */}
      <Modal open={badgeModal} onClose={() => setBadgeModal(false)} title={`Otorgar insignia — ${selectedStudent?.name}`} width={500}>
        <div>
          <p style={{ margin: '0 0 14px', fontSize: 13, color: '#6b7293' }}>
            Selecciona una insignia no obtenida por el estudiante:
          </p>
          {availableBadges.length === 0
            ? <EmptyState icon="🏆" title="Sin insignias disponibles" sub="Este estudiante ya tiene todas las insignias" />
            : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 16 }}>
                {availableBadges.map(b => (
                  <div key={b.id} onClick={() => setSelectedBadge(b.id)}
                    style={{ border: `1.5px solid ${selectedBadge === b.id ? '#FFB800' : '#e6e8f1'}`,
                      background: selectedBadge === b.id ? '#fffaec' : '#fafafa',
                      borderRadius: 10, padding: '10px 8px', textAlign: 'center', cursor: 'pointer',
                      transition: 'all .15s' }}>
                    <div style={{ fontSize: 24 }}>{b.icon}</div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: '#1b2036', marginTop: 4 }}>{b.name}</div>
                    <div style={{ fontSize: 10, color: '#9097b5' }}>+{b.xp} XP</div>
                  </div>
                ))}
              </div>
            )
          }
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
            <Btn variant="ghost" onClick={() => setBadgeModal(false)}>Cancelar</Btn>
            <Btn variant="primary" onClick={handleAwardBadge} disabled={!selectedBadge}>
              <IcoGift size={14} /> Otorgar insignia
            </Btn>
          </div>
        </div>
      </Modal>
    </div>
  );
}

Object.assign(window, { ViewTeacher });
