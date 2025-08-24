import { useParams } from "react-router-dom";
import Breadcrumbs from "../../components/Breadcrumbs";
import { getWorldBySlug } from "../../data/worlds";

export default function WorldDetail() {
  const { slug = "" } = useParams();
  const world = getWorldBySlug(slug);
  if (!world) return <p>World not found.</p>;

  return (
    <article>
      <Breadcrumbs items={[{ href: "/worlds", label: "Worlds" }, { label: world.title }]} />
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

      {/* …characters, sections, etc… */}
    </article>
  );
}
