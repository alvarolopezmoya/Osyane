
// ─── Progress View ────────────────────────────────────────────────────────────

function ViewProgress() {
  const { myStudent, levelInfo } = useApp();
  const [tab, setTab] = React.useState('xp');

  const totalXpEarned = XP_HISTORY.reduce((a, b) => a + b.xp, 0);
  const avgXpPerWeek = Math.round(totalXpEarned / XP_HISTORY.length);
  const bestWeek = XP_HISTORY.reduce((a, b) => a.xp > b.xp ? a : b);

  const tabs = [
    { id: 'xp',       label: 'XP semanal' },
    { id: 'subjects', label: 'Asignaturas' },
    { id: 'levels',   label: 'Niveles' },
  ];

  return (
    <div className="rise-in" style={{ padding: 'clamp(14px,3vw,28px) clamp(14px,3vw,32px)', maxWidth: 960, margin: '0 auto' }}>

      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(160px,1fr))', gap: 16, marginBottom: 24 }}>
        <StatCard label="XP Acumulado" value={myStudent.xp.toLocaleString()} sub="Total histórico" icon={<IcoXp size={18} />} accent="#FFB800" />
        <StatCard label="Promedio semanal" value={avgXpPerWeek} sub="XP por semana" icon={<IcoProgress size={18} />} accent="#1a56c4" />
        <StatCard label="Mejor semana" value={`${bestWeek.xp} XP`} sub={bestWeek.week} icon={<IcoStar size={18} />} accent="#b87d00" />
        <StatCard label="Nivel actual" value={`N${levelInfo.n}`} sub={levelInfo.title} icon={<IcoAward size={18} />} accent="#003087" />
      </div>

      {/* Level timeline */}
      <div style={{ background: '#fff', border: '1px solid #e6e8f1', borderRadius: 12, padding: '20px', marginBottom: 20 }}>
        <SectionHeader title="Progreso de nivel" sub={`Nivel ${levelInfo.n} · ${levelInfo.title}`} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
          <div style={{ textAlign: 'center', minWidth: 60 }}>
            <div style={{ fontSize: 11, color: '#9097b5', marginBottom: 4 }}>Nivel actual</div>
            <div style={{ width: 48, height: 48, borderRadius: '50%', background: '#003087',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 16, fontWeight: 900, color: '#FFB800', fontFamily: 'JetBrains Mono, monospace', margin: '0 auto' }}>
              N{levelInfo.n}
            </div>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ fontSize: 12, color: '#6b7293' }}>{levelInfo.min.toLocaleString()} XP</span>
              <span style={{ fontSize: 12, fontWeight: 700, color: '#003087', fontFamily: 'JetBrains Mono, monospace' }}>
                {myStudent.xp.toLocaleString()} XP ({Math.round(levelInfo.progress * 100)}%)
              </span>
              <span style={{ fontSize: 12, color: '#6b7293' }}>{levelInfo.max !== Infinity ? `${levelInfo.max.toLocaleString()} XP` : '∞'}</span>
            </div>
            <XPBar progress={levelInfo.progress} height={10} />
          </div>
          <div style={{ textAlign: 'center', minWidth: 60 }}>
            <div style={{ fontSize: 11, color: '#9097b5', marginBottom: 4 }}>Siguiente</div>
            <div style={{ width: 48, height: 48, borderRadius: '50%', background: '#ebeef7',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 16, fontWeight: 900, color: '#9097b5', fontFamily: 'JetBrains Mono, monospace', margin: '0 auto' }}>
              N{Math.min(levelInfo.n + 1, 10)}
            </div>
          </div>
        </div>

        {/* All levels */}
        <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 4 }}>
          {LEVELS.map(l => {
            const done = myStudent.xp >= l.max;
            const current = levelInfo.n === l.n;
            return (
              <div key={l.n} style={{ flex: '0 0 auto', textAlign: 'center', minWidth: 64 }}>
                <div style={{ width: 36, height: 36, borderRadius: '50%', margin: '0 auto 4px',
                  background: done ? '#003087' : current ? '#FFB800' : '#ebeef7',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 12, fontWeight: 800, fontFamily: 'JetBrains Mono, monospace',
                  color: done ? '#FFB800' : current ? '#2a1a00' : '#9097b5',
                  border: current ? '2px solid #FFB800' : '2px solid transparent',
                  boxShadow: current ? '0 0 0 3px rgba(255,184,0,0.2)' : 'none' }}>
                  N{l.n}
                </div>
                <div style={{ fontSize: 9, color: current ? '#003087' : '#9097b5', fontWeight: current ? 700 : 400, whiteSpace: 'nowrap' }}>{l.title}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Tab charts */}
      <div style={{ background: '#fff', border: '1px solid #e6e8f1', borderRadius: 12, overflow: 'hidden' }}>
        {/* Tabs */}
        <div style={{ display: 'flex', borderBottom: '1px solid #e6e8f1' }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              style={{ padding: '12px 20px', border: 'none', background: 'none', cursor: 'pointer',
                fontFamily: 'Inter, sans-serif', fontSize: 13, fontWeight: 600,
                color: tab === t.id ? '#003087' : '#9097b5',
                borderBottom: `2px solid ${tab === t.id ? '#003087' : 'transparent'}`,
                transition: 'all .15s' }}>
              {t.label}
            </button>
          ))}
        </div>

        <div style={{ padding: '20px' }}>
          {tab === 'xp' && (
            <>
              <SectionHeader title="XP ganado por semana" sub="Últimas 12 semanas del semestre" />
              <XPAreaChart data={XP_HISTORY} />
            </>
          )}
          {tab === 'subjects' && (
            <>
              <SectionHeader title="Distribución por asignatura" sub="XP acumulado en cada materia" />
              <SubjectBarChart data={SUBJECT_XP} />
              <div style={{ marginTop: 20 }}><SubjectProgressBars data={SUBJECT_XP} /></div>
            </>
          )}
          {tab === 'levels' && (
            <div>
              <SectionHeader title="Tabla de niveles" sub="Requisitos de XP por nivel" />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                {LEVELS.map((l, i) => {
                  const done = myStudent.xp >= l.max;
                  const current = levelInfo.n === l.n;
                  return (
                    <div key={l.n} style={{ display: 'grid', gridTemplateColumns: '40px 140px 1fr 120px',
                      alignItems: 'center', gap: 12, padding: '10px 0',
                      borderBottom: i < LEVELS.length - 1 ? '1px dashed #ebeef7' : 'none',
                      background: current ? '#fffaec' : 'transparent',
                      marginLeft: current ? -8 : 0, marginRight: current ? -8 : 0,
                      paddingLeft: current ? 8 : 0, paddingRight: current ? 8 : 0, borderRadius: current ? 8 : 0 }}>
                      <div style={{ width: 32, height: 32, borderRadius: '50%',
                        background: done ? '#003087' : current ? '#FFB800' : '#ebeef7',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 11, fontWeight: 800, fontFamily: 'JetBrains Mono, monospace',
                        color: done ? '#FFB800' : current ? '#2a1a00' : '#9097b5' }}>
                        N{l.n}
                      </div>
                      <span style={{ fontSize: 13, fontWeight: current ? 700 : 500, color: current ? '#1b2036' : '#4a5170' }}>
                        {l.title}{current && <span style={{ marginLeft: 6, fontSize: 10, background: '#FFB800', color: '#2a1a00', borderRadius: 4, padding: '1px 5px', fontWeight: 700 }}>ACTUAL</span>}
                      </span>
                      <div style={{ fontSize: 12, color: '#9097b5', fontFamily: 'JetBrains Mono, monospace' }}>
                        {l.min.toLocaleString()} — {l.max === Infinity ? '∞' : l.max.toLocaleString()} XP
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        {done && !current && <span style={{ color: '#1f7a4a', fontSize: 12, fontWeight: 700 }}>✓ Completado</span>}
                        {current && <span style={{ color: '#b87d00', fontSize: 12, fontWeight: 700 }}>⚡ En progreso</span>}
                        {!done && !current && <span style={{ color: '#c0c5da', fontSize: 12 }}>Bloqueado</span>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { ViewProgress });
