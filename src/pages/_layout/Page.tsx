import { PropsWithChildren } from "react";
import "../page.css";
export default function Page({ children }: PropsWithChildren) {
  return <main id="main" className="nv-page">{children}</main>;
}
