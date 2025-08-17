import { useEffect, useMemo, useState } from "react";
import { NATUR, connectWallet, currentAccount, erc20BalanceOf, formatUnits, parseUnits, sendErc20Transfer } from "../../lib/web3";

function useQuery() {
  return useMemo(() => new URLSearchParams(window.location.search), []);
}

export default function Checkout() {
  const q = useQuery();
  const name = q.get("name") || "Mystery Item";
  const sku = q.get("sku") || "unknown";
  const unitPrice = Number(q.get("price") || "10"); // NATUR per unit

  const [addr, setAddr] = useState<string | null>(null);
  const [balance, setBalance] = useState<string | null>(null);
  const [qty, setQty] = useState(1);
  const totalNatur = unitPrice * qty;

  useEffect(() => {
    (async () => {
      const a = await currentAccount();
      if (a) setAddr(a);
    })();
  }, []);

  async function doConnect() {
    try {
      const a = await connectWallet();
      setAddr(a);
      const bal = await erc20BalanceOf(NATUR.TOKEN_ADDRESS, a);
      setBalance(formatUnits(bal));
    } catch (e: any) {
      alert(e?.message || "Failed to connect wallet");
    }
  }

  async function refreshBal() {
    if (!addr) return;
    try {
      const bal = await erc20BalanceOf(NATUR.TOKEN_ADDRESS, addr);
      setBalance(formatUnits(bal));
    } catch {
      setBalance(null);
    }
  }

  async function payNatur() {
    if (!addr) return alert("Connect your wallet first.");
    try {
      const amount = parseUnits(totalNatur, NATUR.DECIMALS);
      const hash = await sendErc20Transfer(
        NATUR.TOKEN_ADDRESS,
        NATUR.MERCHANT_TREASURY,
        amount,
        addr
      );
      alert(`Transaction sent!\n\nHash:\n${hash}`);
      await refreshBal();
      // TODO: call /.netlify/functions/natur-verify to record the order on the backend
    } catch (e: any) {
      alert(e?.message || "Payment failed");
    }
  }

  return (
    <main style={{ maxWidth: 960, margin: "0 auto", padding: "2rem" }}>
      <h1>Checkout</h1>
      <div style={{ marginBottom: "1rem", opacity: .9 }}>
        <div><strong>Item:</strong> {name}</div>
        <div><strong>SKU:</strong> {sku}</div>
      </div>

      <section style={{ display: "grid", gap: "1rem", marginBottom: "1.25rem" }}>
        <label>
          Quantity:&nbsp;
          <input
            type="number"
            min={1}
            value={qty}
            onChange={(e) => setQty(Math.max(1, Number(e.target.value || 1)))}
            style={{ width: 80 }}
          />
        </label>
        <div><strong>Price:</strong> {unitPrice} NATUR</div>
        <div style={{ fontSize: 18 }}><strong>Total:</strong> {totalNatur} NATUR</div>
      </section>

      <section style={{ display: "grid", gap: ".5rem", marginBottom: "1rem" }}>
        <h3>Pay with NATUR</h3>
        {addr ? (
          <>
            <div>Connected: <code>{addr}</code></div>
            <div>Balance: {balance ?? '—'} NATUR <button onClick={refreshBal} style={{ marginLeft: 8 }}>↻</button></div>
            <button onClick={payNatur}>Pay {totalNatur} NATUR</button>
          </>
        ) : (
          <button onClick={doConnect}>Connect MetaMask</button>
        )}
        <div style={{ opacity: .7, marginTop: ".5rem" }}>
          Network: expects chain <code>{NATUR.CHAIN_ID_HEX}</code> (update in <code>web3.ts</code>).
        </div>
      </section>

      <section style={{ marginTop: "1.5rem" }}>
        <h3>Or pay with card (coming soon)</h3>
        <button disabled>Pay with Card</button>
      </section>
    </main>
  );
}

