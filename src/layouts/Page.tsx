import React from "react";
export default function Page({ title, children }:{ title?: string; children: React.ReactNode }) {
  return (
    <div className="page">
      <main id="main" className="page-wrap">
        {title ? <h1>{title}</h1> : null}
        {children}
      </main>
    </div>
  );
}
