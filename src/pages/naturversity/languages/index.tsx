import Card from "../../../components/Card";
import Breadcrumbs from "../../../components/Breadcrumbs";
import { setTitle } from "../../_meta";

const langs = [
  {
    slug: "thailandia",
    name: "Thailandia (Thai)",
    native: "ไทย",
    img: "/Languages/Mangolanguagemainthai.png",
  },
  {
    slug: "chinadia",
    name: "Chinadia (Mandarin)",
    native: "中文",
    img: "/Languages/Cranelanguagemainchina.png",
  },
  {
    slug: "indillandia",
    name: "Indillandia (Hindi)",
    native: "हिंदी",
    img: "/Languages/Genielanguagemainindi.png",
  },
  {
    slug: "brazilandia",
    name: "Brazilandia (Portuguese)",
    native: "Português",
    img: "/Languages/Birdlanguagemainbrazil.png",
  },
  {
    slug: "australandia",
    name: "Australandia (English)",
    native: "English",
    img: "/Languages/Koalalanguagemain.png",
  },
  {
    slug: "amerilandia",
    name: "Amerilandia (English)",
    native: "English",
    img: "/Languages/Owllanguagemain.png",
  },
];

export default function LanguagesIndex() {
  setTitle("Languages");
  return (
    <div className="page-wrap">
      <Breadcrumbs
        items={[
          { href: "/", label: "Home" },
          { href: "/naturversity", label: "Naturversity" },
          { label: "Languages" },
        ]}
      />
        <main id="languages" data-turian="languages" style={{ maxWidth: 980, margin: "24px auto", padding: "0 16px" }}>
        <h1>Languages</h1>
        <p>Phrasebooks for each kingdom.</p>

        <div className="grid-cards" role="list">
          {langs.map((l) => (
            <Card
              key={l.slug}
              href={`/naturversity/languages/${l.slug}`}
              title={l.name}
              desc={`Native: ${l.native}`}
              imgSrc={l.img}
              imgAlt={l.name}
              badge="Phrasebook"
            />
          ))}
        </div>
      </main>
    </div>
  );
}

