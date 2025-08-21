export default function Marketplace() {
  const wishlist = [
    { name: "Navatar Plushie", price: 25 },
    { name: "Kingdom Sticker Pack", price: 9 },
    { name: "Natur Tee", price: 29 }
  ];
  const naturBalance = 120; // placeholder

  return (
    <section>
      <h1>Marketplace</h1>
      <p className="subhead">NATUR balance: <strong>{naturBalance}</strong> (demo)</p>
      <h3>Wishlist</h3>
      <ul>
        {wishlist.map((w) => (
          <li key={w.name}>{w.name} — ${w.price}</li>
        ))}
      </ul>
      <p className="muted">Catalog and checkout connect here later.</p>
    </section>
  );
}
