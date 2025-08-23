import { ReactNode } from "react";
import Breadcrumbs from "./Breadcrumbs";

export default function Page({
  title,
  subtitle,
  children,
  crumbs = [],
}: { title: string; subtitle?: string; children: ReactNode; crumbs?: { href?: string; label: string }[] }) {
  return (
    <div className="page-wrap">
      <Breadcrumbs items={crumbs} />
      <main id="main" className="mx-auto max-w-6xl px-4 py-8">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">{title}</h1>
        {subtitle && <p className="mt-2 text-slate-600">{subtitle}</p>}
        <div className="mt-6">{children}</div>
      </main>
    </div>
  );
}

