export default function Passport() {
  const stamps = ["Thailandia", "Chinlandia", "Indilandia"]; // demo
  return (
    <section>
      <h1>Passport</h1>
      <p>Badges, stamps, XP, and NATUR coin.</p>
      <p><strong>Stamps:</strong> {stamps.join(" · ")}</p>
    </section>
  );
}
