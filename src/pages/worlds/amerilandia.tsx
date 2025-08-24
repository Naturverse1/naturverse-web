import React from "react";
import WorldLayout from "../../components/WorldLayout";
import Breadcrumbs from "../../components/Breadcrumbs";

export default function AmerilandiaPage() {
  return (
    <div className="page-wrap kingdom-detail">
      <Breadcrumbs items={[{ href:"/", label:"Home" }, { href:"/worlds", label:"Worlds" }, { label:"Amerilandia" }]} />
      <WorldLayout id="amerilandia" />
    </div>
  );
}
