// Datos semilla (mock). En producción esto se reemplaza por el servicio `api.js`.

export const BADGES = [
  { id: 'b01', icon: '🔥', name: 'Primera Llama',      desc: 'Completaste tu primera tarea.',         cat: 'Inicio',     xp: 50,  rare: false },
  { id: 'b02', icon: '⚡', name: 'Velocista',           desc: 'Entregaste 3 tareas antes del plazo.',  cat: 'Constancia', xp: 80,  rare: false },
  { id: 'b03', icon: '🎯', name: 'Precisión',           desc: 'Nota perfecta en un examen.',           cat: 'Excelencia', xp: 120, rare: true  },
  { id: 'b04', icon: '📚', name: 'Ratón de Biblioteca', desc: '20 recursos consultados.',              cat: 'Estudio',    xp: 100, rare: false },
  { id: 'b05', icon: '🤝', name: 'Colaborador',         desc: 'Participaste en 5 foros.',              cat: 'Social',     xp: 90,  rare: false },
  { id: 'b06', icon: '🏆', name: 'Top 3',               desc: 'Estuviste en el top 3 del ranking.',    cat: 'Ranking',    xp: 200, rare: true  },
  { id: 'b07', icon: '🌟', name: 'Estrella del Mes',    desc: 'Mayor XP ganado en el mes.',            cat: 'Especial',   xp: 300, rare: true  },
  { id: 'b08', icon: '🔁', name: 'Racha x7',            desc: '7 días consecutivos activo.',           cat: 'Constancia', xp: 150, rare: false },
  { id: 'b09', icon: '💡', name: 'Innovador',           desc: 'Propuesta destacada en proyecto.',      cat: 'Excelencia', xp: 175, rare: true  },
  { id: 'b10', icon: '🚀', name: 'Lanzamiento',         desc: 'Primer proyecto deployado.',            cat: 'Técnico',    xp: 250, rare: true  },
  { id: 'b11', icon: '🧩', name: 'Resolvedor',          desc: '10 ejercicios de algoritmia.',          cat: 'Técnico',    xp: 110, rare: false },
  { id: 'b12', icon: '📊', name: 'Analítico',           desc: 'Informe de datos aprobado con 9+.',     cat: 'Excelencia', xp: 130, rare: false },
  { id: 'b13', icon: '🎓', name: 'Graduado',            desc: 'Completaste el primer módulo.',         cat: 'Progreso',   xp: 400, rare: true  },
  { id: 'b14', icon: '🌍', name: 'Global',              desc: 'Proyecto con alcance internacional.',   cat: 'Especial',   xp: 350, rare: true  },
  { id: 'b15', icon: '🏅', name: 'Constancia',          desc: '30 días activo en la plataforma.',      cat: 'Constancia', xp: 200, rare: false },
];

export const SUBJECTS = [
  { id: 's1', name: 'Programación OO',   color: '#1a56c4' },
  { id: 's2', name: 'Base de Datos',     color: '#1f7a4a' },
  { id: 's3', name: 'Redes',             color: '#b87d00' },
  { id: 's4', name: 'Ing. de Software',  color: '#003087' },
  { id: 's5', name: 'Cálculo',           color: '#7c3aed' },
];

export const STUDENTS = [
  { id: 'u01', name: 'Osyan Granda',     initials: 'OG', email: 'ogranda8821@uta.edu.ec', xp: 4580, earnedBadges: ['b01','b02','b03','b05','b06','b08','b10'], streak: 12, isMe: true  },
  { id: 'u02', name: 'Valentina Torres', initials: 'VT', email: 'vtorres5543@uta.edu.ec', xp: 5210, earnedBadges: ['b01','b02','b04','b05','b06','b07','b09','b11'], streak: 18, isMe: false },
  { id: 'u03', name: 'Sebastián Mora',   initials: 'SM', email: 'smora6612@uta.edu.ec',   xp: 4990, earnedBadges: ['b01','b03','b06','b10','b13'], streak: 9,  isMe: false },
  { id: 'u04', name: 'Camila Reyes',     initials: 'CR', email: 'creyes7731@uta.edu.ec',  xp: 4120, earnedBadges: ['b01','b02','b04','b08','b11'], streak: 22, isMe: false },
  { id: 'u05', name: 'Diego Almeida',    initials: 'DA', email: 'dalmeida4423@uta.edu.ec',xp: 3850, earnedBadges: ['b01','b05','b12'], streak: 5,  isMe: false },
  { id: 'u06', name: 'Lucía Vargas',     initials: 'LV', email: 'lvargas3312@uta.edu.ec', xp: 3740, earnedBadges: ['b01','b02','b03','b09'], streak: 14, isMe: false },
  { id: 'u07', name: 'Mateo Salazar',    initials: 'MS', email: 'msalazar8821@uta.edu.ec',xp: 3510, earnedBadges: ['b01','b04'], streak: 3,  isMe: false },
  { id: 'u08', name: 'Isabella Peña',    initials: 'IP', email: 'ipena9934@uta.edu.ec',   xp: 3290, earnedBadges: ['b01','b02','b05'], streak: 7,  isMe: false },
  { id: 'u09', name: 'Andrés Flores',    initials: 'AF', email: 'aflores2243@uta.edu.ec', xp: 3010, earnedBadges: ['b01','b11'], streak: 2,  isMe: false },
  { id: 'u10', name: 'Sofía Mendoza',    initials: 'SF', email: 'smendoza1198@uta.edu.ec',xp: 2870, earnedBadges: ['b01','b02'], streak: 11, isMe: false },
  { id: 'u11', name: 'Carlos Jiménez',   initials: 'CJ', email: 'cjimenez6647@uta.edu.ec',xp: 2640, earnedBadges: ['b01'], streak: 4,  isMe: false },
  { id: 'u12', name: 'Paula Ortega',     initials: 'PO', email: 'portega3356@uta.edu.ec', xp: 2380, earnedBadges: ['b01','b04'], streak: 6,  isMe: false },
  { id: 'u13', name: 'Rafael Castro',    initials: 'RC', email: 'rcastro7782@uta.edu.ec', xp: 2210, earnedBadges: ['b01'], streak: 1,  isMe: false },
  { id: 'u14', name: 'Natalia Ríos',     initials: 'NR', email: 'nrios4421@uta.edu.ec',   xp: 1940, earnedBadges: ['b01'], streak: 8,  isMe: false },
  { id: 'u15', name: 'Héctor Muñoz',     initials: 'HM', email: 'hmunoz9913@uta.edu.ec',  xp: 1650, earnedBadges: ['b01'], streak: 0,  isMe: false },
];

export const XP_HISTORY = [
  { week: 'S1', xp: 180 }, { week: 'S2', xp: 220 }, { week: 'S3', xp: 310 },
  { week: 'S4', xp: 290 }, { week: 'S5', xp: 410 }, { week: 'S6', xp: 380 },
  { week: 'S7', xp: 460 }, { week: 'S8', xp: 520 }, { week: 'S9', xp: 490 },
  { week: 'S10', xp: 620 },{ week: 'S11', xp: 570 },{ week: 'S12', xp: 730 },
];

export const SUBJECT_XP = [
  { subject: 'Prog. OO',   xp: 1420, maxXp: 1800 },
  { subject: 'Base Datos', xp: 980,  maxXp: 1500 },
  { subject: 'Redes',      xp: 760,  maxXp: 1200 },
  { subject: 'Ing. SW',    xp: 1100, maxXp: 1400 },
  { subject: 'Cálculo',    xp: 320,  maxXp: 800  },
];

export const ACTIVITY_FEED = [
  { id: 'a1', type: 'xp',    icon: '⚡', text: 'Ganaste 120 XP en "Patrones de Diseño"',       time: 'hace 2 h',  xp: +120 },
  { id: 'a2', type: 'badge', icon: '🔥', text: 'Desbloqueaste la insignia "Primera Llama"',     time: 'hace 5 h',  xp: null },
  { id: 'a3', type: 'rank',  icon: '📈', text: 'Subiste al puesto #1 en Programación OO',       time: 'ayer',      xp: null },
  { id: 'a4', type: 'xp',    icon: '⚡', text: 'Ganaste 85 XP en "Normalización DB"',           time: 'ayer',      xp: +85  },
  { id: 'a5', type: 'badge', icon: '🎯', text: 'Desbloqueaste "Precisión" — nota 10 en examen', time: 'hace 2 d',  xp: null },
  { id: 'a6', type: 'xp',    icon: '⚡', text: 'Ganaste 200 XP en proyecto "API REST"',         time: 'hace 3 d',  xp: +200 },
];

export const TEACHERS = [
  { id: 't01', name: 'Dr. Carlos Pinto',   initials: 'CP', email: 'cpinto@uta.edu.ec',   role: 'teacher' },
  { id: 't02', name: 'Ing. María Salinas', initials: 'MS', email: 'msalinas@uta.edu.ec', role: 'teacher' },
];

export const INITIAL_TASKS = [
  { id: 'tk01', title: 'Proyecto API REST',       desc: 'Implementar API RESTful con Node.js y Express. Incluir autenticación JWT.', subject: 'Ing. de Software', xp: 200, deadline: '2026-06-15' },
  { id: 'tk02', title: 'Normalización BD',         desc: 'Normalizar el esquema de base de datos hasta la Tercera Forma Normal (3FN).', subject: 'Base de Datos',    xp: 100, deadline: '2026-06-10' },
  { id: 'tk03', title: 'Algoritmos de Ordenación', desc: 'Implementar QuickSort y MergeSort. Análisis de complejidad O(n).',         subject: 'Programación OO',  xp: 80,  deadline: '2026-06-20' },
];

export const INITIAL_NOTIFICATIONS = [
  { id: 'n1', icon: '⚡', text: 'Ganaste 120 XP en "Patrones de Diseño"', time: 'hace 2 h', unread: true },
  { id: 'n2', icon: '🏅', text: 'Nueva insignia desbloqueada: "Precisión"', time: 'hace 5 h', unread: true },
  { id: 'n3', icon: '📈', text: 'Subiste al puesto #1 en Programación OO',  time: 'ayer',    unread: true },
  { id: 'n4', icon: '🔥', text: 'Racha de 12 días — ¡sigue así!',           time: 'ayer',    unread: false },
  { id: 'n5', icon: '🎯', text: 'Nuevo desafío: "Semana de Algoritmos"',    time: 'hace 2 d',unread: false },
];

export const COMPETENCIAS_DATA = [
  { area: 'Algoritmos',     value: 78 },
  { area: 'Bases de Datos', value: 65 },
  { area: 'POO',            value: 88 },
  { area: 'Redes',          value: 52 },
  { area: 'Matemáticas',    value: 70 },
  { area: 'Soft Skills',    value: 83 },
];
