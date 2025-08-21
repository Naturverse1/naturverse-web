export default function Navatar() {
  const steps = [
    "Choose: animal, fruit, insect, spirit…",
    "Pick powers & traits",
    "Generate backstory & character card (AI)",
    "Save as Passport & optional NFT"
  ];
  return (
    <section>
      <h1>Navatar Creator</h1>
      <ol>{steps.map((s) => <li key={s}>{s}</li>)}</ol>
    </section>
  );
}
