import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { AppProvider } from './store.jsx';
import { I18nProvider } from './i18n/index.jsx';
import App from './App.jsx';
import './styles.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <I18nProvider>
      <AppProvider>
        <App />
      </AppProvider>
    </I18nProvider>
  </StrictMode>
);
