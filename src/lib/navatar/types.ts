export type Navatar = {
  id: string;
  name?: string;
  imageDataUrl?: string; // active image
  createdAt: number;
};

export function newId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}
