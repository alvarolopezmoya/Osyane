// TanStack Query — provider y configuración global.
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { captureException } from './sentry.js';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,        // 30s antes de considerar los datos viejos
      gcTime: 5 * 60_000,       // 5 min en cache antes de garbage-collect
      refetchOnWindowFocus: true,
      retry: (failureCount, error) => {
        // No reintentar errores 4xx (auth, permisos, validación).
        const status = error?.status || error?.code;
        if (typeof status === 'number' && status >= 400 && status < 500) return false;
        return failureCount < 2;
      },
    },
    mutations: {
      onError: (err) => captureException(err, { layer: 'mutation' }),
    },
  },
});

export function QueryProvider({ children }) {
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
