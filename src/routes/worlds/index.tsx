import Breadcrumbs from "../../components/Breadcrumbs";
import { WORLDS } from "../../data/worlds";

export default function WorldsIndex() {
  return (
      <main id="main" data-turian="worlds" className="nvrs-section worlds nv-page page-worlds">
      <Breadcrumbs items={[{ href: "/", label: "Home" }, { label: "Worlds" }]} />
      <h1>Worlds</h1>
      <section className="nv-grid">
        {WORLDS.map(w => (
          <a key={w.slug} href={`/worlds/${w.slug}`} className="nv-card">
            <div className="nv-card-img-wrapper">
              <img
                src={w.imgSrc}
                alt={w.imgAlt}
                loading="lazy"
                className="nv-card-img"
              />
            </div>
            <h3 className="nv-card-title">{w.title}</h3>
            <p className="nv-card-sub">{w.subtitle}</p>
          </a>
        ))}
      </section>
    </main>
  );
}
