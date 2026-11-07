import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import '@fontsource-variable/inter';
import './styles.css';
import App from './App';

const container = document.getElementById('root')!;
const app = (
  <StrictMode>
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <App />
    </BrowserRouter>
  </StrictMode>
);

// Production pages are pre-rendered to HTML at build time: hydrate them.
// In development the root is empty, so render from scratch.
if (container.hasChildNodes()) hydrateRoot(container, app);
else createRoot(container).render(app);
