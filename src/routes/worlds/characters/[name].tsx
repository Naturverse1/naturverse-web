import { Link, useParams } from "react-router-dom";
import { SLUG_TO_FOLDER, type KingdomSlug } from "../../../lib/kingdoms";
import LazyImage from "../../../components/LazyImage";

export default function CharacterPage() {
  const { slug, name } = useParams<{ slug: KingdomSlug; name: string }>();
  if (!slug || !name) return <p>Character not found.</p>;
  const folder = SLUG_TO_FOLDER[slug];
  const fileGuess = decodeURIComponent(name);
  const candidates = [".png", ".jpg", ".jpeg", ".webp"].map(
    (ext) => `/kingdoms/${folder}/${fileGuess}${ext}`,
  );

    return (
      <div className="world-page">
        <nav className="text-sm" aria-label="Breadcrumb">
          <Link to="/">Home</Link> <span>/</span>{" "}
          <Link to="/worlds">Worlds</Link> <span>/</span>{" "}
        <Link to={`/worlds/${slug}`}>{folder}</Link> <span>/</span>{" "}
        <span className="font-medium">{fileGuess}</span>
      </nav>

      <h1 className="text-3xl font-extrabold">{fileGuess}</h1>

      <div
        className="nv-hero-img-wrapper"
        style={{ maxWidth: 320, margin: "0 auto" }}
      >
        {candidates.map((src) => (
          <LazyImage
            key={src}
            src={src}
            alt={fileGuess}
            style={{ width: "100%", display: "none", objectFit: "contain" }}
            onLoad={(e) => (e.currentTarget.style.display = "block")}
            onError={(e) => (e.currentTarget.style.display = "none")}
          />
        ))}
      </div>
    </div>
  );
}
