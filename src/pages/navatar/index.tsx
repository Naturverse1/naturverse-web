import { useMemo } from "react";
import Breadcrumbs from "../../components/Breadcrumbs";
import NavatarTabs from "../../components/NavatarTabs";
import NavatarCard from "../../components/NavatarCard";
import { loadActive } from "../../lib/localStorage";
import "../../styles/navatar.css";

export default function MyNavatarPage() {
  const activeNavatar = useMemo(() => loadActive<any>(), []);
  return (
    <main className="container">
      <Breadcrumbs items={[{ href: "/", label: "Home" }, { href: "/navatar", label: "Navatar" }]} />
      <h1 className="center">My Navatar</h1>
      <NavatarTabs />

      <div style={{ marginTop: 8 }}>
        <NavatarCard src={activeNavatar?.imageDataUrl} title={activeNavatar?.name || "Turian"} />
      </div>
    </main>
  );
}
