import NavatarImage from "./NavatarImage";

type Props = {
  src?: string | null;
  title?: string;
  subtitle?: string;
  className?: string;
  mode?: "contain" | "cover";
};

export default function NavatarCard({
  src,
  title = "My Navatar",
  subtitle,
  className,
  mode = "contain",
}: Props) {
  return (
    <figure className={`nav-card ${className ?? ""}`}>
      <NavatarImage src={src} alt={title} mode={mode} />
      <figcaption className="nav-card__cap">
        <strong>{title}</strong>
        {subtitle ? <span> · {subtitle}</span> : null}
      </figcaption>
    </figure>
  );
}
