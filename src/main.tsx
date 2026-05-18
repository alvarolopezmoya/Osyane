import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { AppProvider } from './store.jsx';
import { I18nProvider } from './i18n/index.jsx';
import { ErrorBoundary } from './components/ErrorBoundary.jsx';
import { QueryProvider } from './services/query.js';
import { initSentry } from './services/sentry.js';
import App from './App.jsx';
import './styles.css';

initSentry();

const root = document.getElementById('root');
if (!root) throw new Error('Root element #root not found');

createRoot(root).render(
  <StrictMode>
    <ErrorBoundary>
      <QueryProvider>
        <I18nProvider>
          <AppProvider>
            <App />
          </AppProvider>
        </I18nProvider>
      </QueryProvider>
    </ErrorBoundary>
  </StrictMode>
);
