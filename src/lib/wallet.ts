export function getMetaMask() {
  try {
    // @ts-ignore
    const { ethereum } = window;
    if (!ethereum || !ethereum.isMetaMask) return null;
    return ethereum;
  } catch {
    return null;
  }
}
