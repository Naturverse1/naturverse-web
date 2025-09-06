import { useMemo } from "react";
import { BlueBreadcrumbs } from "../../components/BlueBreadcrumbs";
import { PageShell } from "../../components/PageShell";
import { NavatarTabs } from "../../components/NavatarTabs";
import { NavatarCard } from "../../components/NavatarCard";
import { loadActive } from "../../lib/localStorage";
import "../../styles/navatar.css";

export default function MyNavatarPage() {
  const activeNavatar = useMemo(() => loadActive<any>(), []);
  return (
    <PageShell>
      <BlueBreadcrumbs items={[{ label: "Home", to: "/" }, { label: "Navatar", to: "/navatar" }]} />
      <h1 className="nv-heading">My Navatar</h1>
      <NavatarTabs active="home" />

      <div style={{ marginTop: 8 }}>
        <NavatarCard src={activeNavatar?.imageDataUrl} title={activeNavatar?.name || "Turian"} />
      </div>
    </PageShell>
  );
}
