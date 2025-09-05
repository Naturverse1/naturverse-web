import type { Navatar } from '../lib/navatar';

export default function NavatarCard({ n }: { n: Navatar }) {
  return (
    <div className="navatar-card">
      <div className="img">
        {n.photo_url ? (
          <img src={n.photo_url} alt={n.name || n.type} />
        ) : (
          <div className="no-photo">No photo</div>
        )}
      </div>
      <div className="meta">
        <div className="name">{n.name || n.type}</div>
        <div className="sub">{n.type} • {new Date(n.created_at).toLocaleDateString()}</div>
        <p className="backstory">{n.backstory}</p>
      </div>
    </div>
  );
}

