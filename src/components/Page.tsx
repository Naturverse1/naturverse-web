import { ReactNode } from "react";
import { Breadcrumbs } from "./Breadcrumbs";

export default function Page({
  title,
  subtitle,
  children,
}: { title: string; subtitle?: string; children: ReactNode }) {
  return (
    <main id="main" className="mx-auto max-w-6xl px-4 py-8">
      <Breadcrumbs />
      <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">{title}</h1>
      {subtitle && <p className="mt-2 text-slate-600">{subtitle}</p>}
      <div className="mt-6">{children}</div>
    </main>
  );
}

