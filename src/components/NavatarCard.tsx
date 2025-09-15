import React, { useState } from "react";
import AvatarPlaceholder from './AvatarPlaceholder';

type Props = {
  src?: string | null;
  title?: string;
  subtitle?: string;
  className?: string;
};

export default function NavatarCard({ src, title = "My Navatar", subtitle, className }: Props) {
  const [loaded, setLoaded] = useState(false);

  return (
    <figure className={`nav-card ${className ?? ""}`}>
      <div className="nav-card__img relative" aria-label={title}>
        {src ? (
          <>
            {!loaded && (
              <div className="absolute inset-0 nav-card__placeholder animate-pulse" aria-hidden="true" />
            )}
            <img
              src={src}
              alt={title}
              loading="lazy"
              sizes="(max-width: 768px) 80vw, 260px"
              className={`object-contain rounded-lg shadow-sm transition-opacity duration-300 ${loaded ? "opacity-100" : "opacity-0"}`}
              onLoad={() => setLoaded(true)}
            />
          </>
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
