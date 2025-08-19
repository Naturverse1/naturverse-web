import { useEffect, useState } from "react";
import * as wallet from "../../lib/wallet";
import { supabase } from "../../lib/supabaseClient";

export default function Wallet() {
  const [address, setAddress] = useState("");

  useEffect(() => { setAddress(wallet.getAddress()); }, []);

  async function handleConnect() {
    try {
      await wallet.connect();
      setAddress(wallet.getAddress());
    } catch (e: any) {
      alert(e.message || String(e));
    }
  }

  async function saveToProfile() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return alert("Sign in first.");
    await supabase.from("profiles").upsert({ id: user.id, wallet_address: address });
    alert("Saved wallet to profile.");
  }

  return (
    <section>
      <h2>🪙 Web3 Wallet</h2>
      {!wallet.hasProvider() && <p>Install MetaMask or a compatible wallet to continue.</p>}
      {!address ? (
        <button onClick={handleConnect}>Connect Wallet</button>
      ) : (
        <>
          <p>Connected: <code>{address}</code></p>
          <button onClick={saveToProfile}>Save to Profile</button>
        </>
      )}
    </section>
  );
}
