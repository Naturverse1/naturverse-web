import React from "react";
import NvCard from "../../../components/NvCard";

const langs = [
  {
    slug: "thailandia",
    title: "Thailandia (Thai)",
    native: "ไทย",
    img: "/Languages/Mangolanguagemainthai.png",
  },
  {
    slug: "chinadia",
    title: "Chinadia (Mandarin)",
    native: "中文",
    img: "/Languages/Cranelanguagemainchina.png",
  },
  {
    slug: "indillandia",
    title: "Indillandia (Hindi)",
    native: "हिंदी",
    img: "/Languages/Genielanguagemainindi.png",
  },
  {
    slug: "brazilandia",
    title: "Brazilandia (Portuguese)",
    native: "Português",
    img: "/Languages/Birdlanguagemainbrazil.png",
  },
  {
    slug: "australandia",
    title: "Australandia (English)",
    native: "English",
    img: "/Languages/Koalalanguagemain.png",
  },
  {
    slug: "amerilandia",
    title: "Amerilandia (English)",
    native: "English",
    img: "/Languages/Owllanguagemain.png",
  },
];

export default function LanguagesPage() {
  return (
    <section>
      <h1>Languages</h1>
      <p>Phrasebooks for each kingdom.</p>
      <div className="nvgrid" style={{ marginTop: 16 }}>
        {langs.map((l) => (
          <NvCard
            key={l.slug}
            href={`/naturversity/languages/${l.slug}`}
            title={l.title}
            desc={`Native: ${l.native}`}
            imgSrc={l.img}
            imgAlt={l.title}
            imgW={512}
            imgH={512}
          />
        ))}
      </div>
    </section>
  );
}

