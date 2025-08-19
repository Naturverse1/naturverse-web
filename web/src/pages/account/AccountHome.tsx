import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";

export default function AccountHome() {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUserEmail(data.user?.email ?? null));
  }, []);
  return (
    <section>
      <h2>👤 Account</h2>
      {userEmail ? <p>Signed in as {userEmail}</p> : <p>Not signed in.</p>}
    </section>
  );
}
