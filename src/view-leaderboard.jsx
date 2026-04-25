
// ─── Leaderboard / Ranking View ───────────────────────────────────────────────

function ViewLeaderboard() {
  const { leaderboard, myRank, showRealNames, maskName } = useApp();
  const [search, setSearch] = React.useState('');
  const half = Math.ceil(leaderboard.length / 2);

  const filtered = leaderboard.filter(s =>
    maskName(s).toLowerCase().includes(search.toLowerCase())
  );
  const top3 = leaderboard.slice(0, 3);

  return (
    <div className="rise-in" style={{ padding: 'clamp(14px,3vw,28px) clamp(14px,3vw,32px)', maxWidth: 1100, margin: '0 auto' }}>

      {/* ── Podium ── */}
      <div style={{ background: '#fff', border: '1px solid #e6e8f1', borderRadius: 16, padding: '28px 24px 0', marginBottom: 20 }}>
        <SectionHeader title="Podio del grupo" sub="Ingeniería en Software · Semestre 2025-A" />
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: 16 }}>
          <PodiumItem s={top3[1]} height={120} label="2°" medal="🥈" maskName={maskName} />
          <PodiumItem s={top3[0]} height={160} label="1°" medal="🥇" maskName={maskName} />
          <PodiumItem s={top3[2]} height={96}  label="3°" medal="🥉" maskName={maskName} />
        </div>
      </div>

      {/* ── Two column: table + competencias ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) 340px', gap: 18, alignItems: 'start' }}>

        {/* Ranking table */}
        <div style={{ background: '#fff', border: '1px solid #e6e8f1', borderRadius: 16, overflow: 'hidden' }}>
          <div style={{ padding: '14px 18px', borderBottom: '1px solid #e6e8f1', display: 'flex', gap: 12, alignItems: 'center' }}>
            <Input placeholder="Buscar estudiante…" value={search} onChange={e => setSearch(e.target.value)}
              icon={<IcoSearch size={15} />} style={{ flex: 1 }} />
            <span style={{ fontSize: 12, color: '#9097b5', whiteSpace: 'nowrap' }}>{filtered.length} estudiantes</span>
          </div>

          {/* Header */}
          <div style={{ display: 'grid', gridTemplateColumns: '46px 1fr 100px 70px 70px',
            padding: '9px 18px', borderBottom: '1px solid #ebeef7',
            fontSize: 10, fontWeight: 700, color: '#9097b5', textTransform: 'uppercase', letterSpacing: '.07em' }}>
            <span>#</span><span>Estudiante</span>
            <span style={{ textAlign: 'right' }}>XP</span>
            <span style={{ textAlign: 'center' }}>Nivel</span>
            <span style={{ textAlign: 'center' }}>Racha</span>
          </div>

          {filtered.map((s, i) => {
            const lvl = getLevelInfo(s.xp);
            const isBottom = s.rank > half;
            const showRank = s.isMe || !isBottom;
            return (
              <div key={s.id} style={{ display: 'grid', gridTemplateColumns: '46px 1fr 100px 70px 70px',
                padding: '10px 18px', alignItems: 'center',
                background: s.isMe ? '#eef3fb' : i % 2 === 0 ? '#fff' : '#fafbfd',
                borderBottom: '1px solid #ebeef7',
                borderLeft: s.isMe ? '3px solid #003087' : '3px solid transparent',
                transition: 'background .12s' }}
                onMouseEnter={e => { if (!s.isMe) e.currentTarget.style.background = '#f5f7fc'; }}
                onMouseLeave={e => { if (!s.isMe) e.currentTarget.style.background = i % 2 === 0 ? '#fff' : '#fafbfd'; }}>

                {/* Rank — hidden for bottom half non-me */}
                <div>
                  {showRank
                    ? <RankBadge rank={s.rank} />
                    : <div style={{ width: 26, height: 26, borderRadius: 6, background: '#f0f0f0',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, color: '#c0c5da' }}>—</div>
                  }
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Avatar initials={s.initials} size={30} colorIndex={parseInt(s.id.slice(1)) - 1} />
                  <div>
                    <div style={{ fontSize: 13, fontWeight: s.isMe ? 700 : 500, color: '#1b2036' }}>
                      {maskName(s)}
                      {s.isMe && <span style={{ marginLeft: 6, fontSize: 9, fontWeight: 700, background: '#003087', color: '#fff', borderRadius: 4, padding: '1px 5px' }}>TÚ</span>}
                    </div>
                    <div style={{ fontSize: 10, color: '#9097b5' }}>{lvl.title}</div>
                  </div>
                </div>

                <div style={{ textAlign: 'right', fontFamily: 'JetBrains Mono, monospace', fontSize: 13, fontWeight: 700, color: '#1b2036' }}>
                  {isBottom && !s.isMe ? '••••' : s.xp.toLocaleString()}
                </div>

                <div style={{ textAlign: 'center' }}>
                  <span style={{ background: '#eef3fb', color: '#003087', borderRadius: 6, padding: '3px 7px',
                    fontSize: 11, fontWeight: 700, fontFamily: 'JetBrains Mono, monospace' }}>N{lvl.n}</span>
                </div>

                <div style={{ textAlign: 'center', fontSize: 12, color: s.streak >= 7 ? '#b87d00' : '#9097b5' }}>
                  {s.streak > 0 ? `🔥${s.streak}` : '—'}
                </div>
              </div>
            );
          })}

          {myRank && (
            <div style={{ padding: '10px 18px', textAlign: 'center', fontSize: 12, color: '#9097b5', borderTop: '1px solid #ebeef7', background: '#fafbfd' }}>
              Tu posición: <strong style={{ color: '#003087' }}>#{myRank}</strong> de {leaderboard.length} ·
              <span style={{ marginLeft: 6, color: '#c0c5da', fontSize: 11 }}>Los puestos de la mitad inferior están ocultos para otros</span>
            </div>
          )}
        </div>

        {/* Right: competencias + stats */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>

          {/* Radar */}
          <div style={{ background: '#fff', border: '1px solid #e6e8f1', borderRadius: 12, padding: '20px 16px 10px' }}>
            <SectionHeader title="Competencias por área" sub="Tu perfil técnico" />
            <CompetenciasRadar height={240} />
          </div>

          {/* Bar breakdown */}
          <div style={{ background: '#fff', border: '1px solid #e6e8f1', borderRadius: 12, padding: '20px' }}>
            <SectionHeader title="Dominio por área" sub="Vs. promedio del grupo" />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {COMPETENCIAS_DATA.map((c, i) => {
                const avg = 68;
                const colors = ['#003087','#1f7a4a','#b87d00','#7c3aed','#1a56c4','#b5352a'];
                return (
                  <div key={i}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <span style={{ fontSize: 12, fontWeight: 600, color: '#2b3250' }}>{c.area}</span>
                      <span style={{ fontSize: 11, fontFamily: 'JetBrains Mono, monospace', color: c.value >= avg ? '#1f7a4a' : '#b87d00' }}>
                        {c.value}% {c.value >= avg ? '▲' : '▼'}
                      </span>
                    </div>
                    <div style={{ position: 'relative', background: '#ebeef7', borderRadius: 99, height: 7, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${c.value}%`, background: colors[i % colors.length], borderRadius: 99 }} />
                      {/* avg marker */}
                      <div style={{ position: 'absolute', top: 0, bottom: 0, left: `${avg}%`, width: 2, background: 'rgba(15,19,32,0.25)' }} />
                    </div>
                  </div>
                );
              })}
              <div style={{ fontSize: 10, color: '#c0c5da', textAlign: 'right' }}>│ = promedio grupo (68%)</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PodiumItem({ s, height, label, medal, maskName }) {
  if (!s) return <div style={{ width: 130 }} />;
  const lvl = getLevelInfo(s.xp);
  const isFirst = label === '1°';
  return (
    <div style={{ textAlign: 'center', width: 140 }}>
      <div style={{ marginBottom: 10 }}>
        <div style={{ position: 'relative', display: 'inline-block' }}>
          <Avatar initials={s.initials} size={isFirst ? 56 : 44} colorIndex={parseInt(s.id.slice(1)) - 1} />
          <span style={{ position: 'absolute', bottom: -4, right: -4, fontSize: isFirst ? 18 : 14 }}>{medal}</span>
        </div>
        <div style={{ marginTop: 8, fontSize: isFirst ? 14 : 12, fontWeight: 700, color: '#1b2036' }}>
          {maskName ? maskName(s) : s.name.split(' ')[0]}
        </div>
        <div style={{ fontSize: 11, color: '#9097b5' }}>{lvl.title}</div>
        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: isFirst ? 15 : 13, fontWeight: 800, color: '#003087', marginTop: 4 }}>
          {s.xp.toLocaleString()} XP
        </div>
      </div>
      <div style={{ height, background: isFirst ? '#003087' : '#ebeef7',
        borderRadius: '8px 8px 0 0', display: 'flex', alignItems: 'flex-start',
        justifyContent: 'center', paddingTop: 10 }}>
        <span style={{ fontSize: 20, fontWeight: 900, color: isFirst ? 'rgba(255,184,0,0.5)' : '#c0c5da' }}>{label}</span>
      </div>
    </div>
  );
}

Object.assign(window, { ViewLeaderboard });
