import type { ActiveNavatar } from "../lib/navatar/storage";

export default function NavatarCard({ n }: { n: ActiveNavatar | null }) {
  if (!n) return null;
  return (
    <div className="navatar-card">
      <img src={n.imageUrl} alt={n.name} />
      <div className="name">{n.name}</div>
      <style>{`
        .navatar-card {
          display: inline-block;
          border: 1px solid #e3e8ff;
          border-radius: 14px;
          padding: 10px;
          background: #fff;
        }
        .navatar-card img {
          width: 180px;
          aspect-ratio: 3/4;
          object-fit: cover;
          border-radius: 10px;
          background: #f3f6ff;
          display: block;
        }
        .navatar-card .name {
          margin-top: 8px;
          font-weight: 700;
          color: #1f4bff;
          text-align: center;
        }
      `}</style>
    </div>
  );
}
