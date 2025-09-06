import { useMemo } from "react";
import Breadcrumbs from "../../components/Breadcrumbs";
import NavatarTabs from "../../components/NavatarTabs";
import { loadActive } from "../../lib/localStorage";

export default function MyNavatarPage() {
  const active = useMemo(() => loadActive<any>(), []);
  return (
    <main className="container">
      <Breadcrumbs items={[{ href: "/", label: "Home" }, { href: "/navatar", label: "Navatar" }]} />
      <h1 className="center">My Navatar</h1>
      <NavatarTabs active="home" />

      {active?.imageDataUrl ? (
        <div className="navatar-card">
          <div className="img">
            <img src={active.imageDataUrl} alt={active.name || "My Navatar"} />
          </div>
          <p className="center" style={{ fontWeight: 700, marginTop: 8 }}>
            {active.name || "Turian"}
          </p>
        </div>
      ) : (
        <p className="center" style={{ marginTop: 16 }}>
          No Navatar yet — <a href="/navatar/pick">Pick</a>, <a href="/navatar/upload">Upload</a>, or <a href="/navatar/generate">Generate</a>.
        </p>
      )}
    </main>
  );
}

