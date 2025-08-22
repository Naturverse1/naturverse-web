import { ReactNode } from "react";
import Breadcrumbs, { Crumb } from "./Breadcrumbs";

export default function Page({
  title,
  subtitle,
  breadcrumbs,
  children,
}: { title: string; subtitle?: string; breadcrumbs?: Crumb[]; children: ReactNode }) {
  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      {breadcrumbs && <Breadcrumbs items={breadcrumbs} />}
      <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">{title}</h1>
      {subtitle && <p className="mt-2 text-slate-600">{subtitle}</p>}
      <div className="mt-6">{children}</div>
    </main>
  );
}

