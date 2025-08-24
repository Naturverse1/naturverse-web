import React from "react";
import WorldLayout from "../../components/WorldLayout";
import Breadcrumbs from "../../components/Breadcrumbs";

export default function ChilandiaPage() {
  return (
    <div className="page-wrap kingdom-detail">
      <Breadcrumbs items={[{ href:"/", label:"Home" }, { href:"/worlds", label:"Worlds" }, { label:"Chilandia" }]} />
      <WorldLayout id="chilandia" />
    </div>
  );
}
