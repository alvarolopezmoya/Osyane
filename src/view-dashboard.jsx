
// ─── Dashboard View ───────────────────────────────────────────────────────────

const NEXT_ACHIEVEMENTS = [
  { name: 'Racha x14',          desc: '2 días más activo',          progress: 12, max: 14, icon: '🔥' },
  { name: 'Top 3 del grupo',    desc: 'Necesitas 620 XP más',       progress: 3,  max: 5,  icon: '🏆' },
  { name: 'Colaborador Pro',    desc: '3 foros más por participar',  progress: 2,  max: 5,  icon: '🤝' },
  { name: 'Ratón de Biblioteca',desc: '8 recursos más consultados',  progress: 12, max: 20, icon: '📚' },
];

function ViewDashboard() {
  const { myStudent, levelInfo, leaderboard, myRank } = useApp();
  const earnedBadges = BADGES.filter(b => myStudent.earnedBadges.includes(b.id));
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => { const t = setTimeout(() => setMounted(true), 50); return () => clearTimeout(t); }, []);

  const xpToNext = levelInfo.max === Infinity ? 0 : levelInfo.max - levelInfo.xp;

  return (
    <div className="rise-in" style={{ padding: 'clamp(14px,3vw,28px) clamp(14px,3vw,32px)', maxWidth: 1200, margin: '0 auto' }}>

      {/* ── Hero card ── */}
      <div style={{ background: '#003087', borderRadius: 16, padding: 'clamp(20px,3vw,32px)', marginBottom: 24,
        display: 'flex', alignItems: 'center', gap: 28, position: 'relative', overflow: 'hidden', flexWrap: 'wrap' }}>
        <div className="hatch-blue" style={{ position: 'absolute', inset: 0, opacity: 0.35 }} />
        <div style={{ position: 'relative', flexShrink: 0 }}>
          <div style={{ width: 76, height: 76, borderRadius: '50%', background: '#FFB800',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 24, fontWeight: 900, color: '#2a1a00', fontFamily: 'JetBrains Mono, monospace',
            boxShadow: '0 0 0 4px rgba(255,184,0,0.3), 0 0 0 8px rgba(255,184,0,0.1)' }}>
            {myStudent.initials}
          </div>
          <div style={{ position: 'absolute', bottom: 0, right: 0, width: 22, height: 22,
            borderRadius: '50%', background: '#FFB800', border: '2px solid #003087',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 9, fontWeight: 900, color: '#2a1a00', fontFamily: 'JetBrains Mono, monospace' }}>
            N{levelInfo.n}
          </div>
        </div>
        <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6, flexWrap: 'wrap' }}>
            <span style={{ background: '#FFB800', color: '#2a1a00', borderRadius: 6, padding: '2px 10px',
              fontSize: 11, fontWeight: 800, letterSpacing: '.06em' }}>NIVEL {levelInfo.n} · {levelInfo.title}</span>
            {myStudent.streak > 0 && (
              <span style={{ background: 'rgba(255,255,255,0.12)', color: '#fff', borderRadius: 6,
                padding: '2px 10px', fontSize: 11, fontWeight: 700 }}>🔥 {myStudent.streak} días de racha</span>
            )}
          </div>
          <h1 style={{ margin: '0 0 2px', fontSize: 'clamp(18px,3vw,26px)', fontWeight: 800, color: '#fff' }}>{myStudent.name}</h1>
          <p style={{ margin: '0 0 14px', color: 'rgba(255,255,255,0.55)', fontSize: 13 }}>
            Ranking #{myRank} de {leaderboard.length} · Ingeniería en Software · FISEI
          </p>
          <div style={{ maxWidth: 420 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
              <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12 }}>Progreso al nivel {levelInfo.n + 1}</span>
              <span style={{ color: '#FFB800', fontSize: 12, fontFamily: 'JetBrains Mono, monospace', fontWeight: 700 }}>
                {levelInfo.max !== Infinity ? `${xpToNext.toLocaleString()} XP restantes` : 'Nivel máximo'}
              </span>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.15)', borderRadius: 99, height: 8, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: mounted ? `${Math.round(levelInfo.progress * 100)}%` : '0%',
                background: 'linear-gradient(90deg, #FFB800 0%, #FFD43B 100%)', borderRadius: 99,
                transition: 'width .9s cubic-bezier(.4,0,.2,1)' }} className="xp-shine" />
            </div>
          </div>
        </div>
        <div style={{ position: 'relative', textAlign: 'center', flexShrink: 0 }}>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', letterSpacing: '.08em', textTransform: 'uppercase', marginBottom: 4 }}>XP Total</div>
          <div style={{ fontSize: 'clamp(24px,4vw,36px)', fontWeight: 900, color: '#FFB800', fontFamily: 'JetBrains Mono, monospace', lineHeight: 1 }}>
            {myStudent.xp.toLocaleString()}
          </div>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', marginTop: 4 }}>{earnedBadges.length} insignias · racha {myStudent.streak}d</div>
        </div>
      </div>

      {/* ── Stat cards ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px,1fr))', gap: 14, marginBottom: 22 }}>
        <StatCard label="Ranking global" value={`#${myRank}`} sub={`Top ${Math.round(myRank / leaderboard.length * 100)}% del grupo`} icon={<IcoTrophy size={18} />} accent="#003087" />
        <StatCard label="Racha activa" value={`${myStudent.streak} días`} sub="Días consecutivos" icon={<IcoFlame size={18} />} accent="#b87d00" />
        <StatCard label="Insignias" value={`${earnedBadges.length} / ${BADGES.length}`} sub={`${BADGES.filter(b=>earnedBadges.find(e=>e.id===b.id)&&b.rare).length} raras obtenidas`} icon={<IcoBadge size={18} />} accent="#1f7a4a" />
        <StatCard label="XP esta semana" value={XP_HISTORY[XP_HISTORY.length-1].xp} sub={`+${XP_HISTORY[XP_HISTORY.length-1].xp - XP_HISTORY[XP_HISTORY.length-2].xp} vs semana anterior`} icon={<IcoXp size={18} />} accent="#7c3aed" />
      </div>

      {/* ── 3-col section ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px,1fr))', gap: 18, marginBottom: 18 }}>

        {/* Activity */}
        <div style={{ background: '#fff', border: '1px solid #e6e8f1', borderRadius: 12, padding: '20px' }}>
          <SectionHeader title="Actividad esta semana" sub="Historial de puntos y logros" />
          {ACTIVITY_FEED.map((a, i) => (
            <div key={a.id}>
              <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', padding: '9px 0' }}>
                <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#f5f7fc',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, flexShrink: 0 }}>
                  {a.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ margin: 0, fontSize: 13, color: '#2b3250', lineHeight: 1.4, fontWeight: 500 }}>{a.text}</p>
                  <span style={{ fontSize: 11, color: '#b0b6cc' }}>{a.time}</span>
                </div>
                {a.xp && (
                  <span style={{ fontSize: 12, fontWeight: 700, color: '#1f7a4a',
                    fontFamily: 'JetBrains Mono, monospace', flexShrink: 0,
                    background: '#f0fdf4', padding: '2px 7px', borderRadius: 6 }}>+{a.xp}</span>
                )}
              </div>
              {i < ACTIVITY_FEED.length - 1 && <div style={{ borderTop: '1px solid #f0f2f8' }} />}
            </div>
          ))}
        </div>

        {/* Next achievements */}
        <div style={{ background: '#fff', border: '1px solid #e6e8f1', borderRadius: 12, padding: '20px' }}>
          <SectionHeader title="Próximos logros" sub="Insignias y metas por desbloquear" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {NEXT_ACHIEVEMENTS.map((a, i) => (
              <div key={i}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#1b2036' }}>{a.icon} {a.name}</div>
                    <div style={{ fontSize: 11, color: '#9097b5', marginTop: 2 }}>{a.desc}</div>
                  </div>
                  <span style={{ fontSize: 11, fontFamily: 'JetBrains Mono, monospace', color: '#6b7293', flexShrink: 0, marginLeft: 8 }}>{a.progress}/{a.max}</span>
                </div>
                <div style={{ background: '#ebeef7', borderRadius: 99, height: 6, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${(a.progress/a.max)*100}%`, background: '#003087', borderRadius: 99 }} />
                </div>
                {i < NEXT_ACHIEVEMENTS.length - 1 && <div style={{ marginTop: 16, borderTop: '1px solid #f0f2f8' }} />}
              </div>
            ))}
          </div>
        </div>

        {/* Top + badges preview */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div style={{ background: '#fff', border: '1px solid #e6e8f1', borderRadius: 12, padding: '18px' }}>
            <SectionHeader title="Líderes del grupo" sub="Por XP total" />
            {leaderboard.slice(0, 5).map(s => (
              <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: 10,
                padding: '7px 8px', borderRadius: 8,
                background: s.isMe ? '#eef3fb' : 'transparent',
                border: s.isMe ? '1px solid #c5d4f0' : '1px solid transparent', marginBottom: 4 }}>
                <RankBadge rank={s.rank} />
                <Avatar initials={s.initials} size={28} colorIndex={parseInt(s.id.slice(1)) - 1} />
                <span style={{ flex: 1, fontSize: 12, fontWeight: s.isMe ? 700 : 500, color: '#1b2036',
                  whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {s.name.split(' ')[0]}{s.isMe ? ' (tú)' : ''}
                </span>
                <span style={{ fontSize: 12, fontFamily: 'JetBrains Mono, monospace', color: '#6b7293', flexShrink: 0 }}>{s.xp.toLocaleString()}</span>
              </div>
            ))}
          </div>
          <div style={{ background: '#fff', border: '1px solid #e6e8f1', borderRadius: 12, padding: '18px' }}>
            <SectionHeader title="Insignias recientes" sub={`${earnedBadges.length} de ${BADGES.length}`} />
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {earnedBadges.slice(0, 8).map(b => (
                <div key={b.id} title={b.name} style={{ width: 40, height: 40, borderRadius: 9,
                  background: '#fffaec', border: '1.5px solid #FFB800',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>{b.icon}</div>
              ))}
              {BADGES.filter(b => !myStudent.earnedBadges.includes(b.id)).slice(0, 4).map(b => (
                <div key={b.id} title={`Bloqueado: ${b.name}`} style={{ width: 40, height: 40, borderRadius: 9,
                  background: '#f5f7fc', border: '1.5px solid #ebeef7',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, opacity: 0.35 }}>{b.icon}</div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Subject progress ── */}
      <div style={{ background: '#fff', border: '1px solid #e6e8f1', borderRadius: 12, padding: '20px 24px' }}>
        <SectionHeader title="Progreso por asignatura" sub="XP acumulado vs máximo posible en el semestre" />
        <SubjectProgressBars data={SUBJECT_XP} />
      </div>
    </div>
  );
}

Object.assign(window, { ViewDashboard });
