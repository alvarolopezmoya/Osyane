
// ─── Leaderboard / Ranking View ───────────────────────────────────────────────

function ViewLeaderboard() {
  const { leaderboard, myRank } = useApp();
  const [search, setSearch] = React.useState('');
  const [filter, setFilter] = React.useState('all');

  const filtered = leaderboard.filter(s => {
    const q = search.toLowerCase();
    return s.name.toLowerCase().includes(q);
  });

  const top3 = leaderboard.slice(0, 3);

  return (
    <div className="rise-in" style={{ padding: 'clamp(14px,3vw,28px) clamp(14px,3vw,32px)', maxWidth: 900, margin: '0 auto' }}>

      {/* Podium */}
      <div style={{ background: '#fff', border: '1px solid #e6e8f1', borderRadius: 16, padding: '28px 24px 0', marginBottom: 24 }}>
        <SectionHeader title="Podio del grupo" sub="Ingeniería en Software · Semestre actual" />
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: 16, paddingBottom: 0 }}>
          {/* 2nd */}
          <PodiumItem s={top3[1]} height={120} label="2°" medal="🥈" />
          {/* 1st */}
          <PodiumItem s={top3[0]} height={160} label="1°" medal="🥇" />
          {/* 3rd */}
          <PodiumItem s={top3[2]} height={96} label="3°" medal="🥉" />
        </div>
      </div>

      {/* Table */}
      <div style={{ background: '#fff', border: '1px solid #e6e8f1', borderRadius: 16, overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #e6e8f1', display: 'flex', alignItems: 'center', gap: 12 }}>
          <Input placeholder="Buscar estudiante…" value={search} onChange={e => setSearch(e.target.value)}
            icon={<IcoSearch size={15} />} style={{ flex: 1 }} />
          <span style={{ fontSize: 12, color: '#9097b5', whiteSpace: 'nowrap' }}>{filtered.length} estudiantes</span>
        </div>

        {/* Header */}
        <div style={{ display: 'grid', gridTemplateColumns: 'clamp(36px,52px,52px) 1fr 90px 70px',
          padding: '10px 16px', borderBottom: '1px solid #ebeef7',
          fontSize: 11, fontWeight: 700, color: '#9097b5', textTransform: 'uppercase', letterSpacing: '.06em' }}>
          <span>#</span><span>Estudiante</span><span style={{ textAlign: 'right' }}>XP</span>
          <span style={{ textAlign: 'center' }}>Nivel</span>
        </div>

        <div>
          {filtered.map((s, i) => {
            const lvl = getLevelInfo(s.xp);
            return (
              <div key={s.id} style={{ display: 'grid', gridTemplateColumns: 'clamp(36px,52px,52px) 1fr 90px 70px',
                padding: '11px 16px', alignItems: 'center',
                background: s.isMe ? '#eef3fb' : i % 2 === 0 ? '#fff' : '#fafbfd',
                borderBottom: '1px solid #ebeef7',
                borderLeft: s.isMe ? '3px solid #003087' : '3px solid transparent',
                transition: 'background .12s' }}
                onMouseEnter={e => { if (!s.isMe) e.currentTarget.style.background = '#f5f7fc'; }}
                onMouseLeave={e => { if (!s.isMe) e.currentTarget.style.background = i % 2 === 0 ? '#fff' : '#fafbfd'; }}>
                <RankBadge rank={s.rank} />
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Avatar initials={s.initials} size={32} colorIndex={parseInt(s.id.slice(1)) - 1} />
                  <div>
                    <div style={{ fontSize: 13, fontWeight: s.isMe ? 700 : 500, color: '#1b2036' }}>
                      {s.name}{s.isMe ? <span style={{ marginLeft: 6, fontSize: 10, fontWeight: 700, background: '#003087', color: '#fff', borderRadius: 4, padding: '1px 5px' }}>TÚ</span> : ''}
                    </div>
                    <div style={{ fontSize: 11, color: '#9097b5' }}>{lvl.title}</div>
                  </div>
                </div>
                <div style={{ textAlign: 'right', fontFamily: 'JetBrains Mono, monospace', fontSize: 13, fontWeight: 700, color: '#1b2036' }}>
                  {s.xp.toLocaleString()}
                </div>
                <div style={{ textAlign: 'center' }}>
                  <span style={{ background: '#eef3fb', color: '#003087', borderRadius: 6, padding: '3px 8px',
                    fontSize: 11, fontWeight: 700, fontFamily: 'JetBrains Mono, monospace' }}>
                    N{lvl.n}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {myRank && (
        <p style={{ textAlign: 'center', marginTop: 16, fontSize: 13, color: '#9097b5' }}>
          Tu posición actual: <strong style={{ color: '#003087' }}>#{myRank}</strong> de {leaderboard.length} estudiantes
        </p>
      )}
    </div>
  );
}

function PodiumItem({ s, height, label, medal }) {
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
        <div style={{ marginTop: 8, fontSize: isFirst ? 14 : 12, fontWeight: 700, color: '#1b2036' }}>{s.name.split(' ')[0]}</div>
        <div style={{ fontSize: 11, color: '#9097b5' }}>{lvl.title}</div>
        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: isFirst ? 15 : 13, fontWeight: 800, color: '#003087', marginTop: 4 }}>{s.xp.toLocaleString()} XP</div>
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
