export function formatToken(amount: bigint, decimals: number, precision = 4): string {
  if (decimals <= 0) return amount.toString();
  const neg = amount < 0n;
  const abs = neg ? -amount : amount;
  const base = 10n ** BigInt(decimals);
  const whole = abs / base;
  const frac = abs % base;

  const fracStrRaw = frac.toString().padStart(decimals, "0");
  const trimmedFrac = fracStrRaw.replace(/0+$/, "");
  const shown = trimmedFrac.slice(0, Math.max(0, precision));
  const finalFrac = shown.length ? `.${shown}` : "";
  return `${neg ? "-" : ""}${whole.toString()}${finalFrac}`;
}

export function formatFiatUSD(n: number, maxFrac = 2): string {
  return `$${n.toFixed(maxFrac)}`;
}

export function naturUsdApprox(naturAmount: number, rateEnv?: string): string | null {
  const rate = rateEnv ? Number(rateEnv) : NaN;
  if (!isFinite(rate) || rate <= 0) return null;
  return formatFiatUSD(naturAmount * rate);
}

export function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

export type ShippingMethodId = "standard" | "expedited";

export const SHIPPING_PRICES: Record<ShippingMethodId, number> = {
  standard: 0,
  expedited: 2.5,
};

export function calcDiscountNATUR(code: string, itemsSubtotal: number) {
  if (code.trim().toUpperCase() === "WELCOME10") {
    return Math.min(itemsSubtotal * 0.1, 20);
  }
  return 0;
}

export function formatNatur(n: number) {
  return `${n.toFixed(2)} NATUR`;
}
