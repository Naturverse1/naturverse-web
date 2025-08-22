import React from "react";
import WorldLayout from "./WorldLayout";
import Meta from "../../components/Meta";
import Page from "../../layouts/Page";
import { Breadcrumbs } from "../../components/Breadcrumbs";
import { Img } from "../../components/Img";

export default function Thailandia() {
  return (
    <Page>
      <Meta title="Thailandia — Naturverse" description="Learn about the Thailandia kingdom." url="https://thenaturverse.com/worlds/thailandia" />
      <Breadcrumbs />
      <WorldLayout title="Thailandia" mapSrc="/assets/thailandia/map.png" />
    </Page>
  );
}
