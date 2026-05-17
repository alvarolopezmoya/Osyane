// Helpers de localStorage tolerantes a fallos (SSR / privacidad / quota).

const PREFIX = 'osyane:';

export function load(key, fallback) {
  try {
    const raw = localStorage.getItem(PREFIX + key);
    if (raw == null) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

export function save(key, value) {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

export function remove(key) {
  try { localStorage.removeItem(PREFIX + key); } catch {}
}

export function clearAll() {
  try {
    Object.keys(localStorage)
      .filter((k) => k.startsWith(PREFIX))
      .forEach((k) => localStorage.removeItem(k));
  } catch {}
}

// Hook: useState que sincroniza con localStorage.
import { useEffect, useRef, useState } from 'react';
export function usePersistedState(key, initial) {
  const [value, setValue] = useState(() => {
    const stored = load(key, undefined);
    return stored === undefined
      ? (typeof initial === 'function' ? initial() : initial)
      : stored;
  });
  const first = useRef(true);
  useEffect(() => {
    if (first.current) { first.current = false; return; }
    save(key, value);
  }, [key, value]);
  return [value, setValue];
}
