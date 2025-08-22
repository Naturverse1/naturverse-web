import Layout from "../../components/Layout";

const cards = [
  {
    title: "Thailandia",
    subtitle: "Coconuts & Elephants",
    beliefs: [
      "Kindness, merit, and harmony with nature.",
      "Respect for water, forests, and elephants as guardian spirits."
    ],
    holidays: [
      "Songkran (Water Festival) — Mid-April. New year blessing with water splashing, gratitude, and renewal.",
      "Loy Krathong — Full moon of the 12th lunar month. Lanterns & floating baskets thanking rivers and letting go of worries."
    ],
    ceremonies: [
      "Dawn offerings to temples.",
      "Water blessings before long journeys or new quests."
    ]
  },
  {
    title: "Amerilandia",
    subtitle: "Apples & Eagles",
    beliefs: [
      "Freedom, community service, and fair play.",
      "Stewardship of parks, trails, and wild places."
    ],
    holidays: [
      "Independence Festival — Early July. Parades, fireworks, and community clean-ups.",
      "Harvest Day — Late November. Gratitude feasts and food drives for neighbors."
    ],
    ceremonies: [
      "Trail pledges before expeditions.",
      "Community flag & firelight gatherings."
    ]
  },
  {
    title: "Chilandia",
    subtitle: "Pandas & Dragons",
    beliefs: [
      "Balance, family, and scholarly curiosity.",
      "Bamboo as a symbol of resilience."
    ],
    holidays: [
      "Lunar New Year — Late Jan / Feb. Reunion dinners, red envelopes, lion & dragon dances.",
      "Mid-Autumn Festival — Sep / Oct. Mooncakes, lantern walks, stories of the moon."
    ],
    ceremonies: [
      "Tea sharing to begin peace talks and quests.",
      "Lantern messages for wishes and thanks."
    ]
  }
];

export default function Culture(){
  return (
    <Layout>
      <h1>🪔 Culture</h1>
      <p>Beliefs, holidays, and ceremonies across the 14 kingdoms.</p>
      <div className="culture-grid grid-3">
        {cards.map((c)=>(
          <article key={c.title} className="nv-card">
            <h3>{c.title}</h3>
            <p className="muted">{c.subtitle}</p>
            <h4>Beliefs</h4>
            <ul className="list-reset">{c.beliefs.map(b=><li key={b}>{b}</li>)}</ul>
            <h4>Holidays</h4>
            <ul className="list-reset">{c.holidays.map(h=><li key={h}>{h}</li>)}</ul>
            <h4>Ceremonies</h4>
            <ul className="list-reset">{c.ceremonies.map(x=><li key={x}>{x}</li>)}</ul>
          </article>
        ))}
      </div>
    </Layout>
  );
}
