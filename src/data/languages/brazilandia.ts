import { LangData } from "./types";

const BR: LangData = {
  slug: "brazilandia",
  name: "Brazilandia (Portuguese)",
  nativeName: "Português",
  flagPath: "/assets/brazilandia/flag.png",
  heroPath: "/assets/brazilandia/map.png",
  phrasebook: [
    { key: "Hello", native: "Olá" },
    { key: "Thank you", native: "Obrigado/Obrigada" },
    { key: "Goodbye", native: "Tchau" },
    { key: "Yes", native: "Sim" },
    { key: "No", native: "Não" },
  ],
  numbers: [
    { value: 1, native: "um" },
    { value: 2, native: "dois" },
    { value: 3, native: "três" },
    { value: 4, native: "quatro" },
    { value: 5, native: "cinco" },
    { value: 6, native: "seis" },
    { value: 7, native: "sete" },
    { value: 8, native: "oito" },
    { value: 9, native: "nove" },
    { value: 10, native: "dez" },
  ],
  colors: [
    { en: "Red", native: "vermelho" },
    { en: "Blue", native: "azul" },
    { en: "Green", native: "verde" },
    { en: "Yellow", native: "amarelo" },
  ],
};

export default BR;
