import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

type Tx = {
  id: string;
  amount: number;
  created_at: string;
};

export default function NaturbankPage() {
  const [userId, setUserId] = useState<string | null>(null);
  const [balance, setBalance] = useState<number>(0);
  const [txs, setTxs] = useState<Tx[]>([]);
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

      const { data } = await supabase
        .from("xp_ledger")
        .select("id, amount, created_at")
        .eq("user_id", uid)
        .order("created_at", { ascending: false });

      const rows = (data as Tx[]) || [];
      const total = rows.reduce((acc, r) => acc + (r.amount ?? 0), 0);
      setBalance(total);
      setTxs(rows);
      setLoading(false);
    })();
  }, []);

  async function addFunds() {
    if (!userId) return;
    const { error } = await supabase
      .from("xp_ledger")
      .insert({ user_id: userId, amount: 50 });
    if (error) return alert(error.message);
    alert("Added +50 NATUR!");
    location.reload();
  }

  if (loading) return <main><h1>Naturbank</h1><p>Loading…</p></main>;

  if (!userId) return (
    <main>
      <h1>Naturbank</h1>
      <p>Please sign in to view your wallet.</p>
    </main>
  );

  return (
    <main className="naturbank-page">
      <h1>Naturbank</h1>
      <p>Balance: <strong>{balance} NATUR</strong></p>
      <button className="btn" onClick={addFunds}>Add Funds (demo)</button>

      <div className="txs">
        <h2>Transactions</h2>
        {txs.length === 0 ? (
          <p>No transactions yet.</p>
        ) : (
          <ul>
            {txs.map((t) => (
              <li key={t.id}>
                {t.amount > 0 ? "+" : ""}{t.amount} — {new Date(t.created_at).toLocaleString()}
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}

