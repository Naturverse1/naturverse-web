import React from "react";
import Breadcrumbs from "../../components/Breadcrumbs";
import NavatarTabs from "../../components/NavatarTabs";
import { getCurrent } from "../../lib/navatar/store";

export default function NavatarMint() {
  const me = getCurrent();

  async function mint() {
    try {
      const r = await fetch("/.netlify/functions/navatar-mint", {
        method: "POST",
        headers: { "content-type":"application/json" },
        body: JSON.stringify({ navatar: me }),
      });
      const out = await r.json();
      if (out?.txUrl) window.open(out.txUrl, "_blank");
      else alert(out?.message || "Mint started");
    } catch (e: any) {
      alert(e?.message || "Mint failed");
    }
  }

  return (
    <main style={{ maxWidth:900, margin:"0 auto", padding:"24px 16px" }}>
      <Breadcrumbs className="breadcrumbs--blue" items={[
        { label: "Home", href: "/" },
        { label: "Navatar", href: "/navatar" },
        { label: "NFT / Mint" },
      ]}/>
      <h1>Mint your Navatar as an NFT</h1>
      <NavatarTabs />
      {me ? (
        <>
          <img src={me.img||""} alt={me.name} width={260} height={260} style={{ borderRadius:12, border:"1px solid #e5e7eb" }}/>
          <p style={{ marginTop:12 }}>Name: <b>{me.name}</b></p>
          <button className="btn btn-primary" onClick={mint}>Mint NFT</button>
        </>
      ) : (
        <p>No Navatar selected. Go to <a href="/navatar">My Navatar</a>.</p>
      )}
    </main>
  );
}
