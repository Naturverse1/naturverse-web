export const ERC20_ABI = [
  // read
  "function decimals() view returns (uint8)",
  "function symbol() view returns (string)",
  "function balanceOf(address) view returns (uint256)",
  // write
  "function transfer(address to, uint256 value) returns (bool)"
];
