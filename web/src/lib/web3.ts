// web/src/lib/web3.ts

// Keep types simple for Netlify's TS:
// (Template literal types like `${string}` can break older TS)
export type Address = string;

declare global {
  interface Window {
    ethereum?: {
      isMetaMask?: boolean;
      request: (args: { method: string; params?: any[] }) => Promise<any>;
    };
  }
}

export function hasWallet() {
  return typeof window !== "undefined" && !!window.ethereum;
}

export async function connectWallet(): Promise<Address> {
  if (!hasWallet()) throw new Error("No wallet detected");
  const accounts = await window.ethereum!.request({
    method: "eth_requestAccounts",
  });
  const addr: Address = accounts?.[0];
  if (!addr) throw new Error("No account returned");
  return addr;
}

/** Optional helper to ask the wallet to sign a plain text message */
export async function signMessage(message: string): Promise<string> {
  if (!hasWallet()) throw new Error("No wallet detected");
  const [addr] = await window.ethereum!.request({ method: "eth_accounts" });
  if (!addr) throw new Error("No connected account");
  // personal_sign expects params [data, address]
  const sig = await window.ethereum!.request({
    method: "personal_sign",
    params: [message, addr],
  });
  return sig as string;
}

/** Tiny UI helper */
export function shortAddress(addr: Address) {
  return addr ? `${addr.slice(0, 6)}…${addr.slice(-4)}` : "";
}
