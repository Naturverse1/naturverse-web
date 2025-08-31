export type Bundle = {
  id: string;
  title: string;
  skus: string[];
  couponEnv: "STRIPE_BUNDLE_COUPON_ID"; // env var name holding coupon id
  blurb?: string;
  savePct?: number;
};

export const BUNDLES: Bundle[] = [
  {
    id: "starter-plushie",
    title: "Starter + Plushie",
    skus: ["breathwork-starter", "naturverse-plushie"],
    couponEnv: "STRIPE_BUNDLE_COUPON_ID",
    blurb: "Mind & mascot combo",
    savePct: 10,
  },
  {
    id: "style-shirt-stickers",
    title: "Style + Tee + Stickers",
    skus: ["navatar-style-kit", "naturverse-tshirt", "sticker-pack"],
    couponEnv: "STRIPE_BUNDLE_COUPON_ID",
    blurb: "Drip + swag + flair",
    savePct: 15,
  }
];

export function bundlesForCart(ids: string[]) {
  const set = new Set(ids);
  return BUNDLES.filter(b => b.skus.some(s => !set.has(s))); // suggest if at least one is missing
}

export function cartContainsBundle(ids: string[]) {
  return BUNDLES.some(b => b.skus.every(s => ids.includes(s)));
}
