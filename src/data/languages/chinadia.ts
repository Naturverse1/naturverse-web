import { LangData } from "./types";

const CN: LangData = {
  slug: "chinadia",
  name: "Chinadia (Mandarin)",
  nativeName: "中文",
  flagPath: "/assets/chinadia/flag.png",
  heroPath: "/assets/chinadia/map.png",
  phrasebook: [
    { key: "Hello", native: "你好", roman: "nǐ hǎo" },
    { key: "Thank you", native: "谢谢", roman: "xièxie" },
    { key: "Goodbye", native: "再见", roman: "zàijiàn" },
    { key: "Yes", native: "是/对", roman: "shì/duì" },
    { key: "No", native: "不是", roman: "bú shì" },
  ],
  numbers: [
    { value: 1, native: "一", roman: "yī" },
    { value: 2, native: "二", roman: "èr" },
    { value: 3, native: "三", roman: "sān" },
    { value: 4, native: "四", roman: "sì" },
    { value: 5, native: "五", roman: "wǔ" },
    { value: 6, native: "六", roman: "liù" },
    { value: 7, native: "七", roman: "qī" },
    { value: 8, native: "八", roman: "bā" },
    { value: 9, native: "九", roman: "jiǔ" },
    { value: 10, native: "十", roman: "shí" },
  ],
  colors: [
    { en: "Red", native: "红色", roman: "hóng sè" },
    { en: "Blue", native: "蓝色", roman: "lán sè" },
    { en: "Green", native: "绿色", roman: "lǜ sè" },
    { en: "Yellow", native: "黄色", roman: "huáng sè" },
  ],
  notes: ["Simplified characters shown."],
};

export default CN;
