import { WORLDS } from "../../data/worlds";

export default function WorldsIndex() {
  return (
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
  );
}
