import { useParams, Link } from "react-router-dom";

export default function WorldDetail() {
  const { slug } = useParams();
  return (
    <>
      <p><Link to="/worlds">← Back to Worlds</Link></p>
      <h2 style={{ marginBottom: 8, textTransform: "capitalize" }}>
        {slug?.replace("-", " ")}
      </h2>
      <p>World page for <strong>{slug}</strong> will display its stories, zones, and activities.</p>
    </>
  );
}

