import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AuthCallback() {
  const navigate = useNavigate();
  useEffect(() => {
    const { hash, search } = window.location;
    if (hash?.includes('access_token') || search?.includes('code=')) {
      // let your auth layer pick tokens from URL; then go home
      navigate('/', { replace: true });
    } else {
      navigate('/', { replace: true });
    }
  }, [navigate]);
  return <div style={{ padding: 24 }}>Signing you in…</div>;
}
