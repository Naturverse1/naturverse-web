import { ReactNode } from "react";
import NavBar from "./NavBar";

type Props = { children: ReactNode; title?: ReactNode; breadcrumbs?: ReactNode };

export default function Layout({ children, title, breadcrumbs }: Props){
  return (
    <>
      <header className="nv-sitebar">
        <NavBar />
      </header>

      <main className="nv-container" style={{ paddingTop: 18, paddingBottom: 40 }}>
        {breadcrumbs ? <div className="nv-breadcrumbs">{breadcrumbs}</div> : null}
        {title ? <h1 style={{ marginTop: 0 }}>{title}</h1> : null}
        {children}
      </main>

      <footer className="nv-container" style={{ paddingTop: 28, paddingBottom: 36, color: "var(--nv-muted)" }}>
        © 2025 Naturverse
      </footer>
    </>
  );
}
