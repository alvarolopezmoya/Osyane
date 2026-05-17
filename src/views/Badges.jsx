import { useState } from 'react';
import { useApp } from '../store.jsx';
import { BADGES } from '../data.js';
import { DS } from '../components/ds.js';
import { StatCard, BadgeCard, Modal, Pill } from '../components/UI.jsx';
import { IcoBadge, IcoXp, IcoStar } from '../components/Icons.jsx';

export default function ViewBadges() {
  const { myStudent } = useApp();
  const [selected, setSelected] = useState(null);
  const [filterCat, setFilterCat] = useState('Todas');

  const cats = ['Todas', ...Array.from(new Set(BADGES.map((b) => b.cat)))];
  const earnedIds = new Set(myStudent.earnedBadges);
  const shown  = filterCat === 'Todas' ? BADGES : BADGES.filter((b) => b.cat === filterCat);
  const earned = shown.filter((b) => earnedIds.has(b.id));
  const locked = shown.filter((b) => !earnedIds.has(b.id));

  const totalXpEarned = BADGES.filter((b) => earnedIds.has(b.id)).reduce((a, b) => a + b.xp, 0);
  const rareEarned    = BADGES.filter((b) => earnedIds.has(b.id) && b.rare).length;

  return (
    <div className="rise-in" style={{ padding: 'clamp(14px,3vw,28px)', maxWidth: 1040, margin: '0 auto' }}>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(150px,1fr))', gap: 14, marginBottom: 22 }}>
        <div className="float-up d1">
          <StatCard label="Obtenidas" value={earnedIds.size} sub={`de ${BADGES.length} totales`} icon={<IcoBadge size={16} />} accent={DS.gold} />
        </div>
        <div className="float-up d2">
          <StatCard label="XP de insignias" value={totalXpEarned.toLocaleString()} sub="Puntos ganados" icon={<IcoXp size={16} />} accent={DS.gold} />
        </div>
        <div className="float-up d3">
          <StatCard label="Raras obtenidas" value={rareEarned} sub={`de ${BADGES.filter(b=>b.rare).length} raras`} icon={<IcoStar size={16} />} accent={DS.purple} />
        </div>
      </div>

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 22 }}>
        {cats.map((c) => (
          <button key={c} onClick={() => setFilterCat(c)}
            className={`pill-btn${filterCat === c ? ' active' : ''}`}>{c}</button>
        ))}
      </div>

      {earned.length > 0 && (
        <div style={{ marginBottom: 32 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: DS.green, boxShadow: `0 0 10px ${DS.green}` }} />
            <h2 className="head" style={{ margin: 0, fontSize: 14, fontWeight: 700, color: DS.t1 }}>Obtenidas</h2>
            <span style={{ fontSize: 12, color: DS.t2 }}>{earned.length} insignia{earned.length !== 1 ? 's' : ''}</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(140px,1fr))', gap: 12 }}>
            {earned.map((b, i) => (
              <div key={b.id} className={`float-up d${Math.min(i+1,6)}`}>
                <BadgeCard badge={b} earned={true} onClick={() => setSelected(b)} />
              </div>
            ))}
          </div>
        </div>
      )}

      {locked.length > 0 && (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: DS.t3 }} />
            <h2 className="head" style={{ margin: 0, fontSize: 14, fontWeight: 700, color: DS.t2 }}>Por desbloquear</h2>
            <span style={{ fontSize: 12, color: DS.t3 }}>{locked.length} insignia{locked.length !== 1 ? 's' : ''}</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(140px,1fr))', gap: 12 }}>
            {locked.map((b, i) => (
              <div key={b.id} className={`float-up d${Math.min(i+1,6)}`}>
                <BadgeCard badge={b} earned={false} onClick={() => setSelected(b)} />
              </div>
            ))}
          </div>
        </div>
      )}

      <Modal open={!!selected} onClose={() => setSelected(null)} title="Detalle de insignia" width={400}>
        {selected && (
          <div style={{ textAlign: 'center' }}>
            <div style={{
              width: 80, height: 80, borderRadius: 20, margin: '0 auto 16px',
              background: earnedIds.has(selected.id) ? DS.goldDim : DS.card2,
              border: `1px solid ${earnedIds.has(selected.id) ? DS.gold + '55' : DS.bd}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 40,
              boxShadow: earnedIds.has(selected.id) ? `0 0 28px ${DS.goldGlow}` : 'none',
            }}>{selected.icon}</div>
            <h3 className="head" style={{ margin: '0 0 8px', fontSize: 18, fontWeight: 800, color: DS.t1 }}>{selected.name}</h3>
            {selected.rare && <Pill label="✦ INSIGNIA RARA" color={DS.purple} />}
            <p style={{ margin: '14px 0 16px', fontSize: 14, color: DS.t2, lineHeight: 1.6 }}>{selected.desc}</p>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginBottom: 18, flexWrap: 'wrap' }}>
              <Pill label={selected.cat} color={DS.blue} />
              <Pill label={`+${selected.xp} XP`} color={DS.gold} />
            </div>
            {earnedIds.has(selected.id) ? (
              <div style={{ padding: '12px 16px', background: `${DS.green}14`, border: `1px solid ${DS.green}30`, borderRadius: 10, color: DS.green, fontSize: 13, fontWeight: 600 }}>
                ✓ Ya tienes esta insignia
              </div>
            ) : (
              <div style={{ padding: '12px 16px', background: DS.card2, border: `1px solid ${DS.bd}`, borderRadius: 10, color: DS.t2, fontSize: 13 }}>
                Aún no desbloqueada
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
