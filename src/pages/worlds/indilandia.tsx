import React from "react";
import WorldLayout from "./WorldLayout";
import Meta from "../../components/Meta";
import Page from "../../layouts/Page";
import { Breadcrumbs } from "../../components/Breadcrumbs";
import { Img } from "../../components/Img";

export default function Indilandia() {
  return (
    <Page>
      <Meta title="Indilandia — Naturverse" description="Learn about the Indilandia kingdom." url="https://thenaturverse.com/worlds/indilandia" />
      <Breadcrumbs />
      <WorldLayout title="Indilandia" mapSrc="/assets/indilandia/map.png" />
    </Page>
  );
}
