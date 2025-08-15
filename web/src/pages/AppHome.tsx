import { supabase } from '@/supabaseClient';
export default function AppHome() {
  return (
    <main style={{padding:"2rem"}}>
      <h1>Naturverse App</h1>
      <p>Protected content. You’re signed in.</p>
      <button onClick={async () => { await supabase.auth.signOut(); location.href = "/"; }}>
        Sign out
      </button>
    </main>
  );
}
