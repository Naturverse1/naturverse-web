import * as coinsLib from "../../lib/coins";

export default function Coins() {
  const balance = (coinsLib as any).getBalance?.() ?? 0;
  const symbol = (coinsLib as any).SYMBOL ?? "NAT";

  return (
    <section>
      <h2>💰 Coins</h2>
      <p>Balance: {balance} {symbol}</p>
      <p>Implement transfers/mints in <code>lib/coins.ts</code> when ready.</p>
    </section>
  );
}

