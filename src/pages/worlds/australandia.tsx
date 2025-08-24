import React from "react";
import WorldLayout from "../../components/WorldLayout";
import Breadcrumbs from "../../components/Breadcrumbs";

export default function AustralandiaPage() {
  return (
    <div className="page-wrap kingdom-detail">
      <Breadcrumbs items={[{ href:"/", label:"Home" }, { href:"/worlds", label:"Worlds" }, { label:"Australandia" }]} />
      <WorldLayout id="australandia" />
    </div>
  );
}
