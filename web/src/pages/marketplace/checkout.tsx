import React, { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getCart, saveCart, cartTotalCents, fmtMoney } from "../../lib/marketplace";
import { getWeb3Config, ERC20_ABI_MIN } from "../../lib/web3";
import { BrowserProvider, Contract, parseUnits } from "ethers";

export default function CheckoutPage(){
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const items = getCart();
  const totalCents = useMemo(()=>cartTotalCents(items), [items]);
  const usdTotal = totalCents / 100;

  async function createOrderNatur(): Promise<string>{
    const res = await fetch("/.netlify/functions/checkout-mock", {
      method:"POST",
      headers:{ "Content-Type":"application/json" },
      body: JSON.stringify({ email, items, total_cents: totalCents, method: "natur" })
    });
    const out = await res.json();
    if (!res.ok) throw new Error(out.error || "Order create failed");
    return out.order_id as string;
  }

  async function ensureChain(eth: any, targetChainIdHex: string){
    const current = await eth.request({ method: "eth_chainId" });
    if (current?.toLowerCase() === targetChainIdHex.toLowerCase()) return;
    try {
      await eth.request({ method: "wallet_switchEthereumChain", params:[{ chainId: targetChainIdHex }] });
    } catch (err: any) {
      if (err?.code === 4902) {
        // If needed, user can add the chain manually; for MVP we just show a friendly hint.
        throw new Error("Wrong network. Please switch your wallet to the configured NATUR network.");
      }
      throw err;
    }
  }

  async function payWithNatur(){
    try{
      setBusy(true);
      if (!email) throw new Error("Please enter an email");
      if (items.length === 0) throw new Error("Cart is empty");

      const orderId = await createOrderNatur();

      const cfg = getWeb3Config();
      const eth = (window as any).ethereum;
      if (!eth) throw new Error("No wallet found. Please install MetaMask or a compatible wallet.");

      await ensureChain(eth, cfg.chainIdHex);

      const provider = new BrowserProvider(eth);
      const signer = await provider.getSigner();
      const token = new Contract(cfg.tokenAddress, ERC20_ABI_MIN, signer);

      // NATUR amount = USD total / usdPerNatur. Example: $15, 1 NATUR = $1 => 15 NATUR.
      const naturAmount = usdTotal / cfg.usdPerNatur;
      const amountWei = parseUnits(naturAmount.toFixed(6), cfg.tokenDecimals); // 6 dp for safety

      const tx = await token.transfer(cfg.treasury, amountWei);
      const receipt = await tx.wait();

      const verify = await fetch("/.netlify/functions/natur-verify", {
        method: "POST",
        headers: { "Content-Type":"application/json" },
        body: JSON.stringify({ order_id: orderId, tx_hash: receipt.hash })
      });
      const out = await verify.json();
      if (!verify.ok) throw new Error(out.error || "Payment verification failed");

      saveCart([]);
      nav(`/marketplace/order/${orderId}`);
    } catch (err:any){
      alert(err.message || "NATUR payment failed");
    } finally {
      setBusy(false);
    }

  }

  async function placeMock(){
    try{
      setBusy(true);
      const res = await fetch("/.netlify/functions/checkout-mock", {
        method:"POST",
        headers:{ "Content-Type":"application/json" },
        body: JSON.stringify({ email, items, total_cents: totalCents, method: "mock" })
      });
      const out = await res.json();
      if (!res.ok) throw new Error(out.error || "Checkout failed");
      saveCart([]);
      nav(`/marketplace/order/${out.order_id}`);
    } catch (e:any){
      alert(e.message || "Checkout failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-md p-4">
      <Link to="/marketplace/cart" className="text-sm opacity-80 hover:underline">← Back to cart</Link>
      <h1 className="text-2xl font-bold mt-4">Checkout</h1>
      <div className="mt-4">
        <label className="font-semibold">Email for order receipt</label>
        <input value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="you@domain.com" className="w-full rounded-md bg-slate-900/60 ring-1 ring-slate-700 p-2 mt-1"/>
      </div>
      <div className="mt-4 flex flex-col gap-2">
        <button onClick={placeMock} disabled={busy} className="rounded-md bg-indigo-500 px-4 py-2 font-semibold hover:bg-indigo-400 disabled:opacity-50">Pay (mock)</button>
        <button onClick={payWithNatur} disabled={busy} className="rounded-md bg-emerald-600 px-4 py-2 font-semibold hover:bg-emerald-500 disabled:opacity-50">Pay with NATUR</button>
      </div>
      <div className="mt-4">Total: {fmtMoney(totalCents)}</div>
    </div>
  );
}

