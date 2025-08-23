import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

type Stamp = {
  id: string;
  region: string;
  stamp_name: string;
  earned_at: string;
};

export default function PassportPage() {
  const [userId, setUserId] = useState<string | null>(null);
  const [stamps, setStamps] = useState<Stamp[]>([]);
  const [xp, setXp] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      const session = sessionData.session;
      if (!session) {
        setLoading(false);
        return;
      }
      const uid = session.user.id;
      setUserId(uid);

      // load stamps
      const { data: stampData } = await supabase
        .from("stamps")
        .select("*")
        .eq("user_id", uid)
        .order("earned_at", { ascending: false });
      setStamps(stampData || []);

      // load XP
      const { data: xpData } = await supabase
        .from("xp_ledger")
        .select("amount")
        .eq("user_id", uid);

      const total = (xpData || []).reduce((acc, row: any) => acc + (row.amount ?? 0), 0);
      setXp(total);

      setLoading(false);
    })();
  }, []);

  async function earnStamp() {
    if (!userId) return;
    const region = "Thailandia";
    const stamp_name = "Temple Visit";

    // insert stamp
    const { error: sErr } = await supabase
      .from("stamps")
      .insert({ user_id: userId, region, stamp_name });
    if (sErr) return alert(sErr.message);

    // add xp
    const { error: xErr } = await supabase
      .from("xp_ledger")
      .insert({ user_id: userId, amount: 10 });
    if (xErr) return alert(xErr.message);

    alert("Stamp earned +10 XP!");
    location.reload();
  }

  if (loading) return <main><h1>Passport</h1><p>Loading…</p></main>;

  if (!userId) return (
    <main>
      <h1>Passport</h1>
      <p>Please sign in to view your passport.</p>
    </main>
  );

  return (
    <main className="passport-page">
      <h1>Passport</h1>
      <p>Total XP: <strong>{xp}</strong></p>
      <button className="btn" onClick={earnStamp}>Earn Sample Stamp</button>

      <div className="stamps">
        {stamps.length === 0 ? (
          <p>No stamps yet — start exploring!</p>
        ) : (
          stamps.map((s) => (
            <div key={s.id} className="stamp">
              <h3>{s.stamp_name}</h3>
              <p>{s.region}</p>
              <span>{new Date(s.earned_at).toLocaleString()}</span>
            </div>
          ))
        )}
      </div>
    </main>
  );
}
