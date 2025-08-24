import { useParams } from "react-router-dom";
import "../../../components/card.css";

type Content = {
  hello: string;
  thankyou: string;
  alphabet: string[];
  count: Array<[number, string, string]>;
  hero: string;          // main image
  secondary: string;     // Turian secondary image
};

const DATA: Record<string, Content> = {
  thailandia: {
    hello: "สวัสดี — să-wàt-dee",
    thankyou: "ขอบคุณ — khâwp-khun",
    alphabet: ["ก (gor)", "ข (khor)", "ค (khor)", "ง (ngor)", "จ (jor)"],
    count: [
      [1, "๑", "nûeng"], [2, "๒", "sǒng"], [3, "๓", "sǎam"], [4, "๔", "sìi"],
      [5, "๕", "hâa"], [6, "๖", "hòk"], [7, "๗", "jèt"], [8, "๘", "bpàet"],
      [9, "๙", "gâo"], [10, "๑๐", "sìp"],
    ],
    hero: "/Languages/Mangolanguagemainthai.png",
    secondary: "/Languages/Turianlanguage.png",
  },
  chinadia: {
    hello: "欢迎 — huānyíng",
    thankyou: "谢谢 — xièxie",
    alphabet: ["你 (nǐ)", "好 (hǎo)", "学 (xué)", "习 (xí)", "文 (wén)"],
    count: [[1,"一","yī"],[2,"二","èr"],[3,"三","sān"],[4,"四","sì"],[5,"五","wǔ"],[6,"六","liù"],[7,"七","qī"],[8,"八","bā"],[9,"九","jiǔ"],[10,"十","shí"]],
    hero: "/Languages/Cranelanguagemainchina.png",
    secondary: "/Languages/Turianlanguagechina.png",
  },
  indillandia: {
    hello: "नमस्ते — namaste",
    thankyou: "धन्यवाद — dhanyavād",
    alphabet: ["अ a", "आ ā", "इ i", "ई ī", "उ u"],
    count: [[1,"१","ek"],[2,"२","do"],[3,"३","tīn"],[4,"४","chār"],[5,"५","pāñch"],[6,"६","chhah"],[7,"७","sāt"],[8,"८","āṭh"],[9,"९","nau"],[10,"१०","das"]],
    hero: "/Languages/Genielanguagemainindi.png",
    secondary: "/Languages/Turianlanguagehindi.png",
  },
  brazilandia: {
    hello: "Olá — hello",
    thankyou: "Obrigado/Obrigada — thank you",
    alphabet: ["A", "B", "C", "D", "E"],
    count: [[1,"1","um"],[2,"2","dois"],[3,"3","três"],[4,"4","quatro"],[5,"5","cinco"],[6,"6","seis"],[7,"7","sete"],[8,"8","oito"],[9,"9","nove"],[10,"10","dez"]],
    hero: "/Languages/Birdlanguagemainbrazil.png",
    secondary: "/Languages/Turianlanguagebrazil.png",
  },
  australandia: {
    hello: "Welcome — g’day",
    thankyou: "Thanks — cheers",
    alphabet: ["A", "B", "C", "D", "E"],
    count: [[1,"1","one"],[2,"2","two"],[3,"3","three"],[4,"4","four"],[5,"5","five"],[6,"6","six"],[7,"7","seven"],[8,"8","eight"],[9,"9","nine"],[10,"10","ten"]],
    hero: "/Languages/Koalalanguagemain.png",
    secondary: "/Languages/Turianlanguageenglish.png",
  },
  amerilandia: {
    hello: "Welcome",
    thankyou: "Thank you",
    alphabet: ["A", "B", "C", "D", "E"],
    count: [[1,"1","one"],[2,"2","two"],[3,"3","three"],[4,"4","four"],[5,"5","five"],[6,"6","six"],[7,"7","seven"],[8,"8","eight"],[9,"9","nine"],[10,"10","ten"]],
    hero: "/Languages/Owllanguagemain.png",
    secondary: "/Languages/Turianlanguageenglish.png",
  },
};

export default function LanguageDetail() {
  const { slug = "thailandia" } = useParams<{ slug: string }>();
  const d = DATA[slug] ?? DATA.thailandia;

  return (
    <main style={{ maxWidth: 860, margin: "24px auto", padding: "0 16px" }}>
      <h1 style={{ marginBottom: 4 }}>{titleFor(slug)}</h1>
      <p>Learn greetings, alphabet basics, and common phrases for {titleFor(slug, true)}.</p>

      <img className="lang-hero" src={d.hero} alt="" />
      <section style={{ marginTop: 20 }}>
        <h3>Starter phrases</h3>
        <ul>
          <li><strong>Hello:</strong> {d.hello}</li>
          <li><strong>Thank you:</strong> {d.thankyou}</li>
        </ul>

        <h3>Alphabet basics</h3>
        <p>{d.alphabet.join(" · ")}</p>

        <h3>Count to ten</h3>
        <ol>
          {d.count.map(([n, glyph, say]) => (
            <li key={n}>
              <strong>{n}.</strong> {glyph} — <em>{say}</em>
            </li>
          ))}
        </ol>
      </section>

      <img className="lang-hero" src={d.secondary} alt="" style={{ marginTop: 16 }} />
    </main>
  );
}

function titleFor(slug: string, short = false) {
  const m: Record<string, string> = {
    thailandia: "Thailandia (Thai)",
    chinadia: "Chinadia (Mandarin)",
    indillandia: "Indillandia (Hindi)",
    brazilandia: "Brazilandia (Portuguese)",
    australandia: "Australandia (English)",
    amerilandia: "Amerilandia (English)",
  };
  const t = m[slug] ?? "Thailandia (Thai)";
  return short ? t.split(" (")[0] : t;
}

