import React from "react";
import WorldLayout from "../../components/WorldLayout";
import Breadcrumbs from "../../components/Breadcrumbs";

export default function ThailandiaPage() {
  return (
    <div className="page-wrap kingdom-detail">
      <Breadcrumbs items={[{ href:"/", label:"Home" }, { href:"/worlds", label:"Worlds" }, { label:"Thailandia" }]} />
      <WorldLayout id="thailandia" />
    </div>
  );
}
