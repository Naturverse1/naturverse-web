import React from "react";
import WorldLayout from "./WorldLayout";
import Meta from "../../components/Meta";
import Page from "../../layouts/Page";
import { Breadcrumbs } from "../../components/Breadcrumbs";
import { Img } from "../../components/Img";

export default function Amerilandia() {
  return (
    <Page>
      <Meta title="Amerilandia — Naturverse" description="Learn about the Amerilandia kingdom." url="https://thenaturverse.com/worlds/amerilandia" />
      <Breadcrumbs />
      <WorldLayout title="Amerilandia" mapSrc="/assets/amerilandia/map.png" />
    </Page>
  );
}
