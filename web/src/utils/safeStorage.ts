export function withSafeStorage() {
  const safeParse = <T>(val: string | null): T | null => {
    if (!val) return null;
    try {
      return JSON.parse(val) as T;
    } catch {
      return null;
    }
  };
  // Example shims used by cart/orders/avatars etc.
  // Replace direct JSON.parse(localStorage.getItem(...)) with these helpers over time.
  (window as any).__safeStorage = { safeParse };
}
