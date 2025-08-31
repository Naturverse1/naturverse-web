import { Contract, parseUnits, formatUnits } from 'ethers';
import { connectWallet } from './web3';

const TOKEN = import.meta.env.VITE_NATUR_TOKEN_CONTRACT as string;
const DECIMALS = Number(import.meta.env.VITE_NATUR_TOKEN_DECIMALS || '18');
const TREASURY = import.meta.env.VITE_NATUR_TREASURY as string;

const ERC20_ABI = [
  'function balanceOf(address) view returns (uint256)',
  'function transfer(address to, uint256 amount) returns (bool)',
  'event Transfer(address indexed from, address indexed to, uint256 value)'
];

export async function getNaturBalance(address: string) {
  const { provider } = await connectWallet(); // ensures chain
  const c = new Contract(TOKEN, ERC20_ABI, provider);
  const raw = await c.balanceOf(address);
  return { raw, formatted: formatUnits(raw, DECIMALS) };
}

export async function buyNavatarWithNatur(navatarId: string, amountNatur: number) {
  const { address, provider, signer } = await connectWallet();
  const c = new Contract(TOKEN, ERC20_ABI, signer);
  const amount = parseUnits(String(amountNatur), DECIMALS);

  // balance check (basic UX)
  const balRaw = await c.balanceOf(address);
  if (balRaw < amount) throw new Error('Insufficient $NATUR balance');

  const tx = await c.transfer(TREASURY, amount);
  const receipt = await tx.wait();

  // call server to verify and grant ownership
  const res = await fetch('/.netlify/functions/natur-verify', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      txHash: receipt?.hash || tx.hash,
      navatar_id: navatarId,
      amount_natur: String(amountNatur) // human units
    })
  });
  const json = await res.json();
  if (!res.ok || !json?.ok) throw new Error(json?.error || 'Verification failed');
  return json;
}
