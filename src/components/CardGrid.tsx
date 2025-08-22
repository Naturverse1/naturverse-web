import React from "react";
import { Link } from "react-router-dom";

type CardProps = {
  href: string;
  title: string;
  subtitle?: string;
  image?: React.ReactNode;
};

export function Card({ href, title, subtitle, image }: CardProps) {
  return (
    <Link
      to={href}
      className="card"
      style={{ display: "flex", alignItems: "center" }}
    >
      {image ? (
        <div className="card-img">{image}</div>
      ) : null}
      <div>
        <h3>{title}</h3>
        {subtitle ? <p className="caption">{subtitle}</p> : null}
      </div>
    </Link>
  );
}

export default function CardGrid({ children }: { children: React.ReactNode }) {
  return <div className="grid">{children}</div>;
}
