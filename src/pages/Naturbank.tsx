export default function Naturbank() {
  const modules = [
    ["Wallet", "Create custodial wallet & view address."],
    ["NATUR Token", "Earnings, redemptions, and ledger."],
    ["NFTs", "Mint navatar cards & collectibles."],
    ["Learn", "Crypto basics & safety guides."]
  ];
  return (
    <section>
      <h1>Naturbank</h1>
      <div className="grid">
        {modules.map(([t, d]) => (
          <div key={t} className="card">
            <div className="card-emoji">🪙</div>
            <div><h3>{t}</h3><p>{d}</p></div>
          </div>
        ))}
      </div>
    </section>
  );
}
