import KingdomImage from "../components/KingdomImage";
import { KINGDOMS } from "../content/kingdoms";
import Breadcrumbs from "../components/Breadcrumbs";

export default function Worlds() {
  return (
    <div className="nvrs-section worlds">
      <main id="main" className="container">
        <Breadcrumbs />
        <h2 className="section-title">Worlds</h2>
        <p className="section-lead">Explore the 14 kingdoms.</p>

        <div className="grid gap-6 md:grid-cols-3 animate-fadeIn">
          {KINGDOMS.map(k => (
            <div key={k.key} className="world-card transform transition duration-500 hover:scale-105">
              <KingdomImage kingdom={k.key} kind="card" className="rounded-lg shadow-md" />
              <h2 className="mt-2 text-center font-bold text-sky-600">{k.title}</h2>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
