import React from "react";
import Breadcrumbs from "../../components/Breadcrumbs";
import NavatarTabs from "../../components/NavatarTabs";
import { PUBLIC_NAVATARS } from "../../lib/navatar/data";
import { setCurrent } from "../../lib/navatar/store";

export default function NavatarPick() {
  function get(id: string) {
    const nav = PUBLIC_NAVATARS.find(n => n.id === id);
    if (!nav) return;
    setCurrent(nav);
    alert("Added to My Navatar ✓");
    window.location.href = "/navatar";
  }

  return (
    <main style={{ maxWidth:1100, margin:"0 auto", padding:"24px 16px" }}>
      <Breadcrumbs className="breadcrumbs--blue" items={[
        { label: "Home", href: "/" },
        { label: "Navatar", href: "/navatar" },
        { label: "Pick" },
      ]}/>
      <h1>Pick a Navatar</h1>
      <NavatarTabs />
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))", gap:12 }}>
        {PUBLIC_NAVATARS.map(nav => (
          <div key={nav.id} style={{ border:"1px solid #e5e7eb", borderRadius:12, padding:12 }}>
            <img src={nav.img} alt={nav.name} style={{ width:"100%", borderRadius:8 }}/>
            <div style={{ fontWeight:700, marginTop:8 }}>{nav.name}</div>
            <div style={{ opacity:0.8, fontSize:12 }}>{nav.rarity || "Common"}</div>
            <button className="btn btn-primary" style={{ marginTop:8 }} onClick={() => get(nav.id)}>Get</button>
          </div>
        ))}
      </div>
    </main>
  );
}
