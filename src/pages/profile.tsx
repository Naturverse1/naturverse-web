import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { getCurrentUserAndProfile, NaturProfile } from '../lib/getProfile';
import RequireAuth from '../components/RequireAuth';

type ViewState =
  | { kind: 'loading' }
  | { kind: 'signedOut' }
  | { kind: 'ready'; user: { id: string; email?: string | null }; profile: NaturProfile | null }
  | { kind: 'error'; message: string };

export default function ProfilePage() {
  const [state, setState] = useState<ViewState>({ kind: 'loading' });

  useEffect(() => {
    let active = true;

    (async () => {
      const { user, profile, error } = await getCurrentUserAndProfile();
      if (!active) return;

      if (error) {
        setState({ kind: 'error', message: error.message ?? 'Failed to load profile' });
        return;
      }
      if (!user) {
        setState({ kind: 'signedOut' });
        return;
      }
      setState({
        kind: 'ready',
        user: { id: user.id, email: user.email },
        profile,
      });
    })();

    // keep state fresh when auth changes (sign-in/out)
    const { data: sub } = supabase.auth.onAuthStateChange(async () => {
      setState({ kind: 'loading' });
      const { user, profile, error } = await getCurrentUserAndProfile();
      if (!active) return;
      if (error) setState({ kind: 'error', message: error.message ?? 'Failed to load profile' });
      else if (!user) setState({ kind: 'signedOut' });
      else setState({ kind: 'ready', user: { id: user.id, email: user.email }, profile });
    });

    return () => {
      active = false;
      sub?.subscription?.unsubscribe();
    };
  }, []);

  let content: JSX.Element;
  if (state.kind === 'loading') {
    content = (
      <section>
        <h1>Profile</h1>
        <div style={s.card}>
          <div style={s.row}>
            <div style={s.skelAvatar} />
            <div style={{ flex: 1, marginLeft: 12 }}>
              <div style={s.skelLine} />
              <div style={{ ...s.skelLine, width: '60%', marginTop: 8 }} />
            </div>
          </div>
        </div>
      </section>
    );
  } else if (state.kind === 'signedOut') {
    content = (
      <section>
        <h1>Profile</h1>
        <p>You’re not signed in.</p>
        <a className="btn" href="/login">Sign in with Google</a>
      </section>
    );
  } else if (state.kind === 'error') {
    content = (
      <section>
        <h1>Profile</h1>
        <p role="alert">Oops — {state.message}</p>
      </section>
    );
  } else {
    const { user, profile } = state;
    content = (
      <section>
        <h1>Profile</h1>
        <div style={s.card}>
          <div style={s.row}>
            <img
              src={profile?.avatar_url || '/favicon.svg'}
              alt="Avatar"
              width={64}
              height={64}
              style={{ borderRadius: 12, background: '#eef3ff' }}
              loading="lazy"
              decoding="async"
            />
            <div style={{ marginLeft: 12 }}>
              <div style={{ fontWeight: 700, fontSize: 18 }}>
                {profile?.display_name || 'Explorer'}
              </div>
              <div style={{ opacity: 0.8 }}>{user.email || 'No email on file'}</div>
              {profile?.updated_at && (
                <div style={{ opacity: 0.6, fontSize: 12, marginTop: 4 }}>
                  Updated: {new Date(profile.updated_at).toLocaleString()}
                </div>
              )}
            </div>
          </div>

          <div style={{ marginTop: 16 }}>
            <a className="btn" href="/navatar">Create / Update Navatar</a>{' '}
            <a className="btn" href="/passport">View Passport</a>
          </div>
        </div>
      </section>
    );
  }

  return <RequireAuth>{content}</RequireAuth>;
}

const s: Record<string, React.CSSProperties> = {
  card: {
    border: '1px solid var(--border, #dbe2f0)',
    borderRadius: 12,
    padding: 16,
    background: 'var(--card, #fff)',
    maxWidth: 680,
  },
  row: { display: 'flex', alignItems: 'center' },
  skelAvatar: {
    width: 64,
    height: 64,
    borderRadius: 12,
    background: 'linear-gradient(90deg,#e9edf5,#f4f7fb,#e9edf5)',
    backgroundSize: '200% 100%',
    animation: 'shimmer 1.2s linear infinite',
  },
  skelLine: {
    height: 12,
    width: '80%',
    background: 'linear-gradient(90deg,#e9edf5,#f4f7fb,#e9edf5)',
    backgroundSize: '200% 100%',
    borderRadius: 6,
    animation: 'shimmer 1.2s linear infinite',
  },
};
