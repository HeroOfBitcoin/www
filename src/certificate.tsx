import React from 'react';
import ReactDOM from 'react-dom/client';

import CertificatePage from './CertificatePage';
import { LanguageProvider } from './i18n';
import './styles/fonts.css';
import './styles/global.css';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <LanguageProvider>
      <CertificatePage />
    </LanguageProvider>
  </React.StrictMode>
);
