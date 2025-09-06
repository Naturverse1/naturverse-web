import { useEffect, useState } from "react";
import Breadcrumbs from "../../components/Breadcrumbs";
import NavatarTabs from "../../components/NavatarTabs";
import CharacterCard from "../../components/CharacterCard";
import { loadActive } from "../../lib/navatar/storage";
import type { Navatar } from "../../lib/navatar/types";
import "./navatarPage.css";

export default function NavatarHome() {
  const [me, setMe] = useState<Navatar|null>(null);
  useEffect(()=>{ setMe(loadActive()); },[]);

  return (
    <div className="nv-wrap">
      <h1 className="nv-title">My Navatar</h1>
      <Breadcrumbs items={[{href:"/",label:"Home"},{href:"/navatar",label:"Navatar"},{label:"My Navatar"}]} />
      <NavatarTabs/>
      <section className="nv-body">
        <CharacterCard navatar={me}/>
        <p className="nv-help">
          {me ? "Set Active or make merch from tabs above."
              : "No Navatar yet — pick, upload, or generate one above."}
        </p>
      </section>
    </div>
  );
}
