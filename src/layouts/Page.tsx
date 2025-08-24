import React from "react";
export default function Page({ title, children }:{ title?: string; children: React.ReactNode }) {
  return (
    <div className="page">
      {title ? <h1>{title}</h1> : null}
      {children}
    </div>
  );
}
