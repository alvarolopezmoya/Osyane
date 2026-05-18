import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { AppProvider } from './store.jsx';
import { I18nProvider } from './i18n/index.jsx';
import { ErrorBoundary } from './components/ErrorBoundary.jsx';
import { initSentry } from './services/sentry.js';
import App from './App.jsx';
import './styles.css';

initSentry();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <I18nProvider>
        <AppProvider>
          <App />
        </AppProvider>
      </I18nProvider>
    </ErrorBoundary>
  </StrictMode>
);
