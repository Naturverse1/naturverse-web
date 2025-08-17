export type Web3Config = {
  chainIdHex: string;
  tokenAddress: 0x${string};
  tokenDecimals: number;
  treasury: 0x${string};
  usdPerNatur: number;
};
export function getWeb3Config(): Web3Config {
  const chainIdHex = import.meta.env.VITE_NATUR_CHAIN_ID as string;
  const tokenAddress = import.meta.env.VITE_NATUR_TOKEN_ADDRESS as 0x${string};
  const tokenDecimals = Number(import.meta.env.VITE_NATUR_TOKEN_DECIMALS || 18);
  const treasury = import.meta.env.VITE_NATUR_TREASURY as 0x${string};
  const usdPerNatur = Number(import.meta.env.VITE_NATUR_USD_RATE || 1);
  if (!chainIdHex || !tokenAddress || !treasury) throw new Error("Missing NATUR web3 env");
  return { chainIdHex, tokenAddress, tokenDecimals, treasury, usdPerNatur };
}
export const ERC20_ABI_MIN = [
  "function transfer(address to, uint256 amount) returns (bool)",
  "function decimals() view returns (uint8)",
  "event Transfer(address indexed from, address indexed to, uint256 value)"
];
