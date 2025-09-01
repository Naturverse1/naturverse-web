// Lazy import ethers so builds work without the package present
let _ethers: typeof import('ethers') | null = null;
async function getEthers() {
  if (_ethers) return _ethers;
  try {
    _ethers = await (Function('return import("ethers")')() as Promise<
      typeof import('ethers')
    >);
    return _ethers;
  } catch {
    return null;
  }
}

const CHAIN_ID = Number(import.meta.env.VITE_NATUR_CHAIN_ID || '80002');
const CHAIN_HEX = '0x' + CHAIN_ID.toString(16);
const CHAIN_NAME = import.meta.env.VITE_NATUR_CHAIN_NAME || 'Polygon Amoy';
const RPC_URL = import.meta.env.VITE_NATUR_CHAIN_RPC || 'https://rpc-amoy.polygon.technology';
const CURRENCY = import.meta.env.VITE_NATUR_CHAIN_CURRENCY || 'POL';

export async function getInjected(): Promise<any | null> {
  const anyWindow = window as any;
  return anyWindow.ethereum ?? null;
}

export async function connectWallet(): Promise<{ address: string; provider: any; signer: any }> {
  const ethers = await getEthers();
  if (!ethers) throw new Error('Ethers not available');
  const injected = await getInjected();
  if (!injected) throw new Error('No wallet found. Please install MetaMask.');
  const provider = new ethers.BrowserProvider(injected);
  const accounts = await injected.request({ method: 'eth_requestAccounts' });
  const address = accounts[0];
  const signer = await provider.getSigner();
  await ensureChain(injected);
  return { address, provider, signer };
}

export async function ensureChain(eth: any) {
  try {
    await eth.request({ method: 'wallet_switchEthereumChain', params: [{ chainId: CHAIN_HEX }] });
  } catch (e: any) {
    if (e?.code === 4902 || ('' + e?.message).includes('Unrecognized chain ID')) {
      await eth.request({
        method: 'wallet_addEthereumChain',
        params: [{
          chainId: CHAIN_HEX,
          chainName: CHAIN_NAME,
          nativeCurrency: { name: CURRENCY, symbol: CURRENCY, decimals: 18 },
          rpcUrls: [RPC_URL],
          blockExplorerUrls: ['https://www.oklink.com/amoy']
        }]
      });
    } else {
      throw e;
    }
  }
}
