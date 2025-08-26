import { useParams } from "react-router-dom";
import Breadcrumbs from "../../components/Breadcrumbs";
import CharacterGrid from "../../components/CharacterGrid";
import LazyImage from "../../components/LazyImage";
import { getWorldBySlug } from "../../data/worlds";
import { SLUG_TO_FOLDER, type KingdomSlug } from "../../lib/kingdoms";

export default function WorldDetail() {
  const { slug } = useParams<{ slug: KingdomSlug }>();
  if (!slug) return <p>World not found.</p>;
  const world = getWorldBySlug(slug);
  const folder = SLUG_TO_FOLDER[slug];
  if (!world) return <p>World not found.</p>;

    return (
      <article className="world-page">
        <Breadcrumbs items={[{ href: "/", label: "Home" }, { href: "/worlds", label: "Worlds" }, { label: world.title }]} />
        <h1>{world.title}</h1>
        <p>Zoom into landmarks, routes, and regions.</p>

      <div className="nv-hero-img-wrapper">
        <LazyImage
          src={world.imgSrc}
          alt={world.imgAlt}
          className="nv-hero-img"
          loading="eager"
        />
      </div>

      <section aria-labelledby="characters-heading" style={{ marginTop: 24 }}>
        <h2 id="characters-heading">Characters</h2>
        <CharacterGrid kingdom={folder} />
      </section>
    </article>
  );
}
