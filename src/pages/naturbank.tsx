import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase-client";
import Breadcrumbs from "../components/Breadcrumbs";
import type { NaturTxn } from "../types/bank";
import { setTitle } from "./_meta";

const LS_WALLET = "naturverse.bank.wallet.v1";
const LS_TXNS = "naturverse.bank.txns.v1";
const START_BAL = 120;

export default function NaturBankPage() {
  setTitle("NaturBank");
  const [uid, setUid] = useState<string | null>(null);
  const [usingLocal, setUsingLocal] = useState(true);
  const [loading, setLoading] = useState(true);

  const [address, setAddress] = useState<string>(() => {
    try { return JSON.parse(localStorage.getItem(LS_WALLET) || `""`) || ""; } catch { return ""; }
  });
  const [label, setLabel] = useState<string>("My Wallet");
  const [txns, setTxns] = useState<NaturTxn[]>(() => {
    try { return JSON.parse(localStorage.getItem(LS_TXNS) || "[]"); } catch { return []; }
  });

  useEffect(() => { if (usingLocal) localStorage.setItem(LS_WALLET, JSON.stringify(address)); }, [address, usingLocal]);
  useEffect(() => { if (usingLocal) localStorage.setItem(LS_TXNS, JSON.stringify(txns)); }, [txns, usingLocal]);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getSession();
      const u = data.session?.user?.id ?? null;
      setUid(u);
      if (!u) { setLoading(false); return; }

      try {
        const { data: w, error: ew } = await supabase
          .from("natur_wallets")
          .select("address,label")
          .eq("user_id", u)
          .limit(1)
          .maybeSingle();
        if (ew) throw ew;
        if (w?.address) setAddress(w.address);

        const { data: t, error: et } = await supabase
          .from("natur_transactions")
          .select("id,user_id,wallet_address,kind,amount,note,created_at")
          .eq("user_id", u)
          .order("created_at", { ascending: false })
          .limit(200);
        if (et) throw et;
        setTxns((t || []) as NaturTxn[]);
        setUsingLocal(false);
      } catch {
        setUsingLocal(true);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const balance = useMemo(() => {
    const base = START_BAL;
    const delta = txns.reduce((sum, t) => sum + (t.kind === "spend" ? -t.amount : t.amount), 0);
    return Math.max(0, base + delta);
  }, [txns]);

  async function saveWallet() {
    if (!address.trim()) return;
    if (uid && !usingLocal) {
      const { error } = await supabase
        .from("natur_wallets")
        .upsert({ user_id: uid, address: address.trim(), label: label || null }, { onConflict: "user_id" });
      if (error) { alert(error.message); return; }
    }
    alert("Wallet saved.");
  }

  async function addTxn(kind: NaturTxn["kind"], amount: number, note?: string) {
    const newT: Omit<NaturTxn, "id" | "created_at"> = {
      user_id: uid || "local",
      wallet_address: address || "local",
      kind, amount, note: note || null,
    };
    if (uid && !usingLocal) {
      const { data, error } = await supabase
        .from("natur_transactions")
        .insert(newT)
        .select("id,user_id,wallet_address,kind,amount,note,created_at")
        .single();
      if (error) { alert(error.message); return; }
      setTxns(prev => [data as NaturTxn, ...prev]);
    } else {
      const localT: NaturTxn = { ...newT, id: String(Date.now()), created_at: new Date().toISOString() };
      setTxns(prev => [localT, ...prev]);
    }
  }

  function faucet() { addTxn("grant", 25, "Daily grant"); }
  function spend10() { if (balance >= 10) addTxn("spend", 10, "Shop demo"); }

  if (loading) return <main><h1>NaturBank</h1><p>Loading…</p></main>;

  return (
    <div className="nvrs-section naturbank page-wrap nv-secondary-scope">
      <Breadcrumbs />
      <main className="bank">
      <h1>NaturBank</h1>
      <p className="muted">{usingLocal ? "Local demo mode." : "Synced to your account."}</p>

      <section className="panel">
        <h2>Wallet</h2>
        <div className="grid2">
          <label className="field">
            <span>Label</span>
            <input value={label} onChange={e => setLabel(e.target.value)} placeholder="My Wallet" />
          </label>
          <label className="field">
            <span>Address</span>
            <input value={address} onChange={e => setAddress(e.target.value)} placeholder="0x… or email handle" />
          </label>
        </div>
        <div className="row">
          <button className="btn" onClick={saveWallet}>Save</button>
          <button className="btn outline" onClick={faucet}>Grant +25 NATUR</button>
          <button className="btn outline" onClick={spend10} disabled={balance < 10}>Spend −10 NATUR</button>
        </div>
      </section>

      <section className="panel">
        <h2>Balance</h2>
        <p className="big">{balance} NATUR</p>
        <p className="muted small">Starting demo balance: {START_BAL}. Transactions apply on top.</p>
      </section>

      <section className="panel">
        <h2>Transactions</h2>
        {txns.length === 0 ? (
          <p className="muted">No activity yet. Use the grant/spend buttons to simulate flow.</p>
        ) : (
          <table className="txn-table">
            <thead>
              <tr>
                <th>When</th><th>Type</th><th>Amount</th><th>Note</th>
              </tr>
            </thead>
            <tbody>
              {txns.map(t => (
                <tr key={t.id}>
                  <td>{t.created_at ? new Date(t.created_at).toLocaleString() : ""}</td>
                  <td className={`k ${t.kind}`}>{t.kind}</td>
                  <td className="amt">{t.kind === "spend" ? `−${t.amount}` : `+${t.amount}`}</td>
                  <td className="note">{t.note || ""}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      <p className="muted small">Coming soon: real wallet connect, custodial accounts, and redemptions.</p>
    </main>
    </div>
  );
}
