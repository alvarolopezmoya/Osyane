// ─── Leaderboard View — Premium ──────────────────────────────────────────────

function PodiumItem({ s, height, label, medal, maskName, rank }) {
  const [grown, setGrown] = React.useState(false);
  React.useEffect(() => { const t = setTimeout(() => setGrown(true), rank * 160 + 100); return () => clearTimeout(t); }, []);
  const cfgs = {
    1: { bg: 'linear-gradient(180deg,#b45309 0%,#d97706 40%,#f59e0b 100%)', glow: 'rgba(245,158,11,0.45)', top: '#fef3c7' },
    2: { bg: 'linear-gradient(180deg,#1e293b 0%,#334155 100%)', glow: 'rgba(71,85,105,0.28)', top: '#cbd5e1' },
    3: { bg: 'linear-gradient(180deg,#3b0f07 0%,#7c2d12 100%)', glow: 'rgba(124,45,18,0.28)', top: '#fed7aa' },
  };
  const c = cfgs[rank] || { bg: DS.card, glow: 'transparent', top: DS.t2 };
  const lvl = getLevelInfo(s.xp);
  const isFirst = rank === 1;

  return (
    <div style={{ textAlign: 'center', width: isFirst ? 160 : 140 }}>
      <div style={{ marginBottom: 14, animation: `floatUp .5s ${rank * 0.12}s both` }}>
        <div style={{ position: 'relative', display: 'inline-block' }}>
          <Avatar initials={s.initials} size={isFirst ? 62 : 48} colorIndex={parseInt(s.id.slice(1))-1} glow={isFirst} />
          <span style={{ position: 'absolute', bottom: -5, right: -6, fontSize: isFirst ? 22 : 17 }}>{medal}</span>
        </div>
        <div className="head" style={{ marginTop: 10, fontSize: isFirst ? 15 : 13, fontWeight: 700, color: DS.t1 }}>
          {maskName(s).split(' ')[0]}
        </div>
        <div style={{ fontSize: 10, color: DS.t2, marginTop: 2 }}>{lvl.title}</div>
        <div className="num" style={{
          fontSize: isFirst ? 16 : 13, fontWeight: 800, marginTop: 4,
          background: isFirst ? 'linear-gradient(135deg,#f5a623,#ffcc5c)' : 'none',
          WebkitBackgroundClip: isFirst ? 'text' : 'unset',
          WebkitTextFillColor: isFirst ? 'transparent' : DS.t2,
          color: isFirst ? 'transparent' : DS.t2,
        }}>{s.xp.toLocaleString()} XP</div>
      </div>
      {/* Pillar */}
      <div style={{
        height: grown ? height : 0, background: c.bg,
        borderRadius: '10px 10px 0 0',
        display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
        paddingTop: 14, overflow: 'hidden',
        transition: 'height 0.75s cubic-bezier(.34,1.3,.64,1)',
        boxShadow: `0 -8px 28px ${c.glow}`,
        position: 'relative',
      }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '40%', background: 'linear-gradient(180deg,rgba(255,255,255,0.14) 0%,transparent 100%)', borderRadius: '10px 10px 0 0', pointerEvents: 'none' }} />
        <span className="num" style={{ fontSize: 28, fontWeight: 900, color: c.top, opacity: 0.45, position: 'relative' }}>{rank}</span>
      </div>
    </div>
  );
}

function ViewLeaderboard() {
  const { leaderboard, myRank, maskName } = useApp();
  const [search, setSearch] = React.useState('');
  const half = Math.ceil(leaderboard.length / 2);
  const filtered = leaderboard.filter(s => maskName(s).toLowerCase().includes(search.toLowerCase()));
  const top3 = leaderboard.slice(0, 3);

  const C = { background: DS.card, border: `1px solid ${DS.bd}`, borderRadius: 16, boxShadow: '0 4px 20px rgba(0,0,0,0.38)', overflow: 'hidden' };

  return (
    <div className="rise-in" style={{ padding: 'clamp(14px,3vw,28px)', maxWidth: 1140, margin: '0 auto' }}>

      {/* ── Podium ── */}
      <div style={{ ...C, marginBottom: 18, overflow: 'visible' }}>
        <div style={{ padding: '24px 24px 0', borderBottom: `1px solid ${DS.bd}`, background: DS.card }}>
          <SectionHeader title="Podio del grupo" sub="Ingeniería en Software · Semestre 2025-A" />
        </div>
        <div style={{
          padding: '24px 24px 0',
          background: 'linear-gradient(180deg,rgba(79,142,247,0.04) 0%, transparent 60%)',
          display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: 14,
        }}>
          <PodiumItem s={top3[1]} height={110} label="2°" medal="🥈" maskName={maskName} rank={2} />
          <PodiumItem s={top3[0]} height={155} label="1°" medal="🥇" maskName={maskName} rank={1} />
          <PodiumItem s={top3[2]} height={86}  label="3°" medal="🥉" maskName={maskName} rank={3} />
        </div>
      </div>

      {/* ── Table + Radar ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) 340px', gap: 18, alignItems: 'start' }}>

        {/* Ranking table */}
        <div style={C}>
          <div style={{ padding: '14px 18px', borderBottom: `1px solid ${DS.bd}`, display: 'flex', gap: 12, alignItems: 'center' }}>
            <Input placeholder="Buscar estudiante…" value={search} onChange={e => setSearch(e.target.value)} icon={<IcoSearch size={15} />} style={{ flex: 1 }} />
            <span style={{ fontSize: 12, color: DS.t2, whiteSpace: 'nowrap' }}>{filtered.length} estudiantes</span>
          </div>
          {/* Header */}
          <div style={{
            display: 'grid', gridTemplateColumns: '46px 1fr 100px 70px 70px',
            padding: '9px 18px', borderBottom: `1px solid ${DS.bd}`,
            fontSize: 10, fontWeight: 700, color: DS.t3, textTransform: 'uppercase', letterSpacing: '.07em',
          }}>
            <span>#</span><span>Estudiante</span>
            <span style={{ textAlign: 'right' }}>XP</span>
            <span style={{ textAlign: 'center' }}>Nivel</span>
            <span style={{ textAlign: 'center' }}>Racha</span>
          </div>
          {filtered.map((s, i) => {
            const lvl = getLevelInfo(s.xp);
            const isBottom = s.rank > half;
            return (
              <div key={s.id} className="tr" style={{
                display: 'grid', gridTemplateColumns: '46px 1fr 100px 70px 70px',
                padding: '10px 18px', alignItems: 'center',
                background: s.isMe ? `${DS.blue}0e` : 'transparent',
                borderBottom: `1px solid ${DS.bd}`,
                borderLeft: s.isMe ? `3px solid ${DS.blue}` : '3px solid transparent',
                transition: 'background .12s',
              }}>
                <div>{(s.rank <= 3 || s.isMe) ? <RankBadge rank={s.rank} /> :
                  <div style={{ width: 26, height: 26, borderRadius: 6, background: DS.card2, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, color: DS.t3 }}>—</div>}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Avatar initials={s.initials} size={30} colorIndex={parseInt(s.id.slice(1))-1} />
                  <div>
                    <div style={{ fontSize: 13, fontWeight: s.isMe ? 700 : 400, color: DS.t1 }}>
                      {maskName(s)}
                      {s.isMe && <span style={{ marginLeft: 7, fontSize: 9, fontWeight: 800, background: DS.blue, color: '#fff', borderRadius: 4, padding: '1px 6px', letterSpacing: '.04em' }}>TÚ</span>}
                    </div>
                    <div style={{ fontSize: 10, color: DS.t2 }}>{lvl.title}</div>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span className="num" style={{ fontSize: 13, fontWeight: 700, color: DS.t1 }}>
                    {isBottom && !s.isMe ? '••••' : s.xp.toLocaleString()}
                  </span>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <span style={{ background: DS.blueDim, color: DS.blueBright, borderRadius: 6, padding: '3px 7px', fontSize: 11, fontWeight: 700 }}>N{lvl.n}</span>
                </div>
                <div style={{ textAlign: 'center', fontSize: 12, color: s.streak >= 7 ? DS.gold : DS.t2 }}>
                  {s.streak > 0 ? `🔥${s.streak}` : '—'}
                </div>
              </div>
            );
          })}
          <div style={{ padding: '10px 18px', textAlign: 'center', fontSize: 11, color: DS.t2, borderTop: `1px solid ${DS.bd}`, background: DS.card2 }}>
            Tu posición: <strong style={{ color: DS.blueBright }}>#{myRank}</strong> · La mitad inferior está oculta para otros
          </div>
        </div>

        {/* Right panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div style={{ ...C, padding: '20px 16px 10px' }}>
            <SectionHeader title="Competencias" sub="Tu perfil técnico" />
            <CompetenciasRadar height={240} />
          </div>
          <div style={{ ...C, padding: 20 }}>
            <SectionHeader title="Dominio por área" sub="Vs. promedio (68%)" />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {COMPETENCIAS_DATA.map((c, i) => {
                const avg = 68;
                const COLORS = ['#4f8ef7','#0fd9a0','#f5a623','#a78bfa','#22d3ee','#f43f5e'];
                const col = COLORS[i % COLORS.length];
                return (
                  <div key={i}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <span style={{ fontSize: 12, fontWeight: 600, color: DS.t1 }}>{c.area}</span>
                      <span className="num" style={{ fontSize: 11, color: c.value >= avg ? DS.green : DS.gold }}>
                        {c.value}% {c.value >= avg ? '▲' : '▼'}
                      </span>
                    </div>
                    <div style={{ position: 'relative', background: 'rgba(255,255,255,0.07)', borderRadius: 99, height: 6, overflow: 'visible' }}>
                      <div style={{ height: '100%', width: `${c.value}%`, background: col, borderRadius: 99, boxShadow: `0 0 8px ${col}55` }} />
                      <div style={{ position: 'absolute', top: -2, bottom: -2, left: `${avg}%`, width: 2, background: 'rgba(255,255,255,0.2)', borderRadius: 99 }} />
                    </div>
                  </div>
                );
              })}
              <div style={{ fontSize: 10, color: DS.t3, textAlign: 'right' }}>│ = promedio grupo (68%)</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { ViewLeaderboard });
