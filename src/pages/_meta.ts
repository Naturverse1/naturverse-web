export const setTitle = (t: string) => {
  if (typeof document !== "undefined") document.title = t ? `${t} · Naturverse` : "Naturverse";
};
