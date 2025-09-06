export function NavatarFrame({ src, title, onClick }: { src?: string; title: string; onClick?: () => void }) {
  return (
    <div className="nv-frame" onClick={onClick} role={onClick ? "button" : undefined}>
      {src ? <img src={src} alt={title} /> : <div className="nv-empty">No photo</div>}
      <div className="nv-caption">{title}</div>
    </div>
  );
}
export default NavatarFrame;
