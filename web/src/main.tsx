import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

const hasEnv =
  !!import.meta.env.VITE_SUPABASE_URL &&
  !!import.meta.env.VITE_SUPABASE_ANON_KEY;

function MissingEnv() {
  return (
    <div style={{ padding: 24 }}>
      <h1>App temporarily unavailable</h1>
      <p>
        Required environment variables <code>VITE_SUPABASE_URL</code> and
        <code> VITE_SUPABASE_ANON_KEY</code> are not set for this deploy.
      </p>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>{hasEnv ? <App /> : <MissingEnv />}</React.StrictMode>
);
