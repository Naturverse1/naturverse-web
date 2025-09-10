import React from "react";

type Props = {
  src?: string | null;
  title?: string;
  subtitle?: string;
  className?: string;
};

export default function NavatarCard({ src, title, subtitle, className }: Props) {
  return (
    <figure className={`nav-card ${className ?? ""}`}>
      <div className="nav-card__img" aria-label={title || "Navatar"}>
        {src ? <img src={src} alt={title} /> : <div className="nav-card__placeholder" />}
      </div>
      <figcaption className="nav-card__cap">
        <strong>{title || "Unnamed"}</strong>
        {subtitle ? <span> · {subtitle}</span> : null}
      </figcaption>
    </figure>
  );
}
