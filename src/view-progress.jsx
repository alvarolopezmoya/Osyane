
// ─── Progress View ────────────────────────────────────────────────────────────

// Streak calendar — last 10 weeks (70 days)
function StreakCalendar({ streak }) {
  const days = 70;
  const today = new Date();
  const cells = Array.from({ length: days }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() - (days - 1 - i));
    const daysAgo = days - 1 - i;
    const active = daysAgo < streak ? true : (Math.random() > 0.45 && daysAgo < streak + 12);
    return { date: d, active, intensity: active ? (Math.random() > 0.6 ? 'high' : 'med') : 'none' };
  });
  const weeks = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));
  const intensityColors = { none: '#ebeef7', med: '#93aee8', high: '#003087' };
  return (
    <div>
      <div style={{ display: 'flex', gap: 4 }}>
        {weeks.map((week, wi) => (
          <div key={wi} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {week.map((day, di) => (
              <div key={di} title={day.date.toLocaleDateString('es-EC')}
                style={{ width: 12, height: 12, borderRadius: 3, background: intensityColors[day.intensity],
                  transition: 'transform .1s' }}
                onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.4)'}
                onMouseLeave={e => e.currentTarget.style.transform = ''} />
            ))}
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 10, fontSize: 10, color: '#9097b5' }}>
        <span>Menos</span>
        {['none','med','high'].map(k => (
          <div key={k} style={{ width: 10, height: 10, borderRadius: 2, background: intensityColors[k] }} />
        ))}
        <span>Más actividad</span>
      </div>
    </div>
  );
}

// Grade comparison bars
const GRADES = [
  { subject: 'Prog. OO',    myGrade: 9.2, avgGrade: 7.8, maxGrade: 10 },
  { subject: 'Base Datos',  myGrade: 8.5, avgGrade: 7.2, maxGrade: 10 },
  { subject: 'Redes',       myGrade: 7.8, avgGrade: 7.5, maxGrade: 10 },
  { subject: 'Ing. SW',     myGrade: 8.9, avgGrade: 8.1, maxGrade: 10 },
  { subject: 'Cálculo',     myGrade: 7.1, avgGrade: 6.8, maxGrade: 10 },
];

function GradeComparison() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {GRADES.map((g, i) => (
        <div key={i}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: '#2b3250' }}>{g.subject}</span>
            <div style={{ display: 'flex', gap: 12, fontSize: 12, fontFamily: 'JetBrains Mono, monospace' }}>
              <span style={{ color: '#003087', fontWeight: 700 }}>Tú: {g.myGrade}</span>
              <span style={{ color: '#9097b5' }}>Prom: {g.avgGrade}</span>
            </div>
          </div>
          <div style={{ position: 'relative', height: 10, background: '#ebeef7', borderRadius: 99, overflow: 'hidden' }}>
            {/* avg bar */}
            <div style={{ position: 'absolute', height: '100%', width: `${(g.avgGrade/g.maxGrade)*100}%`, background: '#c0c5da', borderRadius: 99 }} />
            {/* my bar */}
            <div style={{ position: 'absolute', height: '100%', width: `${(g.myGrade/g.maxGrade)*100}%`,
              background: g.myGrade >= g.avgGrade ? '#003087' : '#b87d00', borderRadius: 99,
              transition: 'width .8s ease', opacity: 0.9 }} />
          </div>
        </div>
      ))}
      <div style={{ display: 'flex', gap: 16, fontSize: 11, color: '#9097b5' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ width: 12, height: 6, background: '#003087', borderRadius: 3, display: 'inline-block' }} /> Tu nota
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ width: 12, height: 6, background: '#c0c5da', borderRadius: 3, display: 'inline-block' }} /> Promedio grupo
        </span>
      </div>
    </div>
  );
}

function ViewProgress() {
  const { myStudent, levelInfo } = useApp();
  const [tab, setTab] = React.useState('xp');
  const totalXpEarned = XP_HISTORY.reduce((a, b) => a + b.xp, 0);
  const avgXpPerWeek = Math.round(totalXpEarned / XP_HISTORY.length);
  const bestWeek = XP_HISTORY.reduce((a, b) => a.xp > b.xp ? a : b);
  const tabs = [
    { id: 'xp',      label: 'XP semanal' },
    { id: 'subjects',label: 'Asignaturas' },
    { id: 'grades',  label: 'Calificaciones' },
    { id: 'levels',  label: 'Niveles' },
  ];

  return (
    <div className="rise-in" style={{ padding: 'clamp(14px,3vw,28px) clamp(14px,3vw,32px)', maxWidth: 1100, margin: '0 auto' }}>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px,1fr))', gap: 14, marginBottom: 22 }}>
        <StatCard label="XP Acumulado" value={myStudent.xp.toLocaleString()} sub="Total histórico" icon={<IcoXp size={18} />} accent="#FFB800" />
        <StatCard label="Promedio semanal" value={`${avgXpPerWeek} XP`} sub="Por semana" icon={<IcoProgress size={18} />} accent="#1a56c4" />
        <StatCard label="Mejor semana" value={`${bestWeek.xp} XP`} sub={bestWeek.week} icon={<IcoStar size={18} />} accent="#b87d00" />
        <StatCard label="Nivel actual" value={`N${levelInfo.n}`} sub={levelInfo.title} icon={<IcoAward size={18} />} accent="#003087" />
        <StatCard label="Nota promedio" value="8.3" sub="Sobre 10 en todas las materias" icon={<IcoCheck size={18} />} accent="#1f7a4a" />
      </div>

      {/* Two-column top: level progress + streak calendar */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: 18, marginBottom: 18 }}>

        {/* Level progress */}
        <div style={{ background: '#fff', border: '1px solid #e6e8f1', borderRadius: 12, padding: '20px' }}>
          <SectionHeader title="Progreso de nivel" sub={`Nivel ${levelInfo.n} · ${levelInfo.title}`} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
            <div style={{ width: 52, height: 52, borderRadius: '50%', background: '#003087', flexShrink: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 16, fontWeight: 900, color: '#FFB800', fontFamily: 'JetBrains Mono, monospace' }}>
              N{levelInfo.n}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                <span style={{ fontSize: 12, color: '#6b7293' }}>{levelInfo.min.toLocaleString()} XP</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: '#003087', fontFamily: 'JetBrains Mono, monospace' }}>
                  {myStudent.xp.toLocaleString()} ({Math.round(levelInfo.progress * 100)}%)
                </span>
                <span style={{ fontSize: 12, color: '#6b7293' }}>{levelInfo.max !== Infinity ? `${levelInfo.max.toLocaleString()}` : '∞'}</span>
              </div>
              <XPBar progress={levelInfo.progress} height={10} />
              {levelInfo.max !== Infinity && (
                <div style={{ fontSize: 11, color: '#9097b5', marginTop: 5 }}>
                  Faltan {(levelInfo.max - myStudent.xp).toLocaleString()} XP para el siguiente nivel
                </div>
              )}
            </div>
          </div>
          {/* Level dots */}
          <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
            {LEVELS.map(l => {
              const done = myStudent.xp >= l.max;
              const current = levelInfo.n === l.n;
              return (
                <div key={l.n} title={l.title} style={{ width: 30, height: 30, borderRadius: '50%',
                  background: done ? '#003087' : current ? '#FFB800' : '#ebeef7',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 10, fontWeight: 800, fontFamily: 'JetBrains Mono, monospace',
                  color: done ? '#FFB800' : current ? '#2a1a00' : '#9097b5',
                  border: current ? '2px solid #FFB800' : '2px solid transparent' }}>
                  {l.n}
                </div>
              );
            })}
          </div>
        </div>

        {/* Streak calendar */}
        <div style={{ background: '#fff', border: '1px solid #e6e8f1', borderRadius: 12, padding: '20px' }}>
          <SectionHeader title="Consistencia — últimas 10 semanas" sub={`Racha actual: ${myStudent.streak} días 🔥`} />
          <StreakCalendar streak={myStudent.streak} />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginTop: 16 }}>
            {[
              { label: 'Racha actual', value: `${myStudent.streak}d` },
              { label: 'Mejor racha', value: '22d' },
              { label: 'Días activos', value: '47' },
            ].map((s, i) => (
              <div key={i} style={{ background: '#f5f7fc', borderRadius: 8, padding: '8px 10px', textAlign: 'center' }}>
                <div style={{ fontSize: 16, fontWeight: 800, color: '#1b2036', fontFamily: 'JetBrains Mono, monospace' }}>{s.value}</div>
                <div style={{ fontSize: 10, color: '#9097b5', marginTop: 2 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs: charts */}
      <div style={{ background: '#fff', border: '1px solid #e6e8f1', borderRadius: 12, overflow: 'hidden', marginBottom: 18 }}>
        <div style={{ display: 'flex', borderBottom: '1px solid #e6e8f1', overflowX: 'auto' }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              style={{ padding: '12px 20px', border: 'none', background: 'none', cursor: 'pointer', whiteSpace: 'nowrap',
                fontFamily: 'Inter, sans-serif', fontSize: 13, fontWeight: 600,
                color: tab === t.id ? '#003087' : '#9097b5',
                borderBottom: `2px solid ${tab === t.id ? '#003087' : 'transparent'}` }}>
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
              <SectionHeader title="XP por asignatura" sub="Acumulado en el semestre" />
              <SubjectBarChart data={SUBJECT_XP} />
              <div style={{ marginTop: 20 }}><SubjectProgressBars data={SUBJECT_XP} /></div>
            </>
          )}
          {tab === 'grades' && (
            <>
              <SectionHeader title="Calificaciones vs. promedio" sub="Tu rendimiento comparado con el grupo" />
              <GradeComparison />
            </>
          )}
          {tab === 'levels' && (
            <div>
              <SectionHeader title="Tabla de niveles" sub="Requisitos de XP por nivel" />
              {LEVELS.map((l, i) => {
                const done = myStudent.xp >= l.max;
                const current = levelInfo.n === l.n;
                return (
                  <div key={l.n} style={{ display: 'grid', gridTemplateColumns: '36px 160px 1fr 130px',
                    alignItems: 'center', gap: 12, padding: '10px 0',
                    borderBottom: i < LEVELS.length - 1 ? '1px dashed #ebeef7' : 'none',
                    background: current ? '#fffaec' : 'transparent',
                    paddingLeft: current ? 8 : 0, borderRadius: current ? 8 : 0 }}>
                    <div style={{ width: 30, height: 30, borderRadius: '50%',
                      background: done ? '#003087' : current ? '#FFB800' : '#ebeef7',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 11, fontWeight: 800, fontFamily: 'JetBrains Mono, monospace',
                      color: done ? '#FFB800' : current ? '#2a1a00' : '#9097b5' }}>
                      N{l.n}
                    </div>
                    <span style={{ fontSize: 13, fontWeight: current ? 700 : 500, color: current ? '#1b2036' : '#4a5170' }}>
                      {l.title}
                      {current && <span style={{ marginLeft: 6, fontSize: 9, background: '#FFB800', color: '#2a1a00', borderRadius: 4, padding: '1px 5px', fontWeight: 700 }}>ACTUAL</span>}
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
          )}
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { ViewProgress });
