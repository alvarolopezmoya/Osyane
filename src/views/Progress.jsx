import { useState } from 'react';
import { useApp } from '../store.jsx';
import { XP_HISTORY, SUBJECT_XP } from '../data.js';
import { LEVELS } from '../utils/levels.js';
import { DS } from '../components/ds.js';
import { StatCard, SectionHeader, XPBar } from '../components/UI.jsx';
import { IcoXp, IcoProgress, IcoStar, IcoAward, IcoCheck } from '../components/Icons.jsx';
import { XPAreaChart, SubjectBarChart, SubjectProgressBars } from '../components/Charts.jsx';

function RingProgress({ progress, size = 88, stroke = 7, color = '#4f8ef7', label, sub }) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const dash = circ * Math.min(progress, 1);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
      <div style={{ position: 'relative', width: size, height: size }}>
        <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
          <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth={stroke} />
          <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={stroke}
            strokeDasharray={`${dash} ${circ - dash}`} strokeLinecap="round"
            style={{ transition: 'stroke-dasharray 1s cubic-bezier(.4,0,.2,1)', filter: `drop-shadow(0 0 6px ${color}88)` }} />
        </svg>
        {label && (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span className="num" style={{ fontSize: 14, fontWeight: 800, color: DS.t1 }}>{label}</span>
          </div>
        )}
      </div>
      {sub && <span style={{ fontSize: 11, color: DS.t2, textAlign: 'center' }}>{sub}</span>}
    </div>
  );
}

function StreakCalendar({ streak }) {
  const days = 70;
  const today = new Date();
  const cells = Array.from({ length: days }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() - (days - 1 - i));
    const daysAgo = days - 1 - i;
    const active = daysAgo < streak ? true : (Math.random() > 0.45 && daysAgo < streak + 12);
    return { date: d, active, intensity: active ? (Math.random() > 0.55 ? 'high' : 'med') : 'none' };
  });
  const weeks = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));
  const intensityColors = { none: 'rgba(255,255,255,0.06)', med: '#1d4ed8', high: '#4f8ef7' };
  return (
    <div>
      <div style={{ display: 'flex', gap: 4 }}>
        {weeks.map((week, wi) => (
          <div key={wi} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {week.map((day, di) => (
              <div key={di} title={day.date.toLocaleDateString('es-EC')} style={{
                width: 12, height: 12, borderRadius: 3,
                background: intensityColors[day.intensity],
                boxShadow: day.intensity === 'high' ? '0 0 6px rgba(79,142,247,0.5)' : 'none',
                transition: 'transform .1s',
              }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.4)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = ''} />
            ))}
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 10, fontSize: 10, color: DS.t2 }}>
        <span>Menos</span>
        {['none','med','high'].map((k) => (
          <div key={k} style={{ width: 10, height: 10, borderRadius: 2, background: intensityColors[k] }} />
        ))}
        <span>Más actividad</span>
      </div>
    </div>
  );
}

const GRADES = [
  { subject: 'Prog. OO',   myGrade: 9.2, avgGrade: 7.8, maxGrade: 10 },
  { subject: 'Base Datos', myGrade: 8.5, avgGrade: 7.2, maxGrade: 10 },
  { subject: 'Redes',      myGrade: 7.8, avgGrade: 7.5, maxGrade: 10 },
  { subject: 'Ing. SW',    myGrade: 8.9, avgGrade: 8.1, maxGrade: 10 },
  { subject: 'Cálculo',    myGrade: 7.1, avgGrade: 6.8, maxGrade: 10 },
];

function GradeComparison() {
  const COLORS = ['#4f8ef7','#0fd9a0','#f5a623','#a78bfa','#f43f5e'];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      {GRADES.map((g, i) => (
        <div key={i}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: DS.t1 }}>{g.subject}</span>
            <div style={{ display: 'flex', gap: 14, fontSize: 12 }}>
              <span className="num" style={{ color: COLORS[i], fontWeight: 700 }}>Tú: {g.myGrade}</span>
              <span className="num" style={{ color: DS.t2 }}>Prom: {g.avgGrade}</span>
            </div>
          </div>
          <div style={{ position: 'relative', height: 8, background: 'rgba(255,255,255,0.07)', borderRadius: 99, overflow: 'hidden' }}>
            <div style={{ position: 'absolute', height: '100%', width: `${(g.avgGrade/g.maxGrade)*100}%`, background: 'rgba(255,255,255,0.15)', borderRadius: 99 }} />
            <div style={{ position: 'absolute', height: '100%', width: `${(g.myGrade/g.maxGrade)*100}%`, background: COLORS[i], borderRadius: 99, boxShadow: `0 0 10px ${COLORS[i]}55`, transition: 'width .8s ease' }} />
          </div>
        </div>
      ))}
      <div style={{ display: 'flex', gap: 16, fontSize: 11, color: DS.t2 }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><span style={{ width: 10, height: 4, background: DS.blue, borderRadius: 3, display: 'inline-block' }} /> Tu nota</span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><span style={{ width: 10, height: 4, background: 'rgba(255,255,255,0.15)', borderRadius: 3, display: 'inline-block' }} /> Promedio</span>
      </div>
    </div>
  );
}

export default function ViewProgress() {
  const { myStudent, levelInfo } = useApp();
  const [tab, setTab] = useState('xp');
  const totalXp = XP_HISTORY.reduce((a, b) => a + b.xp, 0);
  const avgXp   = Math.round(totalXp / XP_HISTORY.length);
  const bestWeek = XP_HISTORY.reduce((a, b) => a.xp > b.xp ? a : b);
  const tabs = [
    { id: 'xp',      label: 'XP semanal' },
    { id: 'subjects',label: 'Asignaturas' },
    { id: 'grades',  label: 'Calificaciones' },
    { id: 'levels',  label: 'Niveles' },
  ];
  const C = { background: DS.card, border: `1px solid ${DS.bd}`, borderRadius: 16, boxShadow: '0 4px 20px rgba(0,0,0,0.38)' };

  return (
    <div className="rise-in" style={{ padding: 'clamp(14px,3vw,28px)', maxWidth: 1140, margin: '0 auto' }}>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(170px,1fr))', gap: 14, marginBottom: 18 }}>
        {[
          { label: 'XP Acumulado',     value: myStudent.xp.toLocaleString(), sub: 'Total histórico',  icon: <IcoXp size={16} />,       accent: DS.gold   },
          { label: 'Promedio semanal', value: `${avgXp}`,                    sub: 'XP por semana',    icon: <IcoProgress size={16} />, accent: DS.blue   },
          { label: 'Mejor semana',     value: `${bestWeek.xp}`,              sub: bestWeek.week,      icon: <IcoStar size={16} />,     accent: DS.purple },
          { label: 'Nivel actual',     value: `N${levelInfo.n}`,             sub: levelInfo.title,    icon: <IcoAward size={16} />,    accent: DS.blue   },
          { label: 'Nota promedio',    value: '8.3',                         sub: 'Sobre 10 · todas', icon: <IcoCheck size={16} />,    accent: DS.green  },
        ].map((s, i) => (
          <div key={i} className={`float-up d${i+1}`}>
            <StatCard label={s.label} value={s.value} sub={s.sub} icon={s.icon} accent={s.accent} />
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: 16, marginBottom: 16 }}>

        <div style={{ ...C, padding: 22 }}>
          <SectionHeader title="Progreso de nivel" sub={`Nivel ${levelInfo.n} · ${levelInfo.title}`} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 18 }}>
            <RingProgress progress={levelInfo.progress} size={90} stroke={7} color={DS.gold}
              label={`N${levelInfo.n}`} sub="Nivel" />
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: 11, color: DS.t2 }}>
                <span className="num">{levelInfo.min.toLocaleString()} XP</span>
                <span className="num" style={{ color: DS.goldBright, fontWeight: 700 }}>{myStudent.xp.toLocaleString()} ({Math.round(levelInfo.progress*100)}%)</span>
                <span className="num">{levelInfo.max !== Infinity ? levelInfo.max.toLocaleString() : '∞'}</span>
              </div>
              <XPBar progress={levelInfo.progress} height={9} />
              {levelInfo.max !== Infinity && (
                <div style={{ fontSize: 11, color: DS.t2, marginTop: 6 }}>
                  Faltan {(levelInfo.max - myStudent.xp).toLocaleString()} XP → Nivel {levelInfo.n + 1}
                </div>
              )}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
            {LEVELS.map((l) => {
              const done    = myStudent.xp >= l.max;
              const current = levelInfo.n === l.n;
              return (
                <div key={l.n} title={l.title} style={{
                  width: 30, height: 30, borderRadius: '50%',
                  background: done ? 'linear-gradient(135deg,#1d4ed8,#4f8ef7)' : current ? 'linear-gradient(135deg,#b45309,#f59e0b)' : DS.card2,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 10, fontWeight: 800, fontFamily: 'JetBrains Mono, monospace',
                  color: done ? '#e0e7ff' : current ? '#fff' : DS.t3,
                  border: current ? `2px solid ${DS.gold}` : '2px solid transparent',
                  boxShadow: current ? `0 0 12px ${DS.goldGlow}` : done ? '0 0 8px rgba(79,142,247,0.3)' : 'none',
                  transition: 'all .2s',
                }}>{l.n}</div>
              );
            })}
          </div>
        </div>

        <div style={{ ...C, padding: 22 }}>
          <SectionHeader title="Consistencia — últimas 10 semanas" sub={`Racha actual: ${myStudent.streak} días 🔥`} />
          <StreakCalendar streak={myStudent.streak} />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginTop: 16 }}>
            {[
              { label: 'Racha actual', value: `${myStudent.streak}d`, color: DS.gold },
              { label: 'Mejor racha',  value: '22d',  color: DS.blue   },
              { label: 'Días activos', value: '47',   color: DS.green  },
            ].map((s, i) => (
              <div key={i} style={{ background: DS.card2, border: `1px solid ${DS.bd}`, borderRadius: 10, padding: '10px', textAlign: 'center' }}>
                <div className="num" style={{ fontSize: 17, fontWeight: 800, color: s.color }}>{s.value}</div>
                <div style={{ fontSize: 10, color: DS.t2, marginTop: 3 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ ...C, overflow: 'hidden', marginBottom: 16 }}>
        <div style={{ display: 'flex', borderBottom: `1px solid ${DS.bd}`, overflowX: 'auto' }}>
          {tabs.map((tDef) => (
            <button key={tDef.id} onClick={() => setTab(tDef.id)} className={`tab${tab === tDef.id ? ' active' : ''}`}>
              {tDef.label}
            </button>
          ))}
        </div>
        <div style={{ padding: 20 }}>
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
              <SectionHeader title="Calificaciones vs. promedio" sub="Tu rendimiento vs. el grupo" />
              <GradeComparison />
            </>
          )}
          {tab === 'levels' && (
            <div>
              <SectionHeader title="Tabla de niveles" sub="Requisitos de XP por nivel" />
              {LEVELS.map((l, i) => {
                const done    = myStudent.xp >= l.max;
                const current = levelInfo.n === l.n;
                return (
                  <div key={l.n} style={{
                    display: 'grid', gridTemplateColumns: '36px 160px 1fr 130px',
                    alignItems: 'center', gap: 12, padding: '10px 8px',
                    borderBottom: i < LEVELS.length-1 ? `1px dashed ${DS.bd}` : 'none',
                    background: current ? `${DS.gold}0a` : 'transparent',
                    borderRadius: current ? 8 : 0,
                    marginBottom: current ? 2 : 0,
                  }}>
                    <div style={{
                      width: 30, height: 30, borderRadius: '50%',
                      background: done ? 'linear-gradient(135deg,#1d4ed8,#4f8ef7)' : current ? 'linear-gradient(135deg,#b45309,#f59e0b)' : DS.card2,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 10, fontWeight: 800, fontFamily: 'JetBrains Mono,monospace',
                      color: done ? '#e0e7ff' : current ? '#fff' : DS.t3,
                    }}>N{l.n}</div>
                    <span style={{ fontSize: 13, fontWeight: current ? 700 : 400, color: current ? DS.t1 : DS.t2 }}>
                      {l.title}
                      {current && <span style={{ marginLeft: 7, fontSize: 9, background: DS.gold, color: '#fff', borderRadius: 4, padding: '1px 5px', fontWeight: 800, letterSpacing: '.04em' }}>ACTUAL</span>}
                    </span>
                    <span className="num" style={{ fontSize: 11, color: DS.t2 }}>{l.min.toLocaleString()} — {l.max === Infinity ? '∞' : l.max.toLocaleString()} XP</span>
                    <div style={{ textAlign: 'right' }}>
                      {done && !current && <span style={{ color: DS.green, fontSize: 12, fontWeight: 700 }}>✓ Completado</span>}
                      {current && <span style={{ color: DS.gold, fontSize: 12, fontWeight: 700 }}>⚡ En progreso</span>}
                      {!done && !current && <span style={{ color: DS.t3, fontSize: 12 }}>Bloqueado</span>}
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
