import React from 'react';
import ReactDOM from 'react-dom/client';

import App from './App';

try {
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
  console.log('[boot] rendered');
} catch (err) {
  console.error('[boot] render failed', err); // show full stack
  document.body.innerHTML = "<pre style='color:red'>" + err + '</pre>';
}
