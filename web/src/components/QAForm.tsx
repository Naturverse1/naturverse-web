import { useState } from 'react';
import { askQuestion, answerQuestion } from '../lib/reviews';

export default function QAForm({ productId, onAdded }:{ productId:string; onAdded:()=>void }) {
  const [q, setQ] = useState('');
  function submit(e:React.FormEvent) {
    e.preventDefault();
    if (!q.trim()) return;
    askQuestion({ productId, question: q.trim() });
    setQ(''); onAdded();
  }
  return (
    <form onSubmit={submit} className="panel" style={{marginTop:12}}>
      <h4>Ask a question</h4>
      <input placeholder="Type your question…" value={q} onChange={e=>setQ(e.target.value)} />
      <button className="primary" style={{marginTop:8}}>Ask</button>
      <div className="muted small" style={{marginTop:6}}>Demo: questions/answers are saved only on this device.</div>
    </form>
  );
}
