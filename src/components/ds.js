// Design System tokens (mutable — los temas claro/oscuro mutan este objeto en vivo).

export const THEMES = {
  dark: {
    bg:        '#060912',  sidebar:   '#040710',  card:      '#0b1121',  card2:     '#080e1e',
    raised:    '#111c35',
    bd:        'rgba(255,255,255,0.07)',
    bdMd:      'rgba(255,255,255,0.11)',
    bdHi:      'rgba(255,255,255,0.19)',
    t1: '#e8edf8', t2: '#5a6a8a', t3: '#2c3a58',
    blue: '#4f8ef7', blueBright: '#7db3ff',
    blueDim: 'rgba(79,142,247,0.12)', blueGlow: 'rgba(79,142,247,0.38)', blueMid: 'rgba(79,142,247,0.22)',
    gold: '#f5a623', goldBright: '#ffcc5c',
    goldDim: 'rgba(245,166,35,0.13)', goldGlow: 'rgba(245,166,35,0.42)',
    green:  '#0fd9a0', red: '#f43f5e', purple: '#a78bfa',
  },
  light: {
    bg:        '#f4f6fb',  sidebar:   '#ffffff',  card:      '#ffffff',  card2:     '#f8fafc',
    raised:    '#eef2f7',
    bd:        'rgba(15,19,32,0.07)',
    bdMd:      'rgba(15,19,32,0.14)',
    bdHi:      'rgba(15,19,32,0.22)',
    t1: '#0f1320', t2: '#6b7293', t3: '#a0a7c0',
    blue: '#3b82f6', blueBright: '#1d4ed8',
    blueDim: 'rgba(59,130,246,0.09)', blueGlow: 'rgba(59,130,246,0.25)', blueMid: 'rgba(59,130,246,0.18)',
    gold: '#d97706', goldBright: '#b45309',
    goldDim: 'rgba(217,119,6,0.10)', goldGlow: 'rgba(217,119,6,0.32)',
    green: '#059669', red: '#dc2626', purple: '#7c3aed',
  },
};

// DS empieza en dark; el AppProvider lo muta cuando cambia el tema.
export const DS = { ...THEMES.dark };

export function applyTheme(name) {
  Object.assign(DS, THEMES[name] || THEMES.dark);
  try { document.documentElement.dataset.theme = name; } catch {}
}
