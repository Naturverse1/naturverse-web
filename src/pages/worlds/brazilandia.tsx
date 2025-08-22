import React from "react";
import WorldLayout from "./WorldLayout";
import Meta from "../../components/Meta";
import Page from "../../layouts/Page";
import { Breadcrumbs } from "../../components/Breadcrumbs";
import { Img } from "../../components/Img";

export default function Brazilandia() {
  return (
    <Page>
      <Meta title="Brazilandia — Naturverse" description="Learn about the Brazilandia kingdom." url="https://thenaturverse.com/worlds/brazilandia" />
      <Breadcrumbs />
      <WorldLayout title="Brazilandia" mapSrc="/assets/brazilandia/map.png" />
    </Page>
  );
}
