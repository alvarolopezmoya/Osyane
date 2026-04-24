
// ─── Dashboard View ───────────────────────────────────────────────────────────

function ViewDashboard() {
  const { myStudent, levelInfo, leaderboard, myRank } = useApp();
  const earnedBadges = BADGES.filter(b => myStudent.earnedBadges.includes(b.id)).slice(0, 5);
  const [mounted, setMounted] = React.useState(false);
  const isMobile = window.innerWidth < 768;
  React.useEffect(() => { const t = setTimeout(() => setMounted(true), 50); return () => clearTimeout(t); }, []);

  const xpToNext = levelInfo.max === Infinity ? 0 : levelInfo.max - levelInfo.xp;
  const totalXp = myStudent.xp.toLocaleString();

  return (
    <div className="rise-in" style={{ padding: 'clamp(14px,3vw,28px) clamp(14px,3vw,32px)', maxWidth: 1100, margin: '0 auto' }}>

      {/* Hero XP card */}
      <div style={{ background: '#003087', borderRadius: 16, padding: '28px 32px', marginBottom: 24,
        display: 'grid', gridTemplateColumns: '1fr auto', gap: 24, alignItems: 'center',
        position: 'relative', overflow: 'hidden' }}>
        <div className="hatch-blue" style={{ position: 'absolute', inset: 0, opacity: 0.4 }} />
        <div style={{ position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
            <span style={{ background: '#FFB800', color: '#2a1a00', borderRadius: 6, padding: '2px 10px',
              fontSize: 11, fontWeight: 800, letterSpacing: '.06em' }}>NIVEL {levelInfo.n}</span>
            <span style={{ color: '#FFB800', fontWeight: 700, fontSize: 14 }}>{levelInfo.title}</span>
            {myStudent.streak > 0 && (
              <span style={{ background: 'rgba(255,255,255,0.12)', color: '#fff', borderRadius: 6,
                padding: '2px 10px', fontSize: 11, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}>
                🔥 {myStudent.streak} días
              </span>
            )}
          </div>
          <h1 style={{ margin: '0 0 6px', fontSize: 26, fontWeight: 800, color: '#fff', letterSpacing: '-.01em' }}>
            Bienvenido, {myStudent.name.split(' ')[0]}
          </h1>
          <p style={{ margin: '0 0 16px', color: 'rgba(255,255,255,0.65)', fontSize: 14 }}>
            Ranking #{myRank} · {totalXp} XP acumulado
          </p>
          <div style={{ maxWidth: 380 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12 }}>Progreso al nivel {levelInfo.n + 1}</span>
              <span style={{ color: '#FFB800', fontSize: 12, fontFamily: 'JetBrains Mono, monospace', fontWeight: 700 }}>
                {levelInfo.max !== Infinity ? `${xpToNext.toLocaleString()} XP restantes` : 'Nivel máximo'}
              </span>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.15)', borderRadius: 99, height: 8, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: mounted ? `${Math.round(levelInfo.progress * 100)}%` : '0%',
                background: 'linear-gradient(90deg, #FFB800 0%, #FFD43B 100%)', borderRadius: 99,
                transition: 'width .9s cubic-bezier(.4,0,.2,1)', position: 'relative' }} className="xp-shine" />
            </div>
          </div>
        </div>
        <div style={{ position: 'relative', textAlign: 'center' }}>
          <div style={{ width: 80, height: 80, borderRadius: '50%', background: '#FFB800',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 28, fontWeight: 900, color: '#2a1a00', fontFamily: 'JetBrains Mono, monospace',
            boxShadow: '0 0 0 4px rgba(255,184,0,0.25)', margin: '0 auto' }}>
            N{levelInfo.n}
          </div>
          <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11, marginTop: 8 }}>{earnedBadges.length} insignias</div>
        </div>
      </div>

      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px,1fr))', gap: 12, marginBottom: 24 }}>
        <StatCard label="XP Total" value={totalXp} sub="Puntos de experiencia" icon={<IcoXp size={18} />} accent="#FFB800">
          <div style={{ marginTop: 8 }}><MiniSparkline data={XP_HISTORY.slice(-6)} /></div>
        </StatCard>
        <StatCard label="Ranking" value={`#${myRank}`} sub={`Top ${Math.round(myRank / STUDENTS.length * 100)}% del grupo`} icon={<IcoTrophy size={18} />} accent="#003087" />
        <StatCard label="Racha" value={`${myStudent.streak}d`} sub="Días activo consecutivos" icon={<IcoFlame size={18} />} accent="#b87d00" />
        <StatCard label="Insignias" value={myStudent.earnedBadges.length} sub={`de ${BADGES.length} disponibles`} icon={<IcoBadge size={18} />} accent="#1f7a4a" />
      </div>

      {/* Main two-column grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'clamp(280px,1fr,700px) min(340px,100%)', gap: 20, gridTemplateColumns: window.innerWidth < 900 ? '1fr' : '1fr 340px' }}>

        {/* Left column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

          {/* XP chart */}
          <div style={{ background: '#fff', border: '1px solid #e6e8f1', borderRadius: 12, padding: '20px 20px 14px' }}>
            <SectionHeader title="XP semanal" sub="Últimas 12 semanas" />
            <XPAreaChart data={XP_HISTORY} />
          </div>

          {/* Subject progress */}
          <div style={{ background: '#fff', border: '1px solid #e6e8f1', borderRadius: 12, padding: '20px 20px 22px' }}>
            <SectionHeader title="Progreso por asignatura" sub="XP acumulado vs máximo posible" />
            <SubjectProgressBars data={SUBJECT_XP} />
          </div>
        </div>

        {/* Right column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

          {/* Mini leaderboard */}
          <div style={{ background: '#fff', border: '1px solid #e6e8f1', borderRadius: 12, padding: '20px' }}>
            <SectionHeader title="Top del grupo" sub="Por XP total" />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {leaderboard.slice(0, 5).map(s => (
                <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: 10,
                  padding: '8px 10px', borderRadius: 8,
                  background: s.isMe ? '#eef3fb' : 'transparent',
                  border: s.isMe ? '1px solid #c5d4f0' : '1px solid transparent' }}>
                  <RankBadge rank={s.rank} />
                  <Avatar initials={s.initials} size={30} colorIndex={parseInt(s.id.slice(1)) - 1} />
                  <span style={{ flex: 1, fontSize: 13, fontWeight: s.isMe ? 700 : 500, color: '#1b2036', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {s.name}{s.isMe ? ' (tú)' : ''}
                  </span>
                  <span style={{ fontSize: 12, fontFamily: 'JetBrains Mono, monospace', color: '#6b7293', flexShrink: 0 }}>
                    {s.xp.toLocaleString()}
                  </span>
                </div>
              ))}
              {myRank > 5 && (
                <>
                  <div style={{ textAlign: 'center', color: '#c0c5da', fontSize: 18, letterSpacing: 4 }}>···</div>
                  {leaderboard.filter(s => s.isMe).map(s => (
                    <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: 10,
                      padding: '8px 10px', borderRadius: 8, background: '#eef3fb', border: '1px solid #c5d4f0' }}>
                      <RankBadge rank={s.rank} />
                      <Avatar initials={s.initials} size={30} colorIndex={0} />
                      <span style={{ flex: 1, fontSize: 13, fontWeight: 700, color: '#1b2036' }}>Tú</span>
                      <span style={{ fontSize: 12, fontFamily: 'JetBrains Mono, monospace', color: '#6b7293' }}>{s.xp.toLocaleString()}</span>
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>

          {/* Recent activity */}
          <div style={{ background: '#fff', border: '1px solid #e6e8f1', borderRadius: 12, padding: '20px' }}>
            <SectionHeader title="Actividad reciente" />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {ACTIVITY_FEED.map((a, i) => (
                <div key={a.id}>
                  <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', padding: '9px 0' }}>
                    <div style={{ width: 30, height: 30, borderRadius: '50%', background: '#f5f7fc',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, flexShrink: 0 }}>
                      {a.icon}
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ margin: 0, fontSize: 12, color: '#2b3250', lineHeight: 1.4 }}>{a.text}</p>
                      <span style={{ fontSize: 11, color: '#9097b5' }}>{a.time}</span>
                    </div>
                    {a.xp && <span style={{ fontSize: 12, fontWeight: 700, color: '#1f7a4a', fontFamily: 'JetBrains Mono, monospace', flexShrink: 0 }}>+{a.xp}</span>}
                  </div>
                  {i < ACTIVITY_FEED.length - 1 && <div style={{ borderTop: '1px dashed #ebeef7' }} />}
                </div>
              ))}
            </div>
          </div>

          {/* Earned badges preview */}
          <div style={{ background: '#fff', border: '1px solid #e6e8f1', borderRadius: 12, padding: '20px' }}>
            <SectionHeader title="Mis insignias" sub={`${myStudent.earnedBadges.length} obtenidas`} />
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              {earnedBadges.map(b => (
                <div key={b.id} title={b.name} style={{ width: 44, height: 44, borderRadius: 10,
                  background: '#fffaec', border: '1.5px solid #FFB800',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>
                  {b.icon}
                </div>
              ))}
              {myStudent.earnedBadges.length > 5 && (
                <div style={{ width: 44, height: 44, borderRadius: 10, background: '#ebeef7',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 11, fontWeight: 700, color: '#6b7293' }}>
                  +{myStudent.earnedBadges.length - 5}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { ViewDashboard });
