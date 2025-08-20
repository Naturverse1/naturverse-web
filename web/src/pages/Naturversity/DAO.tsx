import { useEffect, useState } from 'react';
import { callFn } from '../../lib/api';
import type { DaoProposal } from '../../types/naturversity';

export default function DaoPage() {
  const [proposals, setProposals] = useState<(DaoProposal & { yes: number; no: number })[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const res = await callFn('nv-dao', 'GET');
      if (res?.ok) setProposals(res.data);
      setLoading(false);
    })();
  }, []);

  async function vote(id: string, v: boolean) {
    const res = await callFn('nv-dao', 'POST', { proposal_id: id, vote: v });
    if (res?.ok) setProposals(res.data);
  }

  return (
    <main className="page">
      <h1>DAO Literacy</h1>
      {loading ? <p>Loading…</p> : proposals.map(p => (
        <div key={p.id} className="card">
          <h3>{p.title}</h3>
          <p>{p.description}</p>
          <p>Votes: ✅ {p.yes} ❌ {p.no}</p>
          <button onClick={() => vote(p.id, true)}>Vote Yes</button>
          <button onClick={() => vote(p.id, false)} style={{marginLeft:8}}>Vote No</button>
        </div>
      ))}
    </main>
  );
}
