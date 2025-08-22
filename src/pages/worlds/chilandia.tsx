import React from "react";
import WorldLayout from "./WorldLayout";
import Meta from "../../components/Meta";
import Page from "../../layouts/Page";
import { Breadcrumbs } from "../../components/Breadcrumbs";
import { Img } from "../../components/Img";

export default function Chilandia() {
  return (
    <Page>
      <Meta title="Chilandia — Naturverse" description="Learn about the Chilandia kingdom." url="https://thenaturverse.com/worlds/chilandia" />
      <Breadcrumbs />
      <WorldLayout title="Chilandia" mapSrc="/assets/chilandia/map.png" />
    </Page>
  );
}
