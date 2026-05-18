import { useEffect, useRef, useId } from 'react';
import { DS } from './ds.js';
import { IcoClose } from './Icons.jsx';

// Focus-trap minimal sin dependencias externas.
// Atrapa Tab/Shift+Tab dentro de un contenedor y cierra con Escape.
function useFocusTrap(open, ref, onEscape) {
  useEffect(() => {
    if (!open || !ref.current) return undefined;
    const root = ref.current;
    const previouslyFocused = document.activeElement;

    const FOCUSABLE = 'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';
    const getFocusable = () => Array.from(root.querySelectorAll(FOCUSABLE)).filter((el) => !el.hasAttribute('aria-hidden'));

    // Mover foco al primer elemento focusable del modal.
    queueMicrotask(() => {
      const items = getFocusable();
      (items[0] || root).focus({ preventScroll: true });
    });

    function onKeyDown(e) {
      if (e.key === 'Escape') { e.stopPropagation(); onEscape?.(); return; }
      if (e.key !== 'Tab') return;
      const items = getFocusable();
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault(); last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault(); first.focus();
      }
    }
    document.addEventListener('keydown', onKeyDown);

    // Bloquear scroll del body mientras el modal está abierto.
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = prevOverflow;
      if (previouslyFocused && typeof previouslyFocused.focus === 'function') {
        previouslyFocused.focus({ preventScroll: true });
      }
    };
  }, [open, ref, onEscape]);
}

export function Avatar({ initials, size = 36, colorIndex = 0, glow = false }) {
  const pals = [
    ['linear-gradient(135deg,#1d4ed8,#4f8ef7)','#fff'],
    ['linear-gradient(135deg,#065f46,#0fd9a0)','#fff'],
    ['linear-gradient(135deg,#5b21b6,#a78bfa)','#fff'],
    ['linear-gradient(135deg,#92400e,#f5a623)','#fff'],
    ['linear-gradient(135deg,#9f1239,#f43f5e)','#fff'],
    ['linear-gradient(135deg,#0c4a6e,#22d3ee)','#fff'],
    ['linear-gradient(135deg,#134e4a,#0fd9a0)','#fff'],
    ['linear-gradient(135deg,#1e1b4b,#6366f1)','#fff'],
  ];
  const [bg, fg] = pals[Math.abs(colorIndex) % pals.length];
  const fs = size < 28 ? 10 : size < 36 ? 12 : size < 52 ? 14 : 18;
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%', background: bg, color: fg,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 800,
      fontSize: fs, flexShrink: 0, letterSpacing: '.01em', userSelect: 'none',
      boxShadow: glow ? `0 0 0 2px rgba(79,142,247,0.45), 0 0 18px rgba(79,142,247,0.28)` : 'none',
    }}>{initials}</div>
  );
}

export function XPBar({ progress, height = 7 }) {
  return (
    <div className="xp-track" style={{ height }}>
      <div className="xp-fill" style={{ width: `${Math.min(100, Math.round(progress * 100))}%` }} />
    </div>
  );
}

export function StatCard({ label, value, sub, icon, accent = '#4f8ef7', children }) {
  return (
    <div className="stat-card" style={{
      background: DS.card, border: `1px solid ${DS.bd}`,
      borderRadius: 16, padding: '18px 20px 16px',
      boxShadow: '0 4px 20px rgba(0,0,0,0.35)',
      position: 'relative', overflow: 'hidden',
      display: 'flex', flexDirection: 'column', gap: 4,
    }}>
      <div style={{
        position: 'absolute', top: -40, right: -30, width: 120, height: 100,
        borderRadius: '50%',
        background: `radial-gradient(circle, ${accent}20 0%, transparent 70%)`,
        pointerEvents: 'none',
      }} />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
        <span style={{
          fontSize: 10, fontWeight: 700, color: DS.t2,
          textTransform: 'uppercase', letterSpacing: '.1em', fontFamily: "'Inter',sans-serif",
        }}>{label}</span>
        {icon && <span style={{ color: accent, opacity: .85 }}>{icon}</span>}
      </div>
      <div className="num" style={{ fontSize: 30, fontWeight: 800, color: DS.t1, lineHeight: 1, whiteSpace: 'nowrap' }}>{value}</div>
      {sub && <div style={{ fontSize: 12, color: DS.t2, marginTop: 2 }}>{sub}</div>}
      {children}
    </div>
  );
}

export function SectionHeader({ title, sub, action }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
      <div>
        <h2 className="head" style={{ margin: 0, fontSize: 14, fontWeight: 700, color: DS.t1, letterSpacing: '-.01em' }}>{title}</h2>
        {sub && <p style={{ margin: '3px 0 0', fontSize: 12, color: DS.t2 }}>{sub}</p>}
      </div>
      {action}
    </div>
  );
}

export function Pill({ label, color = '#4f8ef7', bg }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', padding: '3px 10px',
      borderRadius: 99, fontSize: 11, fontWeight: 600, color,
      background: bg || color + '1e', border: `1px solid ${color}35`, letterSpacing: '.02em',
    }}>{label}</span>
  );
}

export function RankBadge({ rank }) {
  const cfg = {
    1: { bg: 'linear-gradient(135deg,#92400e,#d97706)', color: '#fef3c7', shadow: '0 0 14px rgba(245,158,11,0.45)' },
    2: { bg: 'linear-gradient(135deg,#1e293b,#475569)', color: '#cbd5e1', shadow: 'none' },
    3: { bg: 'linear-gradient(135deg,#431407,#7c2d12)', color: '#fed7aa', shadow: 'none' },
  }[rank] || { bg: DS.card2, color: DS.t2, shadow: 'none' };
  return (
    <div className="num" style={{
      width: 28, height: 28, borderRadius: 7, flexShrink: 0,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontWeight: 700, fontSize: 12,
      background: cfg.bg, color: cfg.color, boxShadow: cfg.shadow,
    }}>{rank}</div>
  );
}

export function BadgeCard({ badge, earned = false, onClick }) {
  return (
    <div onClick={onClick}
      className={`badge-card${earned ? ' earned' : ''}`}
      style={{
        cursor: 'pointer',
        background: earned ? `linear-gradient(160deg,${DS.goldDim},${DS.card} 55%)` : DS.card2,
        border: `1px solid ${earned ? DS.gold + '40' : DS.bd}`,
        borderRadius: 14, padding: '16px 12px', textAlign: 'center',
        opacity: earned ? 1 : 0.55, position: 'relative',
        boxShadow: '0 2px 8px rgba(0,0,0,0.25)',
      }}>
      {badge.rare && earned && (
        <div style={{
          position: 'absolute', top: 7, right: 7,
          fontSize: 9, fontWeight: 800, letterSpacing: '.05em',
          background: 'linear-gradient(135deg,#1d4ed8,#7c3aed)',
          color: '#e0e7ff', borderRadius: 4, padding: '2px 6px',
        }}>RARO</div>
      )}
      <div style={{ fontSize: 28, lineHeight: 1, marginBottom: 8 }}>{badge.icon}</div>
      <div className="head" style={{ fontSize: 12, fontWeight: 700, color: DS.t1, lineHeight: 1.3 }}>{badge.name}</div>
      <div className="num" style={{ fontSize: 11, color: earned ? DS.goldBright : DS.t2, marginTop: 5 }}>+{badge.xp} XP</div>
      {!earned && <div style={{ marginTop: 5, fontSize: 9, fontWeight: 700, color: DS.t3, letterSpacing: '.06em', textTransform: 'uppercase' }}>BLOQUEADO</div>}
    </div>
  );
}

export function Btn({ children, variant = 'primary', size = 'md', onClick, disabled, type = 'button', style: s }) {
  const base = {
    border: 'none', borderRadius: 9, fontFamily: "'Inter',sans-serif", fontWeight: 600,
    cursor: disabled ? 'not-allowed' : 'pointer', transition: 'all .15s',
    display: 'inline-flex', alignItems: 'center', gap: 7, opacity: disabled ? 0.4 : 1,
  };
  const sizes = {
    sm: { padding: '6px 14px', fontSize: 12 },
    md: { padding: '9px 20px', fontSize: 13 },
    lg: { padding: '12px 26px', fontSize: 14 },
  };
  const variants = {
    primary: { background: 'linear-gradient(135deg,#1d4ed8,#4f8ef7)', color: '#fff', boxShadow: '0 2px 14px rgba(79,142,247,0.38)' },
    gold:    { background: 'linear-gradient(135deg,#b45309,#f5a623)', color: '#fff', boxShadow: '0 2px 14px rgba(245,166,35,0.38)' },
    ghost:   { background: 'rgba(255,255,255,0.06)', color: '#94a3b8', border: '1px solid rgba(255,255,255,0.12)' },
    danger:  { background: 'rgba(244,63,94,0.12)', color: '#f43f5e', border: '1px solid rgba(244,63,94,0.3)' },
  };
  return (
    <button type={type} onClick={onClick} disabled={disabled} style={{ ...base, ...sizes[size], ...variants[variant], ...s }}
      onMouseEnter={e => { if (!disabled) e.currentTarget.style.filter = 'brightness(1.12)'; }}
      onMouseLeave={e => { e.currentTarget.style.filter = ''; }}>
      {children}
    </button>
  );
}

export function Input({ placeholder, value, onChange, icon, type = 'text', style: s }) {
  return (
    <div style={{ position: 'relative', ...s }}>
      {icon && <span style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: DS.t2, display: 'flex', pointerEvents: 'none' }}>{icon}</span>}
      <input type={type} value={value} onChange={onChange} placeholder={placeholder} style={{
        width: '100%', boxSizing: 'border-box',
        padding: `9px ${icon ? 36 : 13}px 9px ${icon ? 36 : 13}px`,
        border: `1px solid ${DS.bdMd}`, borderRadius: 9, fontSize: 13,
        fontFamily: "'Inter',sans-serif", background: DS.bg, color: DS.t1, outline: 'none',
        transition: 'border-color .15s, box-shadow .15s',
      }}
        onFocus={e => { e.target.style.borderColor = DS.blue; e.target.style.boxShadow = `0 0 0 3px ${DS.blueDim}`; }}
        onBlur={e => { e.target.style.borderColor = DS.bdMd; e.target.style.boxShadow = 'none'; }}
      />
    </div>
  );
}

export function Modal({ open, onClose, title, children, width = 480 }) {
  const dialogRef = useRef(null);
  const titleId = useId();
  useFocusTrap(open, dialogRef, onClose);
  if (!open) return null;
  return (
    <div
      className="fade-in"
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: 'rgba(0,0,0,0.78)', backdropFilter: 'blur(8px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
        className="rise-in"
        style={{
          background: DS.card, borderRadius: 20, width, maxWidth: '100%',
          border: `1px solid ${DS.bdMd}`,
          boxShadow: '0 32px 80px rgba(0,0,0,0.75), 0 0 0 1px rgba(255,255,255,0.05)',
          overflow: 'hidden',
          outline: 'none',
        }}
      >
        <div style={{ padding: '18px 24px 14px', borderBottom: `1px solid ${DS.bd}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span id={titleId} className="head" style={{ fontWeight: 700, fontSize: 15, color: DS.t1 }}>{title}</span>
          <button
            onClick={onClose}
            aria-label="Cerrar diálogo"
            style={{ background: 'rgba(255,255,255,0.08)', border: 'none', borderRadius: 6, cursor: 'pointer', color: DS.t2, display: 'flex', padding: 6 }}
          >
            <IcoClose size={14} />
          </button>
        </div>
        <div style={{ padding: '20px 24px 24px' }}>{children}</div>
      </div>
    </div>
  );
}

export function EmptyState({ icon, title, sub }) {
  return (
    <div style={{ textAlign: 'center', padding: '48px 24px' }}>
      <div style={{ width: 60, height: 60, borderRadius: 16, background: DS.card2, border: `1px solid ${DS.bd}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, margin: '0 auto 16px' }}>{icon}</div>
      <div className="head" style={{ fontWeight: 700, color: DS.t1, marginBottom: 6, fontSize: 15 }}>{title}</div>
      <div style={{ fontSize: 13, color: DS.t2 }}>{sub}</div>
    </div>
  );
}

export function Toast({ message, type = 'success', onClose }) {
  const cfg = {
    success: { color: DS.green, bd: 'rgba(15,217,160,0.25)' },
    gold:    { color: DS.gold,  bd: 'rgba(245,166,35,0.25)' },
    info:    { color: DS.blue,  bd: 'rgba(79,142,247,0.25)' },
  }[type] || {};
  useEffect(() => { const t = setTimeout(onClose, 3500); return () => clearTimeout(t); }, [onClose]);
  return (
    <div
      role="status"
      aria-live="polite"
      aria-atomic="true"
      style={{
        position: 'fixed', bottom: 28, right: 28, zIndex: 2000,
        background: DS.card, border: `1px solid ${cfg.bd}`,
        borderRadius: 13, padding: '13px 18px',
        boxShadow: '0 16px 40px rgba(0,0,0,0.55)',
        display: 'flex', alignItems: 'center', gap: 12,
        animation: 'riseIn .3s ease-out', maxWidth: 360,
      }}
    >
      <div aria-hidden="true" style={{ width: 8, height: 8, borderRadius: '50%', background: cfg.color, flexShrink: 0, boxShadow: `0 0 10px ${cfg.color}` }} />
      <span style={{ color: DS.t1, fontWeight: 500, fontSize: 13, flex: 1 }}>{message}</span>
      <button onClick={onClose} aria-label="Cerrar notificación" style={{ background: 'none', border: 'none', cursor: 'pointer', color: DS.t2, display: 'flex' }}>
        <IcoClose size={13} />
      </button>
    </div>
  );
}
