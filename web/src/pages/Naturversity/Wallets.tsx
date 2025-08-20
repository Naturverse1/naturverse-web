import { useEffect, useState } from 'react';
import { callFn } from '../../lib/api';

type Wallet = { user_id: string; balance: number };

export default function WalletsPage() {
  const [data, setData] = useState<Wallet | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const res = await callFn('nv-wallet', 'GET');
      if (res?.ok) setData(res.data as Wallet);
      setLoading(false);
    })();
  }, []);

  return (
    <main className="page">
      <h1>Custodial Wallet</h1>
      {loading ? <p>Loading…</p> : (
        <>
          <p><strong>Balance:</strong> {data?.balance ?? 0} NATUR</p>
          <p>Status: 🔒 Parent-managed (read-only in app; changes via approvals)</p>
        </>
      )}
    </main>
  );
}
