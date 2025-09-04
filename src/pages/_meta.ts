import { BRAND_NAME } from "@/lib/brand";

export const setTitle = (t: string) => {
  if (typeof document !== "undefined") document.title = t ? `${t} · ${BRAND_NAME}` : BRAND_NAME;
};
