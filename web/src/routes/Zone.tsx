import { useParams, Link } from "react-router-dom";
import { zoneBySlug, stories, tips } from "../lib/content";

export default function Zone() {
  const { slug } = useParams();
  const zone = zoneBySlug(slug);
  if (!zone) return <div className="container"><h1>Zone</h1><p className="meta">Not found.</p></div>;

  const zoneStories = stories.filter(s => s.zone === slug);
  const zoneTips = tips.filter(t => t.zone === slug);

  return (
    <div className="container">
      <h1>{zone.title}</h1>
      <p className="meta">{zone.tagline}</p>
      {!!zoneStories.length && (<>
        <h2>Stories</h2>
        <ul>{zoneStories.map(s => <li key={s.id}><Link to={`/stories/${s.id}`}>{s.title}</Link></li>)}</ul>
      </>)}
      {!!zoneTips.length && (<>
        <h2>Tips</h2>
        <ul>{zoneTips.map(t => <li key={t.id}><Link to={`/tips/${t.id}`}>{t.title}</Link></li>)}</ul>
      </>)}
    </div>
  );
}
