// Sentry — error reporting opt-in.
// Para activar: define VITE_SENTRY_DSN en un archivo .env (o en GitHub Secrets para CI).
// Sin DSN, las llamadas a captureException son no-ops y no se envía nada.

import * as Sentry from '@sentry/react';

const DSN = import.meta.env.VITE_SENTRY_DSN;

export function initSentry() {
  if (!DSN) return; // No-op si no hay DSN configurado.
  Sentry.init({
    dsn: DSN,
    environment: import.meta.env.MODE,
    release: `osyane@${import.meta.env.VITE_APP_VERSION || '2.0.0'}`,
    // Performance + replay opcionales — se activan solo si hay DSN.
    tracesSampleRate: import.meta.env.PROD ? 0.1 : 1.0,
    replaysSessionSampleRate: 0.0,
    replaysOnErrorSampleRate: 1.0,
    integrations: [
      Sentry.browserTracingIntegration(),
      Sentry.replayIntegration({ maskAllText: false, blockAllMedia: false }),
    ],
    // No reportar errores conocidos / ruido de extensiones.
    ignoreErrors: [
      'ResizeObserver loop limit exceeded',
      'Non-Error promise rejection captured',
    ],
  });
}

export function captureException(err, context) {
  if (!DSN) {
    // Mantén visibilidad en desarrollo aunque no haya Sentry configurado.
    // eslint-disable-next-line no-console
    console.error('[Osyane error]', err, context);
    return;
  }
  Sentry.captureException(err, { extra: context });
}

export function setUser(user) {
  if (!DSN) return;
  Sentry.setUser(user ? { id: user.id, email: user.email, role: user.role } : null);
}

export const SentryErrorBoundary = Sentry.ErrorBoundary;
