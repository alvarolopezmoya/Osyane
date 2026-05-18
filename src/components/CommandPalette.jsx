import { useEffect, useState, useMemo } from 'react';
import { Command } from 'cmdk';
import { useApp } from '../store.jsx';
import { useI18n, LOCALES } from '../i18n/index.jsx';
import { DS } from './ds.js';
import { BADGES } from '../data.js';
import {
  IcoDashboard, IcoRanking, IcoBadge, IcoProgress, IcoTeacher, IcoTasks,
  IcoSun, IcoMoon, IcoGlobe, IcoSearch,
} from './Icons.jsx';

// Hook: Cmd+K (Mac) / Ctrl+K (Win/Linux) abre/cierra el palette.
export function useCommandPaletteHotkey(setOpen) {
  useEffect(() => {
    function onKey(e) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen((v) => !v);
      }
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [setOpen]);
}

export default function CommandPalette({ open, onClose }) {
  const { userRole, setActiveView, toggleTheme, theme, leaderboard, maskName, logout } = useApp();
  const { t, locale, setLocale } = useI18n();
  const [query, setQuery] = useState('');

  // Reset query al cerrar.
  useEffect(() => { if (!open) setQuery(''); }, [open]);

  // Escape cierra el palette (cmdk no lo hace por defecto).
  useEffect(() => {
    if (!open) return undefined;
    function onKey(e) {
      if (e.key === 'Escape') { e.preventDefault(); onClose(); }
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  const isTeacher = userRole === 'teacher';

  // Construir items: navegación + acciones + estudiantes (para "ir a perfil") + insignias.
  const navItems = useMemo(() => [
    { id: 'nav:dashboard',   label: t('nav.dashboard'),   icon: IcoDashboard, role: 'student', shortcut: 'g d', action: () => setActiveView('dashboard') },
    { id: 'nav:leaderboard', label: t('nav.leaderboard'), icon: IcoRanking,                    shortcut: 'g r', action: () => setActiveView('leaderboard') },
    { id: 'nav:badges',      label: t('nav.badges'),      icon: IcoBadge,     role: 'student', shortcut: 'g b', action: () => setActiveView('badges') },
    { id: 'nav:progress',    label: t('nav.progress'),    icon: IcoProgress,  role: 'student', shortcut: 'g p', action: () => setActiveView('progress') },
    { id: 'nav:tasks',       label: t('nav.tasks'),       icon: IcoTasks,     role: 'student', shortcut: 'g t', action: () => setActiveView('tasks') },
    { id: 'nav:teacher',     label: t('nav.teacher'),     icon: IcoTeacher,   role: 'teacher', shortcut: 'g t', action: () => setActiveView('teacher') },
  ].filter((it) => !it.role || (isTeacher ? it.role === 'teacher' || it.role !== 'student' : it.role === 'student' || !it.role)), [t, isTeacher, setActiveView]);

  function run(action) { action(); onClose(); }

  if (!open) return null;

  return (
    <div
      role="presentation"
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 3000,
        background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(6px)',
        display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
        padding: '12vh 20px 20px',
      }}
    >
      <Command
        onClick={(e) => e.stopPropagation()}
        label="Paleta de comandos"
        loop
        className="rise-in"
        style={{
          width: '100%', maxWidth: 560,
          background: DS.card, border: `1px solid ${DS.bdMd}`,
          borderRadius: 14,
          boxShadow: '0 32px 80px rgba(0,0,0,0.75), 0 0 0 1px rgba(255,255,255,0.05)',
          overflow: 'hidden',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '14px 18px', borderBottom: `1px solid ${DS.bd}` }}>
          <span style={{ color: DS.t2, display: 'flex' }}><IcoSearch size={16} /></span>
          <Command.Input
            value={query}
            onValueChange={setQuery}
            placeholder="Buscar comando, estudiante, insignia…"
            autoFocus
            style={{
              flex: 1, background: 'transparent', border: 'none',
              outline: 'none', color: DS.t1, fontSize: 14,
              fontFamily: "'Inter', sans-serif",
            }}
          />
          <kbd style={{
            fontSize: 10, fontWeight: 700, color: DS.t3,
            background: DS.card2, border: `1px solid ${DS.bd}`,
            borderRadius: 5, padding: '2px 6px',
            fontFamily: "'JetBrains Mono', monospace",
          }}>ESC</kbd>
        </div>

        <Command.List style={{ maxHeight: 400, overflowY: 'auto', padding: 8 }}>
          <Command.Empty style={{ padding: '24px 18px', textAlign: 'center', color: DS.t3, fontSize: 13 }}>
            Sin resultados para "{query}"
          </Command.Empty>

          <Command.Group heading={<GroupHeader label="Navegación" />}>
            {navItems.map((it) => {
              const Icon = it.icon;
              return (
                <PaletteItem key={it.id} value={`${it.id} ${it.label}`} onSelect={() => run(it.action)}>
                  <Icon size={16} />
                  <span style={{ flex: 1 }}>{it.label}</span>
                  {it.shortcut && <Shortcut keys={it.shortcut} />}
                </PaletteItem>
              );
            })}
          </Command.Group>

          <Command.Group heading={<GroupHeader label="Acciones" />}>
            <PaletteItem value="toggle theme dark light" onSelect={() => run(toggleTheme)}>
              {theme === 'dark' ? <IcoSun size={16} /> : <IcoMoon size={16} />}
              <span style={{ flex: 1 }}>{theme === 'dark' ? t('common.light') : t('common.dark')}</span>
            </PaletteItem>
            <PaletteItem value="cerrar sesion logout" onSelect={() => run(logout)}>
              <span style={{ width: 16, textAlign: 'center' }}>⤴</span>
              <span style={{ flex: 1 }}>{t('nav.logout')}</span>
            </PaletteItem>
          </Command.Group>

          <Command.Group heading={<GroupHeader label={t('common.language')} />}>
            {LOCALES.map((loc) => (
              <PaletteItem key={`locale-${loc.code}`} value={`locale ${loc.code} ${loc.label}`} onSelect={() => run(() => setLocale(loc.code))}>
                <IcoGlobe size={16} />
                <span style={{ flex: 1 }}>{loc.label}</span>
                {locale === loc.code && <span style={{ fontSize: 11, color: DS.blueBright, fontWeight: 700 }}>activo</span>}
              </PaletteItem>
            ))}
          </Command.Group>

          {query.length >= 2 && (
            <Command.Group heading={<GroupHeader label="Estudiantes" />}>
              {leaderboard.slice(0, 5).map((s) => (
                <PaletteItem
                  key={`student-${s.id}`}
                  value={`student ${maskName(s)} ${s.email || ''}`}
                  onSelect={() => run(() => setActiveView('leaderboard'))}
                >
                  <span style={{
                    width: 22, height: 22, borderRadius: '50%',
                    background: 'linear-gradient(135deg,#1d4ed8,#4f8ef7)',
                    color: '#fff', fontSize: 10, fontWeight: 800,
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  }}>{s.initials}</span>
                  <span style={{ flex: 1 }}>{maskName(s)}</span>
                  <span className="num" style={{ fontSize: 11, color: DS.t3 }}>#{s.rank} · {s.xp.toLocaleString()} XP</span>
                </PaletteItem>
              ))}
            </Command.Group>
          )}

          {query.length >= 2 && (
            <Command.Group heading={<GroupHeader label="Insignias" />}>
              {BADGES.filter((b) => b.name.toLowerCase().includes(query.toLowerCase())).slice(0, 5).map((b) => (
                <PaletteItem
                  key={`badge-${b.id}`}
                  value={`badge ${b.name} ${b.cat}`}
                  onSelect={() => run(() => setActiveView('badges'))}
                >
                  <span style={{ width: 16, textAlign: 'center', fontSize: 14 }}>{b.icon}</span>
                  <span style={{ flex: 1 }}>{b.name}</span>
                  <span style={{ fontSize: 11, color: DS.t3 }}>{b.cat}</span>
                </PaletteItem>
              ))}
            </Command.Group>
          )}
        </Command.List>

        <div style={{
          padding: '8px 14px', borderTop: `1px solid ${DS.bd}`,
          display: 'flex', alignItems: 'center', gap: 16,
          fontSize: 10, color: DS.t3, fontWeight: 600,
        }}>
          <span><kbd style={kbdStyle()}>↑↓</kbd> navegar</span>
          <span><kbd style={kbdStyle()}>↵</kbd> seleccionar</span>
          <span><kbd style={kbdStyle()}>esc</kbd> cerrar</span>
          <span style={{ marginLeft: 'auto' }}>Osyane · v2</span>
        </div>
      </Command>
    </div>
  );
}

function PaletteItem({ children, value, onSelect }) {
  return (
    <Command.Item
      value={value}
      onSelect={onSelect}
      style={{
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '9px 12px', borderRadius: 8, cursor: 'pointer',
        color: DS.t1, fontSize: 13, fontFamily: "'Inter', sans-serif",
      }}
    >
      {children}
    </Command.Item>
  );
}

function GroupHeader({ label }) {
  return (
    <div style={{
      padding: '8px 12px 4px', fontSize: 10, fontWeight: 700,
      color: DS.t3, textTransform: 'uppercase', letterSpacing: '.08em',
    }}>{label}</div>
  );
}

function Shortcut({ keys }) {
  return (
    <span style={{ display: 'inline-flex', gap: 4 }}>
      {keys.split(' ').map((k, i) => <kbd key={i} style={kbdStyle()}>{k}</kbd>)}
    </span>
  );
}

function kbdStyle() {
  return {
    fontSize: 10, fontWeight: 700, color: DS.t3,
    background: DS.card2, border: `1px solid ${DS.bd}`,
    borderRadius: 4, padding: '1px 5px',
    fontFamily: "'JetBrains Mono', monospace",
  };
}
