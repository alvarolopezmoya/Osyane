
// ─── Badges / Insignias View ──────────────────────────────────────────────────

function ViewBadges() {
  const { myStudent } = useApp();
  const [selected, setSelected] = React.useState(null);
  const [filterCat, setFilterCat] = React.useState('Todas');

  const cats = ['Todas', ...Array.from(new Set(BADGES.map(b => b.cat)))];
  const earnedIds = new Set(myStudent.earnedBadges);

  const shown = filterCat === 'Todas' ? BADGES : BADGES.filter(b => b.cat === filterCat);
  const earned = shown.filter(b => earnedIds.has(b.id));
  const locked = shown.filter(b => !earnedIds.has(b.id));

  return (
    <div className="rise-in" style={{ padding: 'clamp(14px,3vw,28px) clamp(14px,3vw,32px)', maxWidth: 1000, margin: '0 auto' }}>

      {/* Header stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(130px,1fr))', gap: 16, marginBottom: 24 }}>
        <StatCard label="Insignias obtenidas" value={earnedIds.size} sub={`de ${BADGES.length} totales`} icon={<IcoBadge size={18} />} accent="#b87d00" />
        <StatCard label="XP de insignias" value={(BADGES.filter(b => earnedIds.has(b.id)).reduce((a, b) => a + b.xp, 0)).toLocaleString()} sub="Puntos ganados" icon={<IcoXp size={18} />} accent="#FFB800" />
        <StatCard label="Raras obtenidas" value={BADGES.filter(b => earnedIds.has(b.id) && b.rare).length} sub={`de ${BADGES.filter(b => b.rare).length} raras`} icon={<IcoStar size={18} />} accent="#003087" />
      </div>

      {/* Category filter */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 24 }}>
        {cats.map(c => (
          <button key={c} onClick={() => setFilterCat(c)}
            style={{ padding: '5px 14px', borderRadius: 99, fontSize: 12, fontWeight: 600, fontFamily: 'Inter, sans-serif',
              border: '1.5px solid', cursor: 'pointer', transition: 'all .15s',
              borderColor: filterCat === c ? '#003087' : '#e6e8f1',
              background: filterCat === c ? '#003087' : '#fff',
              color: filterCat === c ? '#fff' : '#6b7293' }}>
            {c}
          </button>
        ))}
      </div>

      {/* Earned */}
      {earned.length > 0 && (
        <div style={{ marginBottom: 32 }}>
          <SectionHeader title="✅ Obtenidas" sub={`${earned.length} insignia${earned.length !== 1 ? 's' : ''}`} />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 14 }}>
            {earned.map(b => (
              <BadgeCard key={b.id} badge={b} earned={true} onClick={() => setSelected(b)} />
            ))}
          </div>
        </div>
      )}

      {/* Locked */}
      {locked.length > 0 && (
        <div>
          <SectionHeader title="🔒 Por desbloquear" sub={`${locked.length} insignia${locked.length !== 1 ? 's' : ''}`} />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 14 }}>
            {locked.map(b => (
              <BadgeCard key={b.id} badge={b} earned={false} onClick={() => setSelected(b)} />
            ))}
          </div>
        </div>
      )}

      {/* Detail modal */}
      <Modal open={!!selected} onClose={() => setSelected(null)} title="Detalle de insignia" width={400}>
        {selected && (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 56, marginBottom: 12 }}>{selected.icon}</div>
            <h3 style={{ margin: '0 0 6px', fontSize: 18, fontWeight: 800, color: '#1b2036' }}>{selected.name}</h3>
            {selected.rare && <Pill label="✦ INSIGNIA RARA" color="#003087" bg="#eef3fb" />}
            <p style={{ margin: '12px 0 16px', fontSize: 14, color: '#6b7293', lineHeight: 1.5 }}>{selected.desc}</p>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginBottom: 16 }}>
              <Pill label={selected.cat} color="#1f7a4a" bg="#f0fdf4" />
              <Pill label={`+${selected.xp} XP`} color="#b87d00" bg="#fffaec" />
            </div>
            {earnedIds.has(selected.id)
              ? <div style={{ padding: '10px 16px', background: '#f0fdf4', borderRadius: 8, color: '#1f7a4a', fontSize: 13, fontWeight: 600 }}>
                  ✓ Ya tienes esta insignia
                </div>
              : <div style={{ padding: '10px 16px', background: '#f5f7fc', borderRadius: 8, color: '#6b7293', fontSize: 13 }}>
                  Aún no desbloqueada
                </div>
            }
          </div>
        )}
      </Modal>
    </div>
  );
}

Object.assign(window, { ViewBadges });
