// ────────────────────────────────────────────────────────────────────────────
// Notifications transport — stub local (event emitter).
//
// TODO[REALTIME] Notificaciones reales por WebSocket o Server-Sent Events:
//
//   OPCIÓN A — WebSocket (bidireccional, mejor para chat/colab):
//     // backend (Node + ws):
//     //   wss.on('connection', (ws) => { clients.add(ws); ws.on('close', () => clients.delete(ws)); });
//     //   function broadcast(msg) { clients.forEach(c => c.send(JSON.stringify(msg))); }
//     // frontend:
//     const ws = new WebSocket(import.meta.env.VITE_WS_URL);
//     ws.onmessage = (ev) => emit(JSON.parse(ev.data));
//
//   OPCIÓN B — SSE (más simple, sólo servidor → cliente, suficiente para notifs):
//     // backend Express:
//     //   app.get('/events', (req, res) => {
//     //     res.set({ 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache', 'Connection': 'keep-alive' });
//     //     subscribers.add(res); req.on('close', () => subscribers.delete(res));
//     //   });
//     //   function broadcast(data) { subscribers.forEach(r => r.write(`data: ${JSON.stringify(data)}\n\n`)); }
//     // frontend:
//     const es = new EventSource(import.meta.env.VITE_SSE_URL);
//     es.onmessage = (ev) => emit(JSON.parse(ev.data));
//
//   OPCIÓN C — Si usas Firebase:
//     // onSnapshot(collection('notifications')) → realtime sin servidor propio.
//
//   Eventos que disparar desde backend:
//     • `xp.awarded`    → cuando docente otorga XP
//     • `badge.earned`  → cuando se obtiene insignia
//     • `task.assigned` → cuando docente crea tarea
//     • `task.approved` → cuando se aprueba entrega
//     • `rank.changed`  → al recalcular ranking
// ────────────────────────────────────────────────────────────────────────────

const listeners = new Set();

export function subscribe(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function emit(event) {
  listeners.forEach((fn) => {
    try { fn(event); } catch { /* swallow listener errors */ }
  });
}

// Helper para crear notificaciones desde el front (stub).
let _id = Date.now();
export function makeNotification(text, icon = '📣') {
  return { id: `n${++_id}`, icon, text, time: 'ahora', unread: true };
}
