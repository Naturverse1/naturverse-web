export const setTitle = (t: string) => {
  if (typeof document !== "undefined") document.title = t ? `${t} · The Naturverse` : "The Naturverse";
};
