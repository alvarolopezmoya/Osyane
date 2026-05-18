// Sentry — error reporting opt-in.
// Sin VITE_SENTRY_DSN, las llamadas a captureException son no-ops.

import * as Sentry from '@sentry/react';

const DSN = import.meta.env.VITE_SENTRY_DSN;

export function initSentry(): void {
  if (!DSN) return;
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
}

export function captureException(err: unknown, context?: Record<string, unknown>): void {
  if (!DSN) {
    // eslint-disable-next-line no-console
    console.error('[Osyane error]', err, context);
    return;
  }
  Sentry.captureException(err, { extra: context });
}

export interface SentryUser {
  id?: string;
  email?: string;
  role?: string;
}

export function setUser(user: SentryUser | null): void {
  if (!DSN) return;
  Sentry.setUser(user);
}

export const SentryErrorBoundary = Sentry.ErrorBoundary;
