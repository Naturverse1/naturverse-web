// Minimal web3 helpers that use window.ethereum directly (no external libs)

declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: any[] }) => Promise<any>;
      isMetaMask?: boolean;
    };
  }
}

type Hex = `0x${string}`;

export const NATUR = {
  // TODO: put your real values here when ready
  CHAIN_ID_HEX: '0xaa36a7', // Sepolia testnet; change to your target
  TOKEN_ADDRESS: '0x0000000000000000000000000000000000000000' as Hex, // <-- set real NATUR token
  MERCHANT_TREASURY: '0x0000000000000000000000000000000000000000' as Hex, // <-- set your treasury
  DECIMALS: 18,
};

export function hasProvider() {
  return typeof window !== 'undefined' && !!window.ethereum;
}

export async function connectWallet(): Promise<string> {
  if (!hasProvider()) throw new Error('No wallet detected');
  const [addr] = await window.ethereum!.request({ method: 'eth_requestAccounts' });
  return addr;
}

export async function currentAccount(): Promise<string | null> {
  if (!hasProvider()) return null;
  const accts: string[] = await window.ethereum!.request({ method: 'eth_accounts' });
  return accts[0] ?? null;
}

export async function ensureChain(chainIdHex = NATUR.CHAIN_ID_HEX) {
  if (!hasProvider()) return;
  const current: string = await window.ethereum!.request({ method: 'eth_chainId' });
  if (current.toLowerCase() === chainIdHex.toLowerCase()) return;
  try {
    await window.ethereum!.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: chainIdHex }],
    });
  } catch (err: any) {
    // If chain is missing, you can add it here (fill RPC/params for your chain)
    if (err?.code === 4902) {
      throw new Error('Target chain not added to wallet. Please add it in MetaMask.');
    }
    throw err;
  }
}

/** ----- tiny ABI encoding utils (ERC20 only) ----- **/

function strip0x(s: string) {
  return s.startsWith('0x') ? s.slice(2) : s;
}

function leftPadToBytes(hex: string, bytes: number) {
  return hex.padStart(bytes * 2, '0');
}

function toUint256Hex(n: bigint) {
  return leftPadToBytes(n.toString(16), 32);
}

function addressToHex32(addr: string) {
  return leftPadToBytes(strip0x(addr).toLowerCase(), 32);
}

/** keccak256("transfer(address,uint256)").slice(0,4) = 0xa9059cbb */
const ERC20_TRANSFER_SELECTOR: Hex = '0xa9059cbb';

export function parseUnits(amount: string | number, decimals = NATUR.DECIMALS): bigint {
  const [whole, frac = ''] = String(amount).split('.');
  const fracPadded = (frac + '0'.repeat(decimals)).slice(0, decimals);
  return BigInt(whole) * BigInt(10 ** decimals) + BigInt(fracPadded || '0');
}

export function formatUnits(value: bigint, decimals = NATUR.DECIMALS): string {
  const neg = value < 0n ? '-' : '';
  const v = value < 0n ? -value : value;
  const d = BigInt(10) ** BigInt(decimals);
  const whole = v / d;
  const frac = v % d;
  const fracStr = frac.toString().padStart(decimals, '0').replace(/0+$/, '');
  return neg + whole.toString() + (fracStr ? '.' + fracStr : '');
}

export function encodeErc20Transfer(to: string, amount: bigint): Hex {
  const data =
    ERC20_TRANSFER_SELECTOR +
    addressToHex32(to) +
    toUint256Hex(amount);
  return `0x${data.replace(/^0x/, '')}` as Hex;
}

export async function sendErc20Transfer(
  token: string,
  to: string,
  amount: bigint,
  from?: string
): Promise<Hex> {
  await ensureChain();
  const account = from || (await currentAccount()) || (await connectWallet());
  const tx = await window.ethereum!.request({
    method: 'eth_sendTransaction',
    params: [
      {
        from: account,
        to: token,
        value: '0x0',
        data: encodeErc20Transfer(to, amount),
      },
    ],
  });
  return tx as Hex;
}

export async function erc20BalanceOf(token: string, owner: string): Promise<bigint> {
  // function balanceOf(address) -> (uint256)
  const selector = '0x70a08231';
  const data = (selector + addressToHex32(owner)) as Hex;
  const res: string = await window.ethereum!.request({
    method: 'eth_call',
    params: [{ to: token, data }, 'latest'],
  });
  return BigInt(res);
}

