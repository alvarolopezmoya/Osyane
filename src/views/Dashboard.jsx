import { useEffect, useState } from 'react';
import { useApp } from '../store.jsx';
import { useI18n } from '../i18n/index.jsx';
import { BADGES, ACTIVITY_FEED, SUBJECT_XP } from '../data.js';
import { DS } from '../components/ds.js';
import { Avatar, XPBar, StatCard, SectionHeader, RankBadge } from '../components/UI.jsx';
import { IcoXp, IcoTrophy, IcoFlame, IcoBadge } from '../components/Icons.jsx';
import { SubjectProgressBars } from '../components/Charts.jsx';

const NEXT_ACHIEVEMENTS = [
  { name: 'Racha x14',    desc: '2 días más activo',       progress: 12, max: 14, icon: '🔥', color: '#f5a623' },
  { name: 'Top 3',        desc: 'Necesitas 620 XP más',    progress: 3,  max: 5,  icon: '🏆', color: '#4f8ef7' },
  { name: 'Colaborador',  desc: '3 foros por participar',  progress: 2,  max: 5,  icon: '🤝', color: '#0fd9a0' },
  { name: 'Biblioteca',   desc: '8 recursos más',          progress: 12, max: 20, icon: '📚', color: '#a78bfa' },
];

function useLayoutSize() {
  const [w, setW] = useState(window.innerWidth);
  useEffect(() => {
    const fn = () => setW(window.innerWidth);
    window.addEventListener('resize', fn);
    return () => window.removeEventListener('resize', fn);
  }, []);
  return w > 1100 ? 'lg' : w > 700 ? 'md' : 'sm';
}

function DashHero({ myStudent, levelInfo, myRank, leaderboard, xpToNext, earnedBadges, t }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { const x = setTimeout(() => setMounted(true), 80); return () => clearTimeout(x); }, []);

  return (
    <div style={{
      position: 'relative', overflow: 'hidden',
      background: 'linear-gradient(135deg, #04091a 0%, #081428 50%, #06102a 100%)',
      border: '1px solid rgba(79,142,247,0.2)',
      borderRadius: 20, padding: 'clamp(24px,3vw,36px)',
      boxShadow: '0 8px 48px rgba(0,0,0,0.6)',
    }}>
      <div style={{ position: 'absolute', top: -120, left: -60, width: 520, height: 420,
        background: 'radial-gradient(ellipse, rgba(79,142,247,0.16) 0%, transparent 65%)',
        animation: 'orb-float 11s ease-in-out infinite', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: -90, right: -50, width: 420, height: 360,
        background: 'radial-gradient(ellipse, rgba(167,139,250,0.11) 0%, transparent 65%)',
        animation: 'orb-float 14s ease-in-out infinite reverse', pointerEvents: 'none' }} />

      <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 28, flexWrap: 'wrap' }}>

        <div style={{ position: 'relative', flexShrink: 0 }}>
          <div style={{ position: 'absolute', inset: -6, borderRadius: '50%',
            background: 'conic-gradient(from 0deg, rgba(245,166,35,0.85), rgba(79,142,247,0.5), rgba(245,166,35,0.85))',
            animation: 'spin-slow 5.5s linear infinite' }} />
          <div style={{ position: 'absolute', inset: -2, borderRadius: '50%', background: '#04091a' }} />
          <div style={{ position: 'relative' }}>
            <Avatar initials={myStudent.initials} size={72} colorIndex={0} glow />
          </div>
          <div className="num" style={{
            position: 'absolute', bottom: -8, right: -14,
            background: 'linear-gradient(135deg,#b45309,#f59e0b)', color: '#fff',
            borderRadius: 8, padding: '3px 9px', fontSize: 11, fontWeight: 800,
            boxShadow: '0 2px 12px rgba(245,158,11,0.55)',
            border: '2px solid rgba(4,9,26,0.85)',
          }}>N{levelInfo.n}</div>
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, flexWrap: 'wrap' }}>
            <span style={{
              background: 'linear-gradient(135deg,rgba(245,166,35,0.22),rgba(245,166,35,0.1))',
              border: '1px solid rgba(245,166,35,0.32)', color: '#ffcc5c',
              borderRadius: 8, padding: '3px 12px', fontSize: 11, fontWeight: 700, letterSpacing: '.06em',
            }}>NIV. {levelInfo.n} · {levelInfo.title.toUpperCase()}</span>
            {myStudent.streak > 0 && (
              <span style={{
                background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)',
                color: '#94a3b8', borderRadius: 8, padding: '3px 10px', fontSize: 11, fontWeight: 600,
              }}>🔥 {myStudent.streak} {t('common.days')}</span>
            )}
          </div>
          <h1 className="head" style={{
            margin: '0 0 3px', fontSize: 'clamp(20px,2.5vw,30px)',
            fontWeight: 800, color: '#e8edf8', letterSpacing: '-.025em', lineHeight: 1.1,
          }}>{myStudent.name}</h1>
          <p style={{ margin: '0 0 16px', fontSize: 12, color: '#94a3b8', display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' }}>
            <span>#{myRank} {t('common.of')} {leaderboard.length}</span>
            <span style={{ opacity: 0.3 }}>·</span>
            <span>Ing. en Software · FISEI · UTA</span>
          </p>
          <div style={{ maxWidth: 480 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ fontSize: 11, color: '#94a3b8', letterSpacing: '.04em' }}>{t('dashboard.nextLevel', { n: levelInfo.n + 1 })}</span>
              <span className="num" style={{ fontSize: 11, fontWeight: 700, color: '#f5a623' }}>
                {levelInfo.max !== Infinity ? t('dashboard.xpLeft', { xp: xpToNext.toLocaleString() }) : t('dashboard.maxLevel')}
              </span>
            </div>
            <XPBar progress={mounted ? levelInfo.progress : 0} height={10} />
          </div>
        </div>

        <div style={{ textAlign: 'right', flexShrink: 0 }}>
          <div style={{ fontSize: 10, color: '#64748b', letterSpacing: '.14em', textTransform: 'uppercase', marginBottom: 4 }}>{t('dashboard.statXp')}</div>
          <div className="num grad-text-gold" style={{ fontSize: 'clamp(36px,4vw,52px)', fontWeight: 900, lineHeight: 1 }}>
            {myStudent.xp.toLocaleString()}
          </div>
          <div style={{ fontSize: 11, color: '#64748b', marginTop: 6, display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
            <span>{earnedBadges.length} {t('dashboard.statBadges').toLowerCase()}</span>
            <span>·</span>
            <span>{myStudent.streak}d {t('common.days').slice(0,5)}</span>
          </div>
        </div>

      </div>
    </div>
  );
}

export default function ViewDashboard() {
  const { myStudent, levelInfo, leaderboard, myRank } = useApp();
  const { t } = useI18n();
  const earnedBadges = BADGES.filter((b) => myStudent.earnedBadges.includes(b.id));
  const xpToNext = levelInfo.max === Infinity ? 0 : levelInfo.max - levelInfo.xp;
  const layout = useLayoutSize();
  const isLg = layout === 'lg';
  const isSm = layout === 'sm';

  const gridCols = isLg ? 'repeat(12,1fr)' : isSm ? 'repeat(2,1fr)' : 'repeat(6,1fr)';
  const C = { background: DS.card, border: `1px solid ${DS.bd}`, borderRadius: 16, boxShadow: '0 4px 20px rgba(0,0,0,0.38)', padding: 20 };

  const stats = [
    { label: t('dashboard.statXp'),    value: myStudent.xp.toLocaleString(), sub: `Top ${Math.round((myRank/leaderboard.length)*100)}%`, icon: <IcoXp size={16} />, accent: DS.gold },
    { label: t('dashboard.statRank'),  value: `#${myRank}`, sub: `${t('common.of')} ${leaderboard.length}`, icon: <IcoTrophy size={16} />, accent: DS.blue },
    { label: t('dashboard.statStreak'),value: `${myStudent.streak}d`, sub: t('common.days'), icon: <IcoFlame size={16} />, accent: '#f97316' },
    { label: t('dashboard.statBadges'),value: `${earnedBadges.length}/${BADGES.length}`, sub: `${BADGES.filter(b=>earnedBadges.find(e=>e.id===b.id)&&b.rare).length} raras`, icon: <IcoBadge size={16} />, accent: DS.purple },
  ];

  return (
    <div className="rise-in" style={{ padding: 'clamp(14px,2.5vw,28px)', maxWidth: 1300, margin: '0 auto' }}>
      <div style={{ display: 'grid', gridTemplateColumns: gridCols, gap: 14 }}>

        <div style={{ gridColumn: '1/-1' }}>
          <DashHero myStudent={myStudent} levelInfo={levelInfo} myRank={myRank}
            leaderboard={leaderboard} xpToNext={xpToNext} earnedBadges={earnedBadges} t={t} />
        </div>

        {stats.map((s, i) => (
          <div key={i} className={`float-up d${i+1}`}
            style={{ gridColumn: isLg ? 'span 3' : isSm ? 'span 1' : 'span 3' }}>
            <StatCard label={s.label} value={s.value} sub={s.sub} icon={s.icon} accent={s.accent} />
          </div>
        ))}

        <div className="float-up d2"
          style={{ gridColumn: isLg ? 'span 5' : '1/-1', gridRow: isLg ? 'span 2' : 'auto', ...C }}>
          <SectionHeader title={t('dashboard.activity')} sub={t('dashboard.activitySub')} />
          {ACTIVITY_FEED.map((a, i) => (
            <div key={a.id} style={{
              display: 'flex', gap: 12, alignItems: 'flex-start',
              padding: '10px 0', borderTop: i > 0 ? `1px solid ${DS.bd}` : 'none',
            }}>
              <div style={{
                width: 34, height: 34, borderRadius: '50%',
                background: DS.card2, border: `1px solid ${DS.bd}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 14, flexShrink: 0,
              }}>{a.icon}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ margin: 0, fontSize: 13, color: DS.t1, lineHeight: 1.45 }}>{a.text}</p>
                <span style={{ fontSize: 11, color: DS.t3 }}>{a.time}</span>
              </div>
              {a.xp && (
                <span className="num" style={{
                  fontSize: 12, fontWeight: 700, color: DS.green,
                  background: `${DS.green}18`, padding: '2px 8px', borderRadius: 6, flexShrink: 0,
                }}>+{a.xp}</span>
              )}
            </div>
          ))}
        </div>

        <div className="float-up d3" style={{ gridColumn: isLg ? 'span 4' : '1/-1', ...C }}>
          <SectionHeader title={t('dashboard.nextGoals')} sub={t('dashboard.nextGoalsSub')} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {NEXT_ACHIEVEMENTS.map((a, i) => (
              <div key={i}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 7 }}>
                  <div>
                    <span style={{ fontSize: 13, fontWeight: 600, color: DS.t1 }}>{a.icon} {a.name}</span>
                    <div style={{ fontSize: 11, color: DS.t2, marginTop: 1 }}>{a.desc}</div>
                  </div>
                  <span className="num" style={{ fontSize: 11, color: DS.t2, flexShrink: 0, marginLeft: 8 }}>{a.progress}/{a.max}</span>
                </div>
                <div style={{ height: 5, background: 'rgba(255,255,255,0.07)', borderRadius: 99, overflow: 'hidden' }}>
                  <div style={{
                    height: '100%', width: `${(a.progress/a.max)*100}%`,
                    background: a.color, borderRadius: 99,
                    boxShadow: `0 0 8px ${a.color}66`,
                  }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="float-up d4" style={{ gridColumn: isLg ? 'span 3' : isSm ? '1/-1' : 'span 3', ...C }}>
          <SectionHeader title={t('dashboard.leaders')} sub={t('dashboard.leadersSub')} />
          {leaderboard.slice(0, 5).map((s) => (
            <div key={s.id} style={{
              display: 'flex', alignItems: 'center', gap: 9,
              padding: '7px 8px', borderRadius: 9, marginBottom: 3,
              background: s.isMe ? DS.blueDim : 'transparent',
              border: s.isMe ? `1px solid ${DS.blue}33` : '1px solid transparent',
              transition: 'background .15s',
            }}>
              <RankBadge rank={s.rank} />
              <Avatar initials={s.initials} size={27} colorIndex={parseInt(s.id.slice(1))-1} />
              <span style={{ flex: 1, fontSize: 12, fontWeight: s.isMe ? 700 : 400, color: DS.t1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {s.name.split(' ')[0]}{s.isMe ? ` (${t('common.you')})` : ''}
              </span>
              <span className="num" style={{ fontSize: 11, color: DS.t2, flexShrink: 0 }}>{s.xp.toLocaleString()}</span>
            </div>
          ))}
        </div>

        <div className="float-up d3" style={{ gridColumn: isLg ? 'span 7' : '1/-1', ...C }}>
          <SectionHeader title={t('dashboard.myBadges')} sub={t('dashboard.earnedOf', { earned: earnedBadges.length, total: BADGES.length })} />
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {BADGES.slice(0, 15).map((b) => {
              const earned = myStudent.earnedBadges.includes(b.id);
              return (
                <div key={b.id} title={b.name} style={{
                  width: 42, height: 42, borderRadius: 10,
                  background: earned ? DS.goldDim : DS.card2,
                  border: `1px solid ${earned ? DS.gold + '45' : DS.bd}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 19, opacity: earned ? 1 : 0.26,
                  boxShadow: earned ? `0 0 12px ${DS.goldDim}` : 'none',
                  transition: 'transform .15s, box-shadow .15s',
                }}
                  onMouseEnter={(e) => { if (earned) { e.currentTarget.style.transform = 'scale(1.18)'; e.currentTarget.style.boxShadow = `0 0 20px ${DS.goldGlow}`; } }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = earned ? `0 0 12px ${DS.goldDim}` : 'none'; }}
                >{b.icon}</div>
              );
            })}
          </div>
        </div>

        <div className="float-up d4" style={{ gridColumn: '1/-1', ...C, padding: '20px 24px' }}>
          <SectionHeader title={t('dashboard.subjectProgress')} sub={t('dashboard.subjectProgressSub')} />
          <SubjectProgressBars data={SUBJECT_XP} />
        </div>

      </div>
    </div>
  );
}
