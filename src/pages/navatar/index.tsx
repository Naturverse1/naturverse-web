import Breadcrumbs from "../../components/Breadcrumbs";
import NavatarTabs from "../../components/NavatarTabs";
import NavatarCard from "../../components/NavatarCard";
import { getActive } from "../../lib/navatar/storage";

export default function MyNavatar() {
  const active = getActive();
  return (
    <div className="container">
      <Breadcrumbs items={[{ href: "/", label: "Home" }, { label: "Navatar" }]} />
      <h1 className="center">My Navatar</h1>
      <NavatarTabs />
      <div className="center">
        <NavatarCard n={active} />
        {!active && <p>No Navatar yet — Pick, Upload, or Generate above.</p>}
      </div>
      <style>{`.center{text-align:center}`}</style>
    </div>
  );
}
