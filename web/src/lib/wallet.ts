import { ethers } from "ethers";
import { ERC20_ABI } from "./erc20";

const CHAIN_ID_HEX = (() => {
  const n = Number(import.meta.env.VITE_CHAIN_ID);
  return "0x" + n.toString(16);
})();

export async function getBrowserProvider(): Promise<ethers.BrowserProvider> {
  const eth = (window as any).ethereum;
  if (!eth) throw new Error("MetaMask not found");
  return new ethers.BrowserProvider(eth);
}

export async function ensureCorrectChain() {
  const eth = (window as any).ethereum;
  if (!eth) throw new Error("MetaMask not found");
  const desired = CHAIN_ID_HEX;
  try {
    await eth.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: desired }],
    });
  } catch (err: any) {
    if (err?.code === 4902) {
      const rpcUrl = import.meta.env.VITE_RPC_URL;
      const chainId = Number(import.meta.env.VITE_CHAIN_ID);
      await eth.request({
        method: "wallet_addEthereumChain",
        params: [
          {
            chainId: desired,
            chainName: `Natur Testnet (${chainId})`,
            rpcUrls: [rpcUrl],
            nativeCurrency: { name: "Test Gas", symbol: "TETH", decimals: 18 },
          },
        ],
      });
      await eth.request({ method: "wallet_switchEthereumChain", params: [{ chainId: desired }] });
    } else {
      throw err;
    }
  }
}

export async function connectWallet(): Promise<{
  address: string;
  provider: ethers.BrowserProvider;
  signer: ethers.Signer;
}> {
  const provider = await getBrowserProvider();
  const accounts: string[] = await provider.send("eth_requestAccounts", []);
  const signer = await provider.getSigner();
  const address = ethers.getAddress(accounts[0] || (await signer.getAddress()));
  return { address, provider, signer };
}

export async function getNativeBalance(provider: ethers.BrowserProvider, address: string) {
  const bal = await provider.getBalance(address);
  return Number(ethers.formatEther(bal));
}

export async function getNaturContract(providerOrSigner: ethers.Provider | ethers.Signer) {
  const token = import.meta.env.VITE_NATUR_TOKEN as string;
  if (!token) throw new Error("VITE_NATUR_TOKEN not set");
  return new ethers.Contract(token, ERC20_ABI, providerOrSigner);
}

export async function getNaturMeta(provider: ethers.Provider) {
  const erc20 = await getNaturContract(provider);
  const [decimals, symbol] = await Promise.all([erc20.decimals(), erc20.symbol()]);
  return { decimals: Number(decimals), symbol: String(symbol) };
}

export async function getNaturBalance(provider: ethers.Provider, address: string) {
  const erc20 = await getNaturContract(provider);
  const bal = await erc20.balanceOf(address);
  return bal;
}

export async function transferNatur(signer: ethers.Signer, to: string, amountNatur: number) {
  const erc20 = await getNaturContract(signer);
  const { decimals } = await getNaturMeta(await signer.provider!);
  const value = ethers.parseUnits(amountNatur.toString(), decimals);
  const tx = await erc20.transfer(to, value);
  return tx;
}
