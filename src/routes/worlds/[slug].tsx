import { useParams } from "react-router-dom";
import Breadcrumbs from "../../components/Breadcrumbs";
import { WORLDS } from "../../data/worlds";

export default function WorldDetail() {
  const { slug } = useParams<{ slug: string }>();
  if (!slug) return <p>World not found.</p>;
  const world = WORLDS.find((w) => w.slug === slug);
  if (!world) return <p>World not found.</p>;

  return (
    <article className="world-page">
      <Breadcrumbs
        items={[
          { href: "/", label: "Home" },
          { href: "/worlds", label: "Worlds" },
          { label: world.name },
        ]}
      />
      <h1>{world.name}</h1>
      <p>{world.summary}</p>
      {world.image && (
        <div className="nv-hero-img-wrapper">
          <img
            src={world.image}
            alt={world.name}
            className="nv-hero-img"
            loading="eager"
          />
        </div>
      )}
    </article>
  );
}
