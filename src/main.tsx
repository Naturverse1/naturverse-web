import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import ErrorBoundary from './components/ErrorBoundary';
import { AuthProvider } from './auth/AuthContext';
import './styles.css';
import './styles/shop.css';
import './styles/edu.css';
import './main.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </AuthProvider>
  </React.StrictMode>,
);
