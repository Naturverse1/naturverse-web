import React from "react";
import "./card.css";

type Props = {
  href?: string;
  title: string;
  desc?: string;
  imgSrc?: string;
  imgAlt?: string;
  badge?: string;
  onClick?: () => void;
  children?: React.ReactNode;
};

export default function Card({
  href,
  title,
  desc,
  imgSrc,
  imgAlt,
  badge,
  onClick,
  children,
}: Props) {
  const body = (
    <article className="nv-card" onClick={onClick} role={onClick ? "button" : undefined}>
      {imgSrc && (
        <div className="nv-card__media">
          <img loading="lazy" src={imgSrc} alt={imgAlt ?? ""} />
        </div>
      )}
      <div className="nv-card__body">
        {badge && <span className="nv-card__badge">{badge}</span>}
        <h3 className="nv-card__title">{title}</h3>
        {desc && <p className="nv-card__desc">{desc}</p>}
        {children}
      </div>
    </article>
  );
  return href ? (
    <a className="nv-card__link" href={href}>
      {body}
    </a>
  ) : (
    body
  );
}

