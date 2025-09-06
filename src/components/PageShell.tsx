import { ReactNode } from "react";

export function PageShell({ children }: { children: ReactNode }) {
  return <main className="container">{children}</main>;
}
