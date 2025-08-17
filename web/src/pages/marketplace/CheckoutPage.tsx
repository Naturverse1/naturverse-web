import React, { useEffect, useMemo, useState } from "react";
import { useCart } from "@/context/CartContext";
import { useNavigate } from "react-router-dom";
import {
  connectWallet,
  ensureCorrectChain,
  getBrowserProvider,
  getNaturBalance,
  getNaturMeta,
  getNativeBalance,
  transferNatur,
} from "@/lib/wallet";
import FaucetHelp from "@/components/FaucetHelp";
import { formatToken, naturUsdApprox } from "@/lib/pricing";

const EXPLORER = import.meta.env.VITE_BLOCK_EXPLORER as string | undefined;
const MERCHANT = import.meta.env.VITE_MERCHANT_ADDRESS as string;
const NATUR_USD_RATE = import.meta.env.VITE_NATUR_USD_RATE as string | undefined;

const CheckoutPage: React.FC = () => {
  const nav = useNavigate();
  const { items, subtotal, clearCart } = useCart();

  const [address, setAddress] = useState<string | null>(null);
  const [chainOk, setChainOk] = useState(false);
  const [naturBal, setNaturBal] = useState<bigint | null>(null);
  const [naturSymbol, setNaturSymbol] = useState("NATUR");
  const [naturDecimals, setNaturDecimals] = useState(18);
  const [gasBal, setGasBal] = useState<number | null>(null);
  const [busy, setBusy] = useState<"idle" | "connecting" | "paying">("idle");
  const [error, setError] = useState<string | null>(null);
  const [showFaucet, setShowFaucet] = useState(false);

  const totalNatur = useMemo(
    () => Number((Math.round(subtotal * 100) / 100).toFixed(2)),
    [subtotal]
  );
  const totalUsd = naturUsdApprox(totalNatur, NATUR_USD_RATE);

  useEffect(() => {
    (async () => {
      try {
        const provider = await getBrowserProvider();
        const accs = await provider.send("eth_accounts", []);
        if (accs && accs[0]) {
          setAddress(accs[0]);
          await ensureCorrectChain();
          setChainOk(true);
          const meta = await getNaturMeta(provider);
          setNaturSymbol(meta.symbol || "NATUR");
          setNaturDecimals(meta.decimals || 18);
          const [nbal, gbal] = await Promise.all([
            getNaturBalance(provider, accs[0]),
            getNativeBalance(provider, accs[0]),
          ]);
          setNaturBal(nbal);
          setGasBal(gbal);
        }
      } catch (_) {}
    })();
  }, []);

  const onConnect = async () => {
    setError(null);
    setBusy("connecting");
    try {
      await ensureCorrectChain();
      const { address, provider } = await connectWallet();
      setAddress(address);
      setChainOk(true);
      const meta = await getNaturMeta(provider);
      setNaturSymbol(meta.symbol || "NATUR");
      setNaturDecimals(meta.decimals || 18);
      const [nbal, gbal] = await Promise.all([
        getNaturBalance(provider, address),
        getNativeBalance(provider, address),
      ]);
      setNaturBal(nbal);
      setGasBal(gbal);
    } catch (e: any) {
      setError(e?.message || "Failed to connect wallet");
    } finally {
      setBusy("idle");
    }
  };

  const canPayBase =
    !!address && chainOk && naturBal !== null && gasBal !== null && totalNatur > 0;
  const notEnoughNatur = useMemo(() => {
    if (!naturBal) return false;
    const needed = BigInt(Math.floor(totalNatur * Math.pow(10, naturDecimals)));
    return naturBal < needed;
  }, [naturBal, totalNatur, naturDecimals]);

  const noGas = (gasBal || 0) <= 0;

  const disabledReason =
    !address
      ? "Connect wallet"
      : !chainOk
      ? "Wrong network"
      : notEnoughNatur
      ? `Not enough ${naturSymbol}`
      : noGas
      ? "Add a little gas"
      : null;

  const onPay = async () => {
    setError(null);
    if (!address) return;
    if (!MERCHANT) {
      setError("Missing VITE_MERCHANT_ADDRESS");
      return;
    }

    try {
      setBusy("paying");
      const provider = await getBrowserProvider();
      const { decimals, symbol } = await getNaturMeta(provider);
      const need = Number(totalNatur);
      const { signer } = await connectWallet();
      const tx = await transferNatur(signer, MERCHANT, need);
      await tx.wait();

      const id = `ord_${Date.now()}`;
      const order = {
        id,
        ts: Date.now(),
        address,
        items: items.map((i) => ({
          id: i.id,
          name: i.name,
          qty: i.quantity,
          price: i.price,
        })),
        subtotal: subtotal,
        fee: 0,
        total: need,
        status: "Paid" as const,
        txHash: tx.hash,
      };
      try {
        const existing = JSON.parse(localStorage.getItem("natur_orders") || "[]");
        localStorage.setItem("natur_orders", JSON.stringify([order, ...existing]));
      } catch {}

      clearCart();
      nav(`/marketplace/orders/${id}`);
      if (EXPLORER) window.open(`${EXPLORER}/tx/${tx.hash}`, "_blank");
    } catch (e: any) {
      if (e?.code === 4001) setError("Transaction canceled");
      else setError(e?.message || "Payment failed");
    } finally {
      setBusy("idle");
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>

      {items.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <ul className="mb-6">
            {items.map((i) => (
              <li key={i.id} className="flex justify-between border-b py-2">
                <span>
                  {i.name} × {i.quantity}
                </span>
                <span>{(i.price * i.quantity).toFixed(2)} {naturSymbol}</span>
              </li>
            ))}
          </ul>

          <p className="font-bold mb-4">
            Total: {totalNatur.toFixed(2)} {naturSymbol}
            {totalUsd && <span style={{ opacity: 0.8 }}> (~{totalUsd})</span>}
          </p>

          {!address ? (
            <button
              onClick={onConnect}
              disabled={busy !== "idle"}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              {busy === "connecting" ? "Connecting..." : "Connect Wallet"}
            </button>
          ) : (
            <div className="mb-4 text-sm opacity-90">
              <div>Connected: {address}</div>
              <div>Chain: {chainOk ? "OK" : "Wrong network"}</div>
              <div>
                Token balance: {naturBal !== null
                  ? `${formatToken(naturBal, naturDecimals)} ${naturSymbol}`
                  : "—"}
              </div>
              <div>Gas balance: {gasBal !== null ? gasBal.toFixed(6) : "—"}</div>
            </div>
          )}

          <div className="mb-3">
            <button onClick={() => setShowFaucet(true)} className="underline text-sm">
              Need NATUR or gas?
            </button>
          </div>

          <button
            disabled={!(canPayBase && !notEnoughNatur && !noGas) || busy !== "idle"}
            onClick={onPay}
            className="bg-green-600 text-white px-6 py-2 rounded disabled:opacity-50"
            title={disabledReason || ""}
          >
            {busy === "paying"
              ? "Paying..."
              : disabledReason
              ? disabledReason
              : `Pay ${totalNatur.toFixed(2)} ${naturSymbol}`}
          </button>

          {error && <p className="mt-3 text-red-400">{error}</p>}
        </>
      )}

      <FaucetHelp open={showFaucet} onClose={() => setShowFaucet(false)} />
    </div>
  );
};

export default CheckoutPage;
