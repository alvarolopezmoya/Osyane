
// ─── Shared UI Components ─────────────────────────────────────────────────────

// Avatar
function Avatar({ initials, size = 36, colorIndex = 0 }) {
  const palettes = [
    ['#003087','#fff'], ['#1f7a4a','#fff'], ['#7c3aed','#fff'],
    ['#b87d00','#fff'], ['#b5352a','#fff'], ['#0a3fa0','#fff'],
  ];
  const [bg, fg] = palettes[colorIndex % palettes.length];
  const fs = size < 32 ? 11 : size < 44 ? 13 : 15;
  return (
    <div style={{ width: size, height: size, borderRadius: '50%', background: bg, color: fg,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: fs, flexShrink: 0, letterSpacing: '0.02em' }}>
      {initials}
    </div>
  );
}

// XP progress bar
function XPBar({ progress, height = 6, shine = true }) {
  return (
    <div style={{ background: '#e6e8f1', borderRadius: 99, overflow: 'hidden', height }}>
      <div style={{ height: '100%', width: `${Math.round(progress * 100)}%`,
        background: 'linear-gradient(90deg, #FFB800 0%, #FFD000 100%)',
        borderRadius: 99, position: 'relative', transition: 'width .6s cubic-bezier(.4,0,.2,1)' }}
        className={shine ? 'xp-shine' : ''}>
      </div>
    </div>
  );
}

// Stat card
function StatCard({ label, value, sub, icon, accent = '#003087', children }) {
  return (
    <div style={{ background: '#fff', border: '1px solid #e6e8f1', borderRadius: 12, padding: '18px 20px',
      boxShadow: '0 1px 2px rgba(15,19,32,0.05)', display: 'flex', flexDirection: 'column', gap: 6 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 12, fontWeight: 600, color: '#6b7293', textTransform: 'uppercase', letterSpacing: '.06em' }}>{label}</span>
        {icon && <span style={{ color: accent }}>{icon}</span>}
      </div>
      <div style={{ fontSize: 28, fontWeight: 800, color: '#0f1320', fontFamily: 'JetBrains Mono, monospace', lineHeight: 1 }}>{value}</div>
      {sub && <div style={{ fontSize: 12, color: '#9097b5' }}>{sub}</div>}
      {children}
    </div>
  );
}

// Section header
function SectionHeader({ title, sub, action }) {
  return (
    <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 14 }}>
      <div>
        <h2 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: '#1b2036' }}>{title}</h2>
        {sub && <p style={{ margin: '2px 0 0', fontSize: 12, color: '#9097b5' }}>{sub}</p>}
      </div>
      {action}
    </div>
  );
}

// Badge pill
function Pill({ label, color = '#003087', bg = '#eef3fb' }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '2px 8px',
      borderRadius: 99, fontSize: 11, fontWeight: 600, color, background: bg, letterSpacing: '.02em' }}>
      {label}
    </span>
  );
}

// Rank badge (#1, #2, #3 etc)
function RankBadge({ rank }) {
  const medals = { 1: { bg: '#FFD700', color: '#7a5c00' }, 2: { bg: '#C0C8D8', color: '#3a4560' }, 3: { bg: '#CD8E60', color: '#5c3010' } };
  const style = medals[rank] || { bg: '#ebeef7', color: '#6b7293' };
  return (
    <div style={{ width: 26, height: 26, borderRadius: 6, display: 'flex', alignItems: 'center',
      justifyContent: 'center', fontFamily: 'JetBrains Mono, monospace', fontWeight: 700,
      fontSize: 12, background: style.bg, color: style.color, flexShrink: 0 }}>
      {rank}
    </div>
  );
}

// Badge icon card
function BadgeCard({ badge, earned = false, onClick }) {
  return (
    <div onClick={onClick} style={{ cursor: 'pointer', border: `1.5px solid ${earned ? '#FFB800' : '#e6e8f1'}`,
      borderRadius: 12, padding: '14px 12px', textAlign: 'center', background: earned ? '#fffaec' : '#fafafa',
      opacity: earned ? 1 : 0.55, transition: 'transform .15s, box-shadow .15s', position: 'relative' }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(15,19,32,0.1)'; }}
      onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; }}>
      {badge.rare && earned && (
        <div style={{ position: 'absolute', top: 6, right: 7, fontSize: 9, fontWeight: 700,
          background: '#003087', color: '#FFB800', borderRadius: 4, padding: '1px 5px', letterSpacing: '.04em' }}>RARO</div>
      )}
      <div style={{ fontSize: 28, lineHeight: 1, marginBottom: 6 }}>{badge.icon}</div>
      <div style={{ fontSize: 12, fontWeight: 700, color: '#1b2036', lineHeight: 1.3 }}>{badge.name}</div>
      <div style={{ fontSize: 11, color: '#9097b5', marginTop: 4 }}>+{badge.xp} XP</div>
      {!earned && <div style={{ fontSize: 10, color: '#c0c5da', marginTop: 3 }}>Bloqueado</div>}
    </div>
  );
}

// Button
function Btn({ children, variant = 'primary', size = 'md', onClick, disabled, style: s }) {
  const base = { border: 'none', borderRadius: 8, fontFamily: 'Inter, sans-serif', fontWeight: 600,
    cursor: disabled ? 'not-allowed' : 'pointer', transition: 'all .15s', display: 'inline-flex',
    alignItems: 'center', gap: 6, opacity: disabled ? 0.5 : 1 };
  const sizes = { sm: { padding: '5px 12px', fontSize: 12 }, md: { padding: '8px 18px', fontSize: 13 }, lg: { padding: '11px 24px', fontSize: 14 } };
  const variants = {
    primary: { background: '#003087', color: '#fff' },
    gold:    { background: '#FFB800', color: '#2a1a00' },
    ghost:   { background: 'transparent', color: '#003087', border: '1.5px solid #dde1ef' },
    danger:  { background: '#fef2f2', color: '#b5352a', border: '1.5px solid #fecaca' },
  };
  return (
    <button onClick={onClick} disabled={disabled} style={{ ...base, ...sizes[size], ...variants[variant], ...s }}
      onMouseEnter={e => { if (!disabled) e.currentTarget.style.filter = 'brightness(1.08)'; }}
      onMouseLeave={e => { e.currentTarget.style.filter = ''; }}>
      {children}
    </button>
  );
}

// Input
function Input({ placeholder, value, onChange, icon, style: s }) {
  return (
    <div style={{ position: 'relative', ...s }}>
      {icon && <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#9097b5' }}>{icon}</span>}
      <input value={value} onChange={onChange} placeholder={placeholder}
        style={{ width: '100%', boxSizing: 'border-box', padding: `8px ${icon ? 34 : 12}px 8px ${icon ? 34 : 12}px`,
          border: '1.5px solid #dde1ef', borderRadius: 8, fontSize: 13, fontFamily: 'Inter, sans-serif',
          background: '#fff', color: '#1b2036', outline: 'none' }}
        onFocus={e => e.target.style.borderColor = '#003087'}
        onBlur={e => e.target.style.borderColor = '#dde1ef'} />
    </div>
  );
}

// Modal
function Modal({ open, onClose, title, children, width = 480 }) {
  if (!open) return null;
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,19,32,0.45)', zIndex: 1000,
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}
      onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{ background: '#fff', borderRadius: 16,
        width, maxWidth: '100%', boxShadow: '0 20px 60px rgba(15,19,32,0.25)', overflow: 'hidden' }}>
        <div style={{ padding: '18px 24px 14px', borderBottom: '1px solid #e6e8f1', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontWeight: 700, fontSize: 15, color: '#1b2036' }}>{title}</span>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9097b5', display: 'flex' }}>
            <IcoClose size={18} />
          </button>
        </div>
        <div style={{ padding: '20px 24px 24px' }}>{children}</div>
      </div>
    </div>
  );
}

// Empty state
function EmptyState({ icon, title, sub }) {
  return (
    <div style={{ textAlign: 'center', padding: '48px 24px', color: '#9097b5' }}>
      <div style={{ fontSize: 36, marginBottom: 12 }}>{icon}</div>
      <div style={{ fontWeight: 700, color: '#4a5170', marginBottom: 6 }}>{title}</div>
      <div style={{ fontSize: 13 }}>{sub}</div>
    </div>
  );
}

// Toast notification
function Toast({ message, type = 'success', onClose }) {
  const colors = { success: '#1f7a4a', gold: '#b87d00', info: '#003087' };
  const bgs = { success: '#f0fdf4', gold: '#fffaec', info: '#eef3fb' };
  React.useEffect(() => { const t = setTimeout(onClose, 3000); return () => clearTimeout(t); }, []);
  return (
    <div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 2000, background: bgs[type],
      border: `1.5px solid ${colors[type]}30`, borderRadius: 12, padding: '12px 18px',
      boxShadow: '0 8px 32px rgba(15,19,32,0.14)', display: 'flex', alignItems: 'center', gap: 10,
      animation: 'riseIn .3s ease-out' }}>
      <span style={{ color: colors[type], fontWeight: 700, fontSize: 13 }}>{message}</span>
      <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9097b5' }}>
        <IcoClose size={14} />
      </button>
    </div>
  );
}

Object.assign(window, { Avatar, XPBar, StatCard, SectionHeader, Pill, RankBadge, BadgeCard, Btn, Input, Modal, EmptyState, Toast });
