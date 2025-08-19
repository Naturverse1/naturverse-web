import * as walletLib from "../../lib/wallet";

export default function Wallet() {
  const connected = (walletLib as any).isConnected?.() ?? false;
  const address = (walletLib as any).getAddress?.() ?? "";

  return (
    <section>
      <h2>🪙 Web3 Wallet</h2>
      {connected ? (
        <p>Connected: <code>{address}</code></p>
      ) : (
        <p>No wallet connected. Use <code>lib/wallet.ts</code> to wire a provider.</p>
      )}
    </section>
  );
}

