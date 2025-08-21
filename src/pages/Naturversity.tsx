export default function Naturversity() {
  const items = [
    ["Teachers", "Mentors across the 14 kingdoms."],
    ["Partners", "Brands & orgs supporting missions."],
    ["Courses", "Nature, art, music, wellness, crypto basics."]
  ];
  return (
    <section>
      <h1>Naturversity</h1>
      <ul>
        {items.map(([t, d]) => <li key={t}><strong>{t}:</strong> {d}</li>)}
      </ul>
    </section>
  );
}
