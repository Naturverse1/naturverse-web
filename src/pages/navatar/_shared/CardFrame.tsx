import { ReactNode } from 'react';
export function CardFrame({ children }: { children: ReactNode }) {
  return <div className="cardFrame">{children}</div>;
}
