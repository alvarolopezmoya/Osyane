// SVG icon library.

export function Icon({ d, size = 16, stroke = 'currentColor', fill = 'none', strokeWidth = 1.75, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={stroke}
      strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}>
      {typeof d === 'string' ? <path d={d} /> : d}
    </svg>
  );
}

export const IcoDashboard = ({ size, className }) => (
  <Icon size={size} className={className} d={
    <><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></>
  } />
);
export const IcoRanking  = ({ size, className }) => <Icon size={size} className={className} d="M8 18V10m4 8V6m4 12v-4"/>;
export const IcoBadge    = ({ size, className }) => <Icon size={size} className={className} d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z"/>;
export const IcoProgress = ({ size, className }) => <Icon size={size} className={className} d="M3 12h4l3-7 4 14 3-7h4"/>;
export const IcoTeacher  = ({ size, className }) => <Icon size={size} className={className} d="M12 14c-4 0-7 2-7 4v1h14v-1c0-2-3-4-7-4zm0-2a4 4 0 100-8 4 4 0 000 8zm7-3l2 2-5 5-3-3 2-2 1 1z"/>;
export const IcoBell     = ({ size, className }) => <Icon size={size} className={className} d="M15 17h5l-1.4-1.4A2 2 0 0118 14V9a6 6 0 10-12 0v5a2 2 0 01-.6 1.4L4 17h5m3 0v1a3 3 0 01-6 0v-1m6 0H9"/>;
export const IcoEye      = ({ size, className }) => <Icon size={size} className={className} d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8zm11 3a3 3 0 100-6 3 3 0 000 6z"/>;
export const IcoChevron  = ({ size = 14, dir = 'right', className }) => {
  const paths = { right: 'M9 18l6-6-6-6', left: 'M15 18l-6-6 6-6', down: 'M6 9l6 6 6-6', up: 'M18 15l-6-6-6 6' };
  return <Icon size={size} className={className} d={paths[dir]} />;
};
export const IcoSearch   = ({ size, className }) => <Icon size={size} className={className} d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z"/>;
export const IcoPlus     = ({ size, className }) => <Icon size={size} className={className} d="M12 5v14M5 12h14"/>;
export const IcoCheck    = ({ size, className }) => <Icon size={size} className={className} d="M20 6L9 17l-5-5"/>;
export const IcoStar     = ({ size, className }) => <Icon size={size} className={className} fill="currentColor" stroke="none" d="M12 2l3.1 6.3 6.9 1-5 4.9 1.2 6.9L12 17.8l-6.2 3.3 1.2-6.9L2 9.3l6.9-1z"/>;
export const IcoTrophy   = ({ size, className }) => <Icon size={size} className={className} d="M6 9H3V4h3m12 5h3V4h-3M6 9a6 6 0 0012 0M6 9H4m14 0h2M12 15v3m-4 3h8"/>;
export const IcoFlame    = ({ size, className }) => <Icon size={size} className={className} d="M12 2c0 0-5 5-5 10a5 5 0 0010 0C17 7 12 2 12 2z"/>;
export const IcoArrowUp  = ({ size, className }) => <Icon size={size} className={className} d="M12 19V5m-7 7l7-7 7 7"/>;
export const IcoArrowDown= ({ size, className }) => <Icon size={size} className={className} d="M12 5v14m7-7l-7 7-7-7"/>;
export const IcoXp       = ({ size, className }) => <Icon size={size} className={className} d="M13 2L3 14h9l-1 8 10-12h-9z"/>;
export const IcoAward    = ({ size, className }) => <Icon size={size} className={className} d="M12 15a6 6 0 100-12 6 6 0 000 12zm0 0v7m-3-3h6"/>;
export const IcoClose    = ({ size, className }) => <Icon size={size} className={className} d="M18 6L6 18M6 6l12 12"/>;
export const IcoGift     = ({ size, className }) => <Icon size={size} className={className} d="M20 12v10H4V12M22 7H2v5h20V7zM12 22V7m0-5a2.5 2.5 0 00-5 0c0 2.76 5 5 5 5s5-2.24 5-5a2.5 2.5 0 00-5 0z"/>;
export const IcoMenu     = ({ size, className }) => <Icon size={size} className={className} d="M3 12h18M3 6h18M3 18h18"/>;
export const IcoSun      = ({ size, className }) => (
  <Icon size={size} className={className} d={
    <><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32l1.41 1.41M2 12h2m16 0h2M4.93 19.07l1.41-1.41m11.32-11.32l1.41-1.41"/></>
  } />
);
export const IcoMoon     = ({ size, className }) => <Icon size={size} className={className} d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" fill="currentColor" />;
export const IcoTasks    = ({ size, className }) => (
  <Icon size={size} className={className} d={
    <><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></>
  } />
);
export const IcoUpload   = ({ size, className }) => <Icon size={size} className={className} d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12"/>;
export const IcoGlobe    = ({ size, className }) => (
  <Icon size={size} className={className} d={
    <><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15 15 0 010 20M12 2a15 15 0 000 20"/></>
  } />
);
