// Confetti — canvas-confetti con respeto a prefers-reduced-motion.
import confetti from 'canvas-confetti';

function prefersReducedMotion(): boolean {
  try {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  } catch {
    return false;
  }
}

const GOLD = ['#f5a623', '#ffcc5c', '#fef3c7', '#fff'];
const BLUE = ['#4f8ef7', '#7db3ff', '#1d4ed8', '#fff'];
const RAINBOW = ['#f5a623', '#4f8ef7', '#0fd9a0', '#a78bfa', '#f43f5e', '#22d3ee'];

export function burstGold(): void {
  if (prefersReducedMotion()) return;
  confetti({
    particleCount: 60,
    spread: 70,
    startVelocity: 32,
    origin: { y: 0.7 },
    colors: GOLD,
    scalar: 0.9,
    ticks: 160,
  });
}

export function burstBlue(): void {
  if (prefersReducedMotion()) return;
  confetti({
    particleCount: 80,
    spread: 90,
    startVelocity: 40,
    origin: { y: 0.65 },
    colors: BLUE,
    scalar: 1.0,
    ticks: 200,
  });
}

export function burstRare(): void {
  if (prefersReducedMotion()) return;
  const duration = 1500;
  const end = Date.now() + duration;
  (function frame() {
    confetti({ particleCount: 4, angle: 60,  spread: 55, origin: { x: 0 }, colors: RAINBOW });
    confetti({ particleCount: 4, angle: 120, spread: 55, origin: { x: 1 }, colors: RAINBOW });
    if (Date.now() < end) requestAnimationFrame(frame);
  })();
}
