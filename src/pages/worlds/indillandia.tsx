import React from "react";
import WorldLayout from "../../components/WorldLayout";
import Breadcrumbs from "../../components/Breadcrumbs";

export default function IndillandiaPage() {
  return (
    <div className="page-wrap">
      <Breadcrumbs items={[{ href:"/", label:"Home" }, { href:"/worlds", label:"Worlds" }, { label:"Indillandia" }]} />
      <WorldLayout id="indillandia" />
    </div>
  );
}
