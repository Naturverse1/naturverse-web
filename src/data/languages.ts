export type LangSlug = "thailandia" | "chinadia" | "indillandia" | "brazilandia" | "australandia";

type Phrasebook = {
  nativeName: string;        // localized script
  hello: { native: string; roman: string };
  thankyou: { native: string; roman: string };
  alphabetBasics: string[];
  numbers: { native: string; roman: string }[];
  thumb: string;             // /public/Languages/*.png
  poster: string;            // /public/Languages/*.png (secondary)
};

export const LANGUAGES: Record<LangSlug, Phrasebook> = {
  thailandia: {
    nativeName: "ไทย",
    hello: { native: "สวัสดี", roman: "sà-wàt-dee" },
    thankyou: { native: "ขอบคุณ", roman: "khàwp-khun" },
    alphabetBasics: ["ก (gor)", "ข (khor)", "ค (khor)", "ง (ngor)", "จ (jor)"],
    numbers: [
      { native: "๑", roman: "nùeng" }, { native: "๒", roman: "sŏng" },
      { native: "๓", roman: "săam" },  { native: "๔", roman: "sìi" },
      { native: "๕", roman: "hâa"  },  { native: "๖", roman: "hòk" },
      { native: "๗", roman: "jèt"  },  { native: "๘", roman: "bpàet" },
      { native: "๙", roman: "gâo"  },  { native: "๑๐", roman: "sìp" }
    ],
    thumb: "/Languages/Mangolanguagemainthai.png",
    poster: "/Languages/Turianlanguage.png"
  },
  chinadia: {
    nativeName: "中文",
    hello: { native: "你好", roman: "nǐ hǎo" },
    thankyou: { native: "谢谢", roman: "xièxie" },
    alphabetBasics: ["拼音 a", "拼音 o", "拼音 e", "拼音 i", "拼音 u"],
    numbers: [
      { native: "一", roman: "yī" }, { native: "二", roman: "èr" }, { native: "三", roman: "sān" },
      { native: "四", roman: "sì" }, { native: "五", roman: "wǔ" }, { native: "六", roman: "liù" },
      { native: "七", roman: "qī" }, { native: "八", roman: "bā" }, { native: "九", roman: "jiǔ" },
      { native: "十", roman: "shí" }
    ],
    thumb: "/Languages/Cranelanguagemainchina.png",
    poster: "/Languages/Turianlanguagechina.png"
  },
  indillandia: {
    nativeName: "हिंदी",
    hello: { native: "नमस्ते", roman: "namaste" },
    thankyou: { native: "धन्यवाद", roman: "dhanyavād" },
    alphabetBasics: ["अ a", "आ ā", "इ i", "ई ī", "उ u"],
    numbers: [
      { native: "१", roman: "ek" }, { native: "२", roman: "do" }, { native: "३", roman: "tīn" },
      { native: "४", roman: "chār" }, { native: "५", roman: "pānch" }, { native: "६", roman: "chhah" },
      { native: "७", roman: "sāt" }, { native: "८", roman: "āṭh" }, { native: "९", roman: "nau" },
      { native: "१०", roman: "das" }
    ],
    thumb: "/Languages/Genielanguagemainindi.png",
    poster: "/Languages/Turianlanguagehindi.png"
  },
  brazilandia: {
    nativeName: "Português",
    hello: { native: "Olá", roman: "olá" },
    thankyou: { native: "Obrigado/Obrigada", roman: "obrigado/obrigada" },
    alphabetBasics: ["a", "e", "i", "o", "u"],
    numbers: [
      { native: "1", roman: "um" }, { native: "2", roman: "dois" }, { native: "3", roman: "três" },
      { native: "4", roman: "quatro" }, { native: "5", roman: "cinco" }, { native: "6", roman: "seis" },
      { native: "7", roman: "sete" }, { native: "8", roman: "oito" }, { native: "9", roman: "nove" },
      { native: "10", roman: "dez" }
    ],
    thumb: "/Languages/Birdlanguagemainbrazil.png",
    poster: "/Languages/Turianlanguagebrazil.png"
  },
  australandia: {
    nativeName: "English",
    hello: { native: "Hello", roman: "hello" },
    thankyou: { native: "Thank you", roman: "thank you" },
    alphabetBasics: ["A", "B", "C", "D", "E"],
    numbers: [
      { native: "1", roman: "one" }, { native: "2", roman: "two" }, { native: "3", roman: "three" },
      { native: "4", roman: "four" }, { native: "5", roman: "five" }, { native: "6", roman: "six" },
      { native: "7", roman: "seven" }, { native: "8", roman: "eight" }, { native: "9", roman: "nine" },
      { native: "10", roman: "ten" }
    ],
    thumb: "/Languages/Koalalanguagemain.png",
    poster: "/Languages/Birdlanguageaustralandia.png"
  }
};
