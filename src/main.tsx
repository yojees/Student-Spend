// Guard: Ensure window.fetch has both getter and setter so environments or scripts
// assigning to window.fetch never trigger 'Cannot set property fetch of #<Window> which has only a getter'
if (typeof window !== 'undefined') {
  try {
    const rawFetch = window.fetch;
    let currentFetch = typeof rawFetch === 'function' ? rawFetch.bind(window) : rawFetch;
    Object.defineProperty(window, 'fetch', {
      configurable: true,
      enumerable: true,
      get: () => currentFetch,
      set: (fn: typeof fetch) => {
        currentFetch = fn;
      },
    });
  } catch {
    // ignore if already non-configurable
  }
}

import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
