import React from "react";
import { useParams } from "react-router-dom";
import NvImg from "../../../components/NvImg";

const meta: Record<string, {title:string; native:string; hero:string; secondary:string; lessons:{hello:string; thanks:string; alphabet:string; numbers:string[];} }> = {
  thailandia: {
    title: "Thailandia (Thai)",
    native: "ไทย",
    hero: "/Languages/Mangolanguagemainthai.png",
    secondary: "/Languages/Turianlanguage.png",
    lessons: {
      hello: "สวัสดี — sà-wàt-dee",
      thanks: "ขอบคุณ — khàwp-khun",
      alphabet: "ก (gor) • ข (khor) • ค (khor) • ง (ngor) • จ (jor)",
      numbers: ["๑ — nūeng","๒ — sŏng","๓ — sǎam","๔ — sìi","๕ — hâa","๖ — hòk","๗ — jèt","๘ — bpàet","๙ — găo","๑๐ — sìp"],
    },
  },
  chinadia: {
    title: "Chinadia (Mandarin)",
    native: "中文",
    hero: "/Languages/Cranelanguagemainchina.png",
    secondary: "/Languages/Turianlanguagechina.png",
    lessons: {
      hello: "你好 — nǐ hǎo",
      thanks: "谢谢 — xièxie",
      alphabet: "Basic pinyin: a o e i u ü; initials: b p m f …",
      numbers: ["一 yī","二 èr","三 sān","四 sì","五 wǔ","六 liù","七 qī","八 bā","九 jiǔ","十 shí"],
    },
  },
  indillandia: {
    title: "Indillandia (Hindi)",
    native: "हिंदी",
    hero: "/Languages/Genielanguagemainindi.png",
    secondary: "/Languages/Turianlanguagehindi.png",
    lessons: {
      hello: "नमस्ते — namaste",
      thanks: "धन्यवाद — dhanyavād",
      alphabet: "अ आ इ ई उ ऊ ए ऐ ओ औ",
      numbers: ["१ ek","२ do","३ tīn","४ chār","५ pānch","६ chhah","७ sāt","८ āṭh","९ nau","१० das"],
    },
  },
  brazilandia: {
    title: "Brazilandia (Portuguese)",
    native: "Português",
    hero: "/Languages/Birdlanguagemainbrazil.png",
    secondary: "/Languages/Turianlanguagebrazil.png",
    lessons: {
      hello: "Olá",
      thanks: "Obrigado/Obrigada",
      alphabet: "A B C Ç D E F G H I J L M N O P Q R S T U V X Z",
      numbers: ["um","dois","três","quatro","cinco","seis","sete","oito","nove","dez"],
    },
  },
  australandia: {
    title: "Australandia (English)",
    native: "English",
    hero: "/Languages/Koalalanguagemain.png",
    secondary: "/Languages/Turianlanguageenglish.png",
    lessons: {
      hello: "Hello",
      thanks: "Thank you",
      alphabet: "A B C D E F G … Z",
      numbers: ["one","two","three","four","five","six","seven","eight","nine","ten"],
    },
  },
  amerilandia: {
    title: "Amerilandia (English)",
    native: "English",
    hero: "/Languages/Owllanguagemain.png",
    secondary: "/Languages/Turianlanguageenglish.png",
    lessons: {
      hello: "Hello",
      thanks: "Thank you",
      alphabet: "A B C D E F G … Z",
      numbers: ["one","two","three","four","five","six","seven","eight","nine","ten"],
    },
  },
};

export default function LanguageDetail() {
  const { slug = "thailandia" } = useParams();
  const m = meta[slug] ?? meta.thailandia;

  return (
    <section>
      <h1>{m.title} — {m.native}</h1>
      <p>Learn greetings, alphabet basics, and common phrases for {m.title.split(" (")[0]}.</p>

      <div style={{display:"grid", gap:16, maxWidth:980}}>
        <NvImg src={m.hero} alt={m.title} width={1024} height={768} />
        <NvImg src={m.secondary} alt={`${m.title} secondary`} width={1024} height={768} />
      </div>

      <div style={{marginTop:24}}>
        <h3>Starter phrases</h3>
        <ul>
          <li><strong>Hello:</strong> {m.lessons.hello}</li>
          <li><strong>Thank you:</strong> {m.lessons.thanks}</li>
        </ul>

        <h3>Alphabet basics</h3>
        <p>{m.lessons.alphabet}</p>

        <h3>Count to ten</h3>
        <ol>{m.lessons.numbers.map((n) => <li key={n}>{n}</li>)}</ol>
      </div>
    </section>
  );
}

