// Niveles y cálculo de nivel a partir de XP. Función pura — testeable con Vitest.

export const LEVELS = [
  { n: 1,  title: 'Aprendiz',     min: 0,     max: 500   },
  { n: 2,  title: 'Explorador',   min: 500,   max: 1200  },
  { n: 3,  title: 'Analista',     min: 1200,  max: 2200  },
  { n: 4,  title: 'Desarrollador',min: 2200,  max: 3500  },
  { n: 5,  title: 'Arquitecto',   min: 3500,  max: 5200  },
  { n: 6,  title: 'Ingeniero',    min: 5200,  max: 7200  },
  { n: 7,  title: 'Especialista', min: 7200,  max: 9800  },
  { n: 8,  title: 'Experto',      min: 9800,  max: 13000 },
  { n: 9,  title: 'Maestro',      min: 13000, max: 17000 },
  { n: 10, title: 'Leyenda',      min: 17000, max: Infinity },
];

export function getLevelInfo(xp) {
  const safe = Number.isFinite(xp) && xp >= 0 ? xp : 0;
  const lvl = LEVELS.find((l) => safe >= l.min && safe < l.max) || LEVELS[LEVELS.length - 1];
  const progress = lvl.max === Infinity ? 1 : (safe - lvl.min) / (lvl.max - lvl.min);
  return { ...lvl, xp: safe, progress: Math.min(Math.max(progress, 0), 1) };
}
