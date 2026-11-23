import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import App from './App';
import './index.css';

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Failed to find the root element');

const app = (
  <StrictMode>
    <App />
  </StrictMode>
);

// Production HTML is pre-rendered at build time (see scripts/prerender.mjs), so hydrate it.
if (rootElement.hasChildNodes()) hydrateRoot(rootElement, app);
else createRoot(rootElement).render(app);
