import React from "react";
import "../styles/navatar.css";

type Props = {
  src?: string | null;
  title?: string;
  subtitle?: string;
  className?: string;
  onClick?: () => void;
  selectable?: boolean;
};

export default function NavatarCard({
  src,
  title,
  subtitle,
  className = "",
  onClick,
  selectable,
}: Props) {
  const Tag: any = onClick ? "button" : "figure";
  return (
    <Tag
      className={`nav-card ${selectable ? "nav-card--selectable" : ""} ${className}`}
      onClick={onClick}
      type={onClick ? "button" : undefined}
    >
      <div className="nav-card__img" aria-label={title || "Navatar"}>
        {src ? <img src={src} alt={title || "Navatar"} /> : <div className="nav-card__placeholder" />}
      </div>
      {(title || subtitle) && (
        <figcaption className="nav-card__cap">
          {title && <strong>{title}</strong>}
          {subtitle && <span> · {subtitle}</span>}
        </figcaption>
      )}
    </Tag>
  );
}
