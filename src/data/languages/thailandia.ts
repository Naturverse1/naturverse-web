import { LangData } from "./types";

const TH: LangData = {
  slug: "thailandia",
  name: "Thailandia (Thai)",
  nativeName: "ไทย",
  flagPath: "/assets/thailandia/flag.png",
  heroPath: "/assets/thailandia/ThailandiaMap.png",
  phrasebook: [
    { key: "Hello", native: "สวัสดี", roman: "sawasdee" },
    { key: "Thank you", native: "ขอบคุณ", roman: "khob khun" },
    { key: "Goodbye", native: "ลาก่อน", roman: "laa gòn" },
    { key: "Yes", native: "ใช่", roman: "chai" },
    { key: "No", native: "ไม่", roman: "mai" },
  ],
  numbers: [
    { value: 1, native: "หนึ่ง", roman: "nèung" },
    { value: 2, native: "สอง", roman: "sǒng" },
    { value: 3, native: "สาม", roman: "săam" },
    { value: 4, native: "สี่", roman: "sìi" },
    { value: 5, native: "ห้า", roman: "hâa" },
    { value: 6, native: "หก", roman: "hòk" },
    { value: 7, native: "เจ็ด", roman: "jèt" },
    { value: 8, native: "แปด", roman: "bpàet" },
    { value: 9, native: "เก้า", roman: "gâo" },
    { value: 10, native: "สิบ", roman: "sìp" },
  ],
  colors: [
    { en: "Red", native: "แดง", roman: "daeng" },
    { en: "Blue", native: "น้ำเงิน/ฟ้า", roman: "nam-ngern/fáa" },
    { en: "Green", native: "เขียว", roman: "khǐao" },
    { en: "Yellow", native: "เหลือง", roman: "lʉ̌ang" },
  ],
  notes: ["Thai uses its own script; romanization here is approximate."],
};

export default TH;
