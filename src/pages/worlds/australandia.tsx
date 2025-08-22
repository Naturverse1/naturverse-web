import React from "react";
import WorldLayout from "./WorldLayout";
import Meta from "../../components/Meta";
import Page from "../../layouts/Page";
import { Breadcrumbs } from "../../components/Breadcrumbs";
import { Img } from "../../components/Img";

export default function Australandia() {
  return (
    <Page>
      <Meta title="Australandia — Naturverse" description="Learn about the Australandia kingdom." url="https://thenaturverse.com/worlds/australandia" />
      <Breadcrumbs />
      <WorldLayout title="Australandia" mapSrc="/assets/australandia/map.png" />
    </Page>
  );
}
