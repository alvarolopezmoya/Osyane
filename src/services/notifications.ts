// EventEmitter local. Para WebSocket/SSE real ver TODO[REALTIME] abajo.
//
// TODO[REALTIME] Notificaciones reales por WebSocket o Server-Sent Events:
//   - Si usas Supabase, usa subscribeToTable('notifications', cb) — viene gratis.
//   - Si tienes backend propio, ver options A (WS) o B (SSE) en notes.

import type { AppEvent } from '../types.js';

type Listener = (event: AppEvent) => void;
const listeners = new Set<Listener>();

export function subscribe(fn: Listener): () => void {
  listeners.add(fn);
  return () => { listeners.delete(fn); };
}

export function emit(event: AppEvent): void {
  listeners.forEach((fn) => {
    try { fn(event); } catch { /* swallow listener errors */ }
  });
}

let _id = Date.now();
export function makeNotification(text: string, icon: string = '📣') {
  return { id: `n${++_id}`, icon, text, time: 'ahora', unread: true };
}
