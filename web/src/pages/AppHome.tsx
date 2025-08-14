import { createClient } from "@supabase/supabase-js";
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "../env";
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
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
