import { useParams } from "react-router-dom";
import Breadcrumbs from "../../components/Breadcrumbs";
import { CharacterGrid } from "../../components/CharacterGrid";
import { getWorldBySlug } from "../../data/worlds";

const FOLDER_BY_SLUG: Record<string, string> = {
  amerilandia: "Amerilandia",
  australandia: "Australandia",
  brazilandia: "Brazilandia",
  chilandia: "Chilandia",
  indillandia: "Indillandia",
  thailandia: "Thailandia",
};

export default function WorldDetail() {
  const { slug = "" } = useParams();
  const world = getWorldBySlug(slug);
  const folder = FOLDER_BY_SLUG[slug] ?? slug;
  if (!world) return <p>World not found.</p>;

  return (
    <article>
      <Breadcrumbs items={[{ href: "/", label: "Home" }, { href: "/worlds", label: "Worlds" }, { label: world.title }]} />
      <h1>{world.title}</h1>
      <p>Zoom into landmarks, routes, and regions.</p>

      <div className="nv-hero-img-wrapper">
        <img
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
