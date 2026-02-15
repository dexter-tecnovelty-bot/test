import React from 'react';
import ReactDOM from 'react-dom/client';
import { Analytics } from '@vercel/analytics/react';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { initializeMonitoring } from './services/monitoring';
import './styles/global.css';

initializeMonitoring();

const rootElement = document.getElementById('root');
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <BrowserRouter>
        <App />
        <Analytics />
      </BrowserRouter>
    </React.StrictMode>
  );
}
