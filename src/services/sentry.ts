// Sentry lazy — el SDK (~30 KB gzip) NO entra en el bundle inicial.
// Solo se descarga si VITE_SENTRY_DSN está definido. Sin DSN, captureException
// cae a console.error y nada más.

import type * as SentryNS from '@sentry/react';

type SentryAPI = typeof SentryNS;

const DSN = import.meta.env.VITE_SENTRY_DSN;

let _sentry: SentryAPI | null = null;
let _initPromise: Promise<void> | null = null;

export async function initSentry(): Promise<void> {
  if (!DSN) return;
  if (_initPromise) return _initPromise;

  _initPromise = (async () => {
    const Sentry = await import('@sentry/react');
    _sentry = Sentry;
    Sentry.init({
      dsn: DSN,
      environment: import.meta.env.MODE,
      release: `osyane@${import.meta.env.VITE_APP_VERSION || '2.0.0'}`,
      tracesSampleRate: import.meta.env.PROD ? 0.1 : 1.0,
      replaysSessionSampleRate: 0.0,
      replaysOnErrorSampleRate: 1.0,
      integrations: [
        Sentry.browserTracingIntegration(),
        Sentry.replayIntegration({ maskAllText: false, blockAllMedia: false }),
      ],
      ignoreErrors: [
        'ResizeObserver loop limit exceeded',
        'Non-Error promise rejection captured',
      ],
    });
  })();

  return _initPromise;
}

export function captureException(err: unknown, context?: Record<string, unknown>): void {
  if (!_sentry) {
    // eslint-disable-next-line no-console
    console.error('[Osyane error]', err, context);
    return;
  }
  _sentry.captureException(err, { extra: context });
}

export interface SentryUser {
  id?: string;
  email?: string;
  role?: string;
}

export function setUser(user: SentryUser | null): void {
  _sentry?.setUser(user);
}
