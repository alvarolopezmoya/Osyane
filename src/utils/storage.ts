// Helpers de localStorage tolerantes a fallos.
import { useEffect, useRef, useState, type Dispatch, type SetStateAction } from 'react';

const PREFIX = 'osyane:';

export function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(PREFIX + key);
    if (raw == null) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function save<T>(key: string, value: T): boolean {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

export function remove(key: string): void {
  try { localStorage.removeItem(PREFIX + key); } catch { /* ignore */ }
}

export function clearAll(): void {
  try {
    Object.keys(localStorage)
      .filter((k) => k.startsWith(PREFIX))
      .forEach((k) => localStorage.removeItem(k));
  } catch { /* ignore */ }
}

// Hook: useState que sincroniza con localStorage.
export function usePersistedState<T>(
  key: string,
  initial: T | (() => T)
): [T, Dispatch<SetStateAction<T>>] {
  const [value, setValue] = useState<T>(() => {
    const sentinel = Symbol('unset');
    const stored = load<T | symbol>(key, sentinel as unknown as T);
    if (stored === (sentinel as unknown as T)) {
      return typeof initial === 'function' ? (initial as () => T)() : initial;
    }
    return stored as T;
  });

  const first = useRef(true);
  useEffect(() => {
    if (first.current) { first.current = false; return; }
    save(key, value);
  }, [key, value]);

  return [value, setValue];
}
