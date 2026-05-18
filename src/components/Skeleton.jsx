import { DS } from './ds.js';

// Skeleton primitivo — rectángulo con shimmer.
// Respeta prefers-reduced-motion: si está activo, queda estático.
export function Skeleton({ width = '100%', height = 16, radius = 8, style }) {
  return (
    <div
      aria-hidden="true"
      style={{
        width, height, borderRadius: radius,
        background: `linear-gradient(90deg, ${DS.card2} 0%, rgba(255,255,255,0.06) 50%, ${DS.card2} 100%)`,
        backgroundSize: '200% 100%',
        animation: 'skeletonShimmer 1.4s ease-in-out infinite',
        ...style,
      }}
    />
  );
}

// Card-shape skeleton (para cards de tareas, stats, etc.)
export function SkeletonCard({ height = 120 }) {
  return (
    <div style={{
      background: DS.card, border: `1px solid ${DS.bd}`,
      borderRadius: 16, padding: 18,
      display: 'flex', flexDirection: 'column', gap: 10,
      height,
    }}>
      <Skeleton width="40%" height={12} />
      <Skeleton width="70%" height={22} />
      <Skeleton width="55%" height={11} />
    </div>
  );
}

// Skeleton para una fila de tabla (ranking, estudiantes, etc.)
export function SkeletonRow() {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 12,
      padding: '10px 18px', borderBottom: `1px solid ${DS.bd}`,
    }}>
      <Skeleton width={28} height={28} radius="50%" />
      <Skeleton width={32} height={32} radius="50%" />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
        <Skeleton width="40%" height={12} />
        <Skeleton width="25%" height={10} />
      </div>
      <Skeleton width={60} height={12} />
    </div>
  );
}

// Skeleton para el fallback de React.lazy
export function ViewSkeleton() {
  return (
    <div style={{ padding: 'clamp(14px,3vw,28px)', maxWidth: 1200, margin: '0 auto' }}>
      <Skeleton width="40%" height={26} style={{ marginBottom: 8 }} />
      <Skeleton width="60%" height={13} style={{ marginBottom: 22 }} />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))', gap: 14, marginBottom: 22 }}>
        {[0,1,2,3].map((i) => <SkeletonCard key={i} height={100} />)}
      </div>
      <SkeletonCard height={280} />
    </div>
  );
}
