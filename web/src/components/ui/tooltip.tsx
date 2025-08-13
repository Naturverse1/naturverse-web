import * as React from 'react';
type Props = { children: React.ReactNode };
export function TooltipProvider({ children }: Props) {
  return <>{children}</>;
}
export function Tooltip({ children }: Props) {
  return <>{children}</>;
}
export function TooltipTrigger({ children }: Props) {
  return <span data-tooltip-trigger>{children}</span>;
}
export function TooltipContent({ children }: Props) {
  return (
    <span data-tooltip-content style={{ display: 'none' }}>
      {children}
    </span>
  );
}
export default Tooltip;
