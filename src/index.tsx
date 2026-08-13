import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/fonts.css';
import './styles/global.css';
import { LanguageProvider } from './i18n';
import App from './App';
import CertificatePage from './CertificatePage';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
const isCertificatePath = window.location.pathname === '/c' || window.location.pathname === '/c/';
root.render(
  <React.StrictMode>
    <LanguageProvider>
      {isCertificatePath ? <CertificatePage /> : <App />}
    </LanguageProvider>
  </React.StrictMode>
);
