import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase-client';

export default function AuthCallback() {
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        // Get the current URL with hash and search params
        const currentUrl = window.location.href;
        const urlObj = new URL(currentUrl);
        
        // Handle implicit flow (hash fragments like #access_token=...)
        if (urlObj.hash) {
          const hashParams = new URLSearchParams(urlObj.hash.substring(1));
          const accessToken = hashParams.get('access_token');
          const refreshToken = hashParams.get('refresh_token');
          
          if (accessToken && refreshToken) {
            const { error } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken,
            });
            
            if (error) {
              console.error('Auth session error:', error);
              setErrorMessage(error.message);
              setStatus('error');
              return;
            }
          }
        }
        
        // Handle PKCE flow (query parameters like ?code=...)
        else if (urlObj.searchParams.get('code')) {
          const { error } = await supabase.auth.exchangeCodeForSession(currentUrl);
          
          if (error) {
            console.error('Auth code exchange error:', error);
            setErrorMessage(error.message);
            setStatus('error');
            return;
          }
        }
        
        // Authentication successful
        setStatus('success');
        
        // Get stored redirect path, default to home
        const redirectPath = sessionStorage.getItem('postAuthRedirect') || '/';
        sessionStorage.removeItem('postAuthRedirect');
        
        // Redirect after a brief delay to show success state
        setTimeout(() => {
          navigate(redirectPath, { replace: true });
        }, 1000);
        
      } catch (error) {
        console.error('Auth callback error:', error);
        setErrorMessage(error instanceof Error ? error.message : 'Authentication failed');
        setStatus('error');
      }
    })();
  }, [navigate]);

  if (status === 'loading') {
    return (
      <div style={{ 
        padding: 24, 
        textAlign: 'center',
        minHeight: '50vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <div style={{ fontSize: '1.2em', marginBottom: 16 }}>🔐 Signing you in…</div>
        <div style={{ fontSize: '0.9em', color: '#666' }}>Please wait while we process your authentication</div>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div style={{ 
        padding: 24, 
        textAlign: 'center',
        minHeight: '50vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <div style={{ fontSize: '1.2em', marginBottom: 16 }}>✅ Success!</div>
        <div style={{ fontSize: '0.9em', color: '#666' }}>Redirecting you to the app...</div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div style={{ 
        padding: 24, 
        textAlign: 'center',
        minHeight: '50vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <div style={{ fontSize: '1.2em', marginBottom: 16, color: '#e53e3e' }}>❌ Authentication Failed</div>
        <div style={{ fontSize: '0.9em', color: '#666', marginBottom: 24 }}>
          {errorMessage || 'Something went wrong during sign-in'}
        </div>
        <button 
          onClick={() => navigate('/login', { replace: true })}
          style={{
            padding: '12px 24px',
            backgroundColor: '#2455FF',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '0.9em'
          }}
        >
          Try Again
        </button>
      </div>
    );
  }

  return null;
}
