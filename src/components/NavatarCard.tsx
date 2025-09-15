import React from "react";
import AvatarPlaceholder from './AvatarPlaceholder';

type Props = {
  src?: string | null;
  title?: string;
  subtitle?: string;
  className?: string;
};

export default function NavatarCard({ src, title = "My Navatar", subtitle, className }: Props) {
  return (
    <figure className={`nav-card ${className ?? ""}`}>
      <div className="nav-card__img" aria-label={title}>
        {src ? (
          <img src={src} alt={title} />
        ) : (
          <AvatarPlaceholder title={title} />
        )}
      </div>
      <figcaption className="nav-card__cap">
        <strong>{title}</strong>
        {subtitle ? <span> · {subtitle}</span> : null}
      </figcaption>
    </figure>
  );
}
