import React from 'react';

export function CardFrame({ children, title }: { children: React.ReactNode; title?: string }) {
  return (
    <div className="nv-card">
      {title && <div className="nv-card-title">{title}</div>}
      {children}
    </div>
  );
}

