export function NavatarCard({ src, title }: { src?: string; title?: string }) {
  return (
    <figure className="nv-card nv-character">
      {src ? <img src={src} alt={title || "My Navatar"} /> : <div className="nv-empty">No photo</div>}
      <figcaption style={{ textAlign:"center", fontWeight:700, color:"#1e46ff", padding:"10px 4px" }}>
        {title ?? "My Navatar"}
      </figcaption>
    </figure>
  );
}
