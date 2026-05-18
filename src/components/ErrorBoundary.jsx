import { Component } from 'react';
import { DS } from './ds.js';
import { Btn } from './UI.jsx';
import { captureException } from '../services/sentry.js';

export class ErrorBoundary extends Component {
  state = { error: null };

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    captureException(error, { componentStack: info.componentStack });
  }

  reset = () => {
    this.setState({ error: null });
    // Limpiar también el estado que pueda haber causado el crash.
    try {
      const keys = Object.keys(localStorage).filter((k) => k.startsWith('osyane:'));
      // Solo si el usuario explícitamente lo pide. Aquí solo reset visual.
      void keys;
    } catch {}
  };

  hardReset = () => {
    try {
      Object.keys(localStorage)
        .filter((k) => k.startsWith('osyane:'))
        .forEach((k) => localStorage.removeItem(k));
    } catch {}
    window.location.reload();
  };

  render() {
    if (!this.state.error) return this.props.children;
    return (
      <div role="alert" aria-live="assertive" style={{
        position: 'fixed', inset: 0, background: DS.bg,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 20, zIndex: 9999,
      }}>
        <div style={{
          maxWidth: 480, background: DS.card, border: `1px solid ${DS.bdMd}`,
          borderRadius: 18, padding: '32px 32px 28px',
          boxShadow: '0 24px 72px rgba(0,0,0,0.55)',
        }}>
          <div style={{
            width: 56, height: 56, borderRadius: 14, marginBottom: 16,
            background: 'rgba(244,63,94,0.15)', border: '1px solid rgba(244,63,94,0.35)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 28,
          }}>⚠️</div>
          <h2 className="head" style={{ margin: '0 0 6px', fontSize: 18, fontWeight: 800, color: DS.t1 }}>
            Algo salió mal
          </h2>
          <p style={{ margin: '0 0 20px', fontSize: 13, color: DS.t2, lineHeight: 1.5 }}>
            Osyane encontró un error inesperado. El equipo ya fue notificado. Puedes intentar recargar o, si el problema persiste, restablecer tus datos locales.
          </p>
          {import.meta.env.DEV && (
            <pre style={{
              background: DS.card2, border: `1px solid ${DS.bd}`,
              borderRadius: 8, padding: 10, fontSize: 11, color: DS.red,
              fontFamily: "'JetBrains Mono', monospace",
              overflow: 'auto', maxHeight: 140, marginBottom: 20,
            }}>{String(this.state.error?.message || this.state.error)}</pre>
          )}
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <Btn variant="primary" onClick={() => window.location.reload()}>Recargar</Btn>
            <Btn variant="ghost" onClick={this.hardReset}>Restablecer datos locales</Btn>
          </div>
        </div>
      </div>
    );
  }
}
