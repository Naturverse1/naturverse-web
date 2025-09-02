import { useEffect, useState } from "react";
import NavatarHub from "./NavatarHub";
import { supabase } from "../../lib/supabase";

export default function NavatarPage() {
  const [user, setUser] = useState<{ id: string } | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
  }, []);

  if (!user) return null;
  return <NavatarHub user={user} />;
}
