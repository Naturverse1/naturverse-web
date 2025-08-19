import type { ReactNode } from "react";

export function Section({
  title,
  children,
}: {
  title: string;
  children?: ReactNode;
}) {
  return (
    <main style={{ padding: 24, lineHeight: 1.6 }}>
      <h1>{title}</h1>
      <p>{children}</p>
    </main>
  );
}
