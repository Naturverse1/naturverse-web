import CardGrid, { Card } from "../components/CardGrid";
import KingdomImage from "../components/KingdomImage";
import { KINGDOMS } from "../content/kingdoms";

export default function Worlds() {
  return (
    <main className="container">
      <div className="breadcrumb">Home / Worlds</div>
      <h2 className="section-title">Worlds</h2>
      <p className="section-lead">Explore the 14 kingdoms.</p>

      <CardGrid>
        {KINGDOMS.map(k => (
          <Card
            key={k.key}
            href={`/worlds/${k.key.toLowerCase()}`}
            title={k.title}
            subtitle={k.subtitle}
            image={<KingdomImage kingdom={k.key} kind="card" />}
          />
        ))}
      </CardGrid>
    </main>
  );
}
