let ethersPromise: Promise<typeof import("ethers")> | null = null;

/** Load ethers only on the client when needed. */
export async function getEthers() {
  if (typeof window === "undefined") {
    throw new Error("Wallet features require a browser environment.");
  }
  if (!ethersPromise) {
    const moduleName = 'ethers';
    // dynamic import so bundlers do not try to include ethers during build
    // @vite-ignore
    ethersPromise = import(moduleName);
  }
  return ethersPromise;
}

/** Convenience helper to create a BrowserProvider from window.ethereum */
export async function createProvider() {
  const { BrowserProvider } = await getEthers();
  return new BrowserProvider((window as any).ethereum);
}
