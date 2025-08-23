import { LangData } from "./types";

const AU: LangData = {
  slug: "australandia",
  name: "Australandia (English)",
  nativeName: "English",
  flagPath: "/assets/australandia/flag.png",
  heroPath: "/assets/australandia/map.png",
  phrasebook: [
    { key: "Hello", native: "Hello" },
    { key: "Thank you", native: "Thank you" },
    { key: "Goodbye", native: "Goodbye" },
    { key: "Yes", native: "Yes" },
    { key: "No", native: "No" },
  ],
  numbers: [
    { value: 1, native: "one" },
    { value: 2, native: "two" },
    { value: 3, native: "three" },
    { value: 4, native: "four" },
    { value: 5, native: "five" },
    { value: 6, native: "six" },
    { value: 7, native: "seven" },
    { value: 8, native: "eight" },
    { value: 9, native: "nine" },
    { value: 10, native: "ten" },
  ],
  colors: [
    { en: "Red", native: "red" },
    { en: "Blue", native: "blue" },
    { en: "Green", native: "green" },
    { en: "Yellow", native: "yellow" },
  ],
};

export default AU;
