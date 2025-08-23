import React from "react";
import { Link } from "react-router-dom";

type Item = {
  to?: string;        // Link target (optional)
  title: string;      // Card title
  desc?: string;      // Small description
  icon?: React.ReactNode; // Optional emoji/icon
};

export function HubGrid({ items, children }: { items?: Item[]; children?: React.ReactNode }) {
  if (items) {
    return (
      <div className="hub-grid">
        {items.map((it, i) =>
          it.to ? (
            <Link key={i} to={it.to} className="hub-card card">
              <strong className="hub-card-title card-title">
                {it.icon && (
                  <span className="hub-ico emoji" aria-hidden>
                    {it.icon}
                  </span>
                )}
                {it.title}
              </strong>
              {it.desc && <span className="hub-card-desc">{it.desc}</span>}
            </Link>
          ) : (
            <div key={i} className="hub-card card">
              <strong className="hub-card-title card-title">
                {it.icon && (
                  <span className="hub-ico emoji" aria-hidden>
                    {it.icon}
                  </span>
                )}
                {it.title}
              </strong>
              {it.desc && <span className="hub-card-desc">{it.desc}</span>}
            </div>
          )
        )}
      </div>
    );
  }

  return <div className="hub-grid">{children}</div>;
}

export default HubGrid;
