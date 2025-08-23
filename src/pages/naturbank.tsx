import { useEffect, useMemo, useState } from "react";
import { supabase } from "../supabase/client";
import type { NaturWallet, NaturLedger } from "../types/bank";

const LS_BAL = "naturverse.natur.balance.v1"; // local fallback

export default function NaturBankPage() {
  const [uid, setUid] = useState<string | null>(null);
  const [balance, setBalance] = useState<number>(() => {
    const v = localStorage.getItem(LS_BAL);
    return v ? Number(v) || 0 : 120; // demo start
  });
  const [hist, setHist] = useState<NaturLedger[]>([]);
  const [loading, setLoading] = useState(true);
  const [usingLocal, setUsingLocal] = useState(true);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getSession();
      const u = data.session?.user?.id ?? null;
      setUid(u);

      try {
        if (!u) { setLoading(false); return; }

        // fetch wallet
        const { data: w, error: werr } = await supabase
          .from("natur_wallets")
          .select("user_id,balance,updated_at")
          .eq("user_id", u)
          .maybeSingle();

        if (werr) throw werr;

        if (w) {
          setBalance((w as NaturWallet).balance ?? 0);
          setUsingLocal(false);
        } else {
          // create a starter wallet in DB if table exists
          const { error: insErr } = await supabase
            .from("natur_wallets")
            .insert({ user_id: u, balance: 120 });
          if (!insErr) {
            setBalance(120);
            setUsingLocal(false);
          }
        }

        // fetch ledger
        const { data: lg, error: lerr } = await supabase
          .from("natur_ledger")
          .select("id,user_id,delta,reason,created_at")
          .eq("user_id", u)
          .order("created_at", { ascending: false })
          .limit(100);

        if (!lerr && lg) {
          setHist(lg as NaturLedger[]);
          setUsingLocal(false);
        }
      } catch {
        // fall back to local-only demo
        setUsingLocal(true);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    if (usingLocal) localStorage.setItem(LS_BAL, String(balance));
  }, [balance, usingLocal]);

  const totalEarned = useMemo(
    () => hist.filter(h => h.delta > 0).reduce((a, b) => a + (b.delta || 0), 0),
    [hist]
  );
  const totalSpent = useMemo(
    () => hist.filter(h => h.delta < 0).reduce((a, b) => a + Math.abs(b.delta || 0), 0),
    [hist]
  );

  async function add(delta: number, reason: string) {
    if (uid && !usingLocal) {
      const { error: txErr } = await supabase.rpc("natur_apply_tx", {
        p_user_id: uid,
        p_delta: delta,
        p_reason: reason,
      });
      if (txErr) { alert(txErr.message); return; }
      // refresh
      const [{ data: w }, { data: lg }] = await Promise.all([
        supabase.from("natur_wallets").select("balance").eq("user_id", uid).maybeSingle(),
        supabase.from("natur_ledger").select("id,user_id,delta,reason,created_at").eq("user_id", uid).order("created_at", { ascending: false }).limit(100),
      ]);
      if (w?.balance !== undefined) setBalance(w.balance);
      if (lg) setHist(lg as NaturLedger[]);
    } else {
      // local fallback
      setBalance(b => Math.max(0, b + delta));
      setHist(h => [
        { id: String(Date.now()), user_id: "local", delta, reason, created_at: new Date().toISOString() },
        ...h,
      ]);
    }
  }

  if (loading) return <main><h1>NaturBank</h1><p>Loading…</p></main>;

  return (
    <main className="bank">
      <h1>NaturBank</h1>
      <p className="muted">
        {usingLocal
          ? "Local demo mode (no server). Sign in to sync."
          : "Synced with your account."}
      </p>

      <section className="bank-top">
        <div className="balance-card">
          <div className="label">Current Balance</div>
          <div className="balance">{balance} NATUR</div>
          <div className="row">
            <button className="btn" onClick={() => add(+5, "Quest reward")}>+5 Earn</button>
            <button className="btn outline" onClick={() => add(-5, "Marketplace spend")}>−5 Spend</button>
          </div>
        </div>

        <div className="stats-card">
          <div className="stat">
            <div className="k">Total Earned</div>
            <div className="v">+{totalEarned} NATUR</div>
          </div>
          <div className="stat">
            <div className="k">Total Spent</div>
            <div className="v">−{totalSpent} NATUR</div>
          </div>
        </div>
      </section>

      <section className="ledger">
        <h2>Recent Activity</h2>
        {hist.length === 0 ? (
          <p className="muted">No transactions yet.</p>
        ) : (
          <table className="table">
            <thead>
              <tr><th>When</th><th>Change</th><th>Reason</th></tr>
            </thead>
            <tbody>
              {hist.map(tx => (
                <tr key={tx.id}>
                  <td>{tx.created_at ? new Date(tx.created_at).toLocaleString() : ""}</td>
                  <td className={tx.delta >= 0 ? "pos" : "neg"}>
                    {tx.delta >= 0 ? `+${tx.delta}` : tx.delta} NATUR
                  </td>
                  <td>{tx.reason || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      <section className="note">
        <p className="muted small">
          Coming soon: custodial wallets, on-chain NFTs, and redemptions. This page will connect to real balances.
        </p>
      </section>
    </main>
  );
}
