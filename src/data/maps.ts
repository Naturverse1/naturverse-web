// Central map manifest. Keys are world slugs.
const V = "v1"; // bump when you replace images
export const MAPS: Record<string, string> = {
  thailandia:   `/Mapsmain/Thailandiamapmain.png?${V}`,
  chinadia:     `/Mapsmain/Chilandiamapmain.png?${V}`,
  indillandia:  `/Mapsmain/Indilandiamapmain.png?${V}`,
  brazilandia:  `/Mapsmain/Brazilandiamapmain.png?${V}`,
  australandia: `/Mapsmain/Australandiamapmain.png?${V}`,
  amerilandia:  `/Mapsmain/Amerilandiamapmain.png?${V}`,
};

export const mapFor = (slug: string) => MAPS[slug] ?? MAPS.thailandia;
