
// ─── Mock Data ────────────────────────────────────────────────────────────────

const LEVELS = [
  { n: 1,  title: 'Aprendiz',    min: 0,     max: 500  },
  { n: 2,  title: 'Explorador',  min: 500,   max: 1200 },
  { n: 3,  title: 'Analista',    min: 1200,  max: 2200 },
  { n: 4,  title: 'Desarrollador', min: 2200, max: 3500 },
  { n: 5,  title: 'Arquitecto',  min: 3500,  max: 5200 },
  { n: 6,  title: 'Ingeniero',   min: 5200,  max: 7200 },
  { n: 7,  title: 'Especialista',min: 7200,  max: 9800 },
  { n: 8,  title: 'Experto',     min: 9800,  max: 13000},
  { n: 9,  title: 'Maestro',     min: 13000, max: 17000},
  { n: 10, title: 'Leyenda',     min: 17000, max: Infinity},
];

function getLevelInfo(xp) {
  const lvl = LEVELS.find(l => xp >= l.min && xp < l.max) || LEVELS[LEVELS.length - 1];
  const progress = lvl.max === Infinity ? 1 : (xp - lvl.min) / (lvl.max - lvl.min);
  return { ...lvl, xp, progress: Math.min(progress, 1) };
}

const BADGES = [
  { id: 'b01', icon: '🔥', name: 'Primera Llama',   desc: 'Completaste tu primera tarea.',         cat: 'Inicio',    xp: 50,  rare: false },
  { id: 'b02', icon: '⚡', name: 'Velocista',        desc: 'Entregaste 3 tareas antes del plazo.',  cat: 'Constancia',xp: 80,  rare: false },
  { id: 'b03', icon: '🎯', name: 'Precisión',        desc: 'Nota perfecta en un examen.',           cat: 'Excelencia',xp: 120, rare: true  },
  { id: 'b04', icon: '📚', name: 'Ratón de Biblioteca',desc: '20 recursos consultados.',            cat: 'Estudio',   xp: 100, rare: false },
  { id: 'b05', icon: '🤝', name: 'Colaborador',      desc: 'Participaste en 5 foros.',              cat: 'Social',    xp: 90,  rare: false },
  { id: 'b06', icon: '🏆', name: 'Top 3',            desc: 'Estuviste en el top 3 del ranking.',    cat: 'Ranking',   xp: 200, rare: true  },
  { id: 'b07', icon: '🌟', name: 'Estrella del Mes', desc: 'Mayor XP ganado en el mes.',            cat: 'Especial',  xp: 300, rare: true  },
  { id: 'b08', icon: '🔁', name: 'Racha x7',         desc: '7 días consecutivos activo.',           cat: 'Constancia',xp: 150, rare: false },
  { id: 'b09', icon: '💡', name: 'Innovador',        desc: 'Propuesta destacada en proyecto.',      cat: 'Excelencia',xp: 175, rare: true  },
  { id: 'b10', icon: '🚀', name: 'Lanzamiento',      desc: 'Primer proyecto deployado.',            cat: 'Técnico',   xp: 250, rare: true  },
  { id: 'b11', icon: '🧩', name: 'Resolvedor',       desc: '10 ejercicios de algoritmia.',          cat: 'Técnico',   xp: 110, rare: false },
  { id: 'b12', icon: '📊', name: 'Analítico',        desc: 'Informe de datos aprobado con 9+.',     cat: 'Excelencia',xp: 130, rare: false },
  { id: 'b13', icon: '🎓', name: 'Graduado',         desc: 'Completaste el primer módulo.',         cat: 'Progreso',  xp: 400, rare: true  },
  { id: 'b14', icon: '🌍', name: 'Global',           desc: 'Proyecto con alcance internacional.',   cat: 'Especial',  xp: 350, rare: true  },
  { id: 'b15', icon: '🏅', name: 'Constancia',       desc: '30 días activo en la plataforma.',      cat: 'Constancia',xp: 200, rare: false },
];

const SUBJECTS = [
  { id: 's1', name: 'Programación OO',     color: '#1a56c4' },
  { id: 's2', name: 'Base de Datos',       color: '#1f7a4a' },
  { id: 's3', name: 'Redes',              color: '#b87d00' },
  { id: 's4', name: 'Ing. de Software',   color: '#003087' },
  { id: 's5', name: 'Cálculo',            color: '#7c3aed' },
];

const STUDENTS = [
  { id: 'u01', name: 'Osyan Granda',       initials: 'OG', xp: 4580, earnedBadges: ['b01','b02','b03','b05','b06','b08','b10'], streak: 12, isMe: true  },
  { id: 'u02', name: 'Valentina Torres',   initials: 'VT', xp: 5210, earnedBadges: ['b01','b02','b04','b05','b06','b07','b09','b11'], streak: 18, isMe: false },
  { id: 'u03', name: 'Sebastián Mora',     initials: 'SM', xp: 4990, earnedBadges: ['b01','b03','b06','b10','b13'], streak: 9,  isMe: false },
  { id: 'u04', name: 'Camila Reyes',       initials: 'CR', xp: 4120, earnedBadges: ['b01','b02','b04','b08','b11'], streak: 22, isMe: false },
  { id: 'u05', name: 'Diego Almeida',      initials: 'DA', xp: 3850, earnedBadges: ['b01','b05','b12'], streak: 5,  isMe: false },
  { id: 'u06', name: 'Lucía Vargas',       initials: 'LV', xp: 3740, earnedBadges: ['b01','b02','b03','b09'], streak: 14, isMe: false },
  { id: 'u07', name: 'Mateo Salazar',      initials: 'MS', xp: 3510, earnedBadges: ['b01','b04'], streak: 3,  isMe: false },
  { id: 'u08', name: 'Isabella Peña',      initials: 'IP', xp: 3290, earnedBadges: ['b01','b02','b05'], streak: 7,  isMe: false },
  { id: 'u09', name: 'Andrés Flores',      initials: 'AF', xp: 3010, earnedBadges: ['b01','b11'], streak: 2,  isMe: false },
  { id: 'u10', name: 'Sofía Mendoza',      initials: 'SF', xp: 2870, earnedBadges: ['b01','b02'], streak: 11, isMe: false },
  { id: 'u11', name: 'Carlos Jiménez',     initials: 'CJ', xp: 2640, earnedBadges: ['b01'], streak: 4,  isMe: false },
  { id: 'u12', name: 'Paula Ortega',       initials: 'PO', xp: 2380, earnedBadges: ['b01','b04'], streak: 6,  isMe: false },
  { id: 'u13', name: 'Rafael Castro',      initials: 'RC', xp: 2210, earnedBadges: ['b01'], streak: 1,  isMe: false },
  { id: 'u14', name: 'Natalia Ríos',       initials: 'NR', xp: 1940, earnedBadges: ['b01'], streak: 8,  isMe: false },
  { id: 'u15', name: 'Héctor Muñoz',       initials: 'HM', xp: 1650, earnedBadges: ['b01'], streak: 0,  isMe: false },
];

const XP_HISTORY = [
  { week: 'S1', xp: 180 }, { week: 'S2', xp: 220 }, { week: 'S3', xp: 310 },
  { week: 'S4', xp: 290 }, { week: 'S5', xp: 410 }, { week: 'S6', xp: 380 },
  { week: 'S7', xp: 460 }, { week: 'S8', xp: 520 }, { week: 'S9', xp: 490 },
  { week: 'S10', xp: 620 },{ week: 'S11', xp: 570 },{ week: 'S12', xp: 730 },
];

const SUBJECT_XP = [
  { subject: 'Prog. OO',   xp: 1420, maxXp: 1800 },
  { subject: 'Base Datos', xp: 980,  maxXp: 1500 },
  { subject: 'Redes',      xp: 760,  maxXp: 1200 },
  { subject: 'Ing. SW',    xp: 1100, maxXp: 1400 },
  { subject: 'Cálculo',    xp: 320,  maxXp: 800  },
];

const ACTIVITY_FEED = [
  { id: 'a1', type: 'xp',    icon: '⚡', text: 'Ganaste 120 XP en "Patrones de Diseño"',       time: 'hace 2 h',  xp: +120 },
  { id: 'a2', type: 'badge', icon: '🔥', text: 'Desbloqueaste la insignia "Primera Llama"',     time: 'hace 5 h',  xp: null },
  { id: 'a3', type: 'rank',  icon: '📈', text: 'Subiste al puesto #1 en Programación OO',       time: 'ayer',      xp: null },
  { id: 'a4', type: 'xp',    icon: '⚡', text: 'Ganaste 85 XP en "Normalización DB"',           time: 'ayer',      xp: +85  },
  { id: 'a5', type: 'badge', icon: '🎯', text: 'Desbloqueaste "Precisión" — nota 10 en examen', time: 'hace 2 d',  xp: null },
  { id: 'a6', type: 'xp',    icon: '⚡', text: 'Ganaste 200 XP en proyecto "API REST"',         time: 'hace 3 d',  xp: +200 },
];

Object.assign(window, { LEVELS, BADGES, SUBJECTS, STUDENTS, XP_HISTORY, SUBJECT_XP, ACTIVITY_FEED, getLevelInfo });
