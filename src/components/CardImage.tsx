// Portrait 2:3 frame; images fill without stretching, no black bars
export default function CardImage({ src, alt }: { src?: string; alt?: string }) {
  return (
    <div className="nv-img-frame">
      {src ? <img src={src} alt={alt ?? ""} /> : <div className="nv-img-ph" />}
    </div>
  );
}
