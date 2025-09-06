export default function NavatarImage({
  src,
  alt,
  mode = 'contain',
}: {
  src?: string | null;
  alt?: string;
  mode?: 'contain' | 'cover';
}) {
  return (
    <div className={`nv-img-wrap ${mode}`}>
      {src ? <img src={src} alt={alt ?? 'Navatar'} /> : <div className="nv-img-ph" />}
    </div>
  );
}
