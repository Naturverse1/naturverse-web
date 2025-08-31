import { useEffect, useState } from 'react';
import { connectWallet, getInjected } from '../lib/web3';

export default function WalletConnect() {
  const [addr, setAddr] = useState<string | null>(null);
  const [hasWallet, setHasWallet] = useState<boolean>(true);

  useEffect(() => {
    getInjected().then(w => setHasWallet(!!w));
  }, []);

  async function onConnect() {
    try {
      const { address } = await connectWallet();
      setAddr(address);
    } catch (e: any) {
      alert(e?.message || 'Failed to connect wallet');
    }
  }

  if (!hasWallet) {
    return <a href="https://metamask.io/" target="_blank" rel="noreferrer">Install MetaMask</a>;
  }
  return (
    <button onClick={onConnect} className="btn">
      {addr ? addr.slice(0,6) + '…' + addr.slice(-4) : 'Connect Wallet'}
    </button>
  );
}
