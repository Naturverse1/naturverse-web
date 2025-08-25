import { ReactNode } from "react";

/**
 * Scoped wrapper that confines blue theming to Zones pages only.
 * By rendering children inside a unique root element, we can
 * apply aggressive color overrides without affecting the rest
 * of the site.
 */
export default function ZonesBlueScope({ children }: { children: ReactNode }) {
  return <div id="zones-root">{children}</div>;
}

