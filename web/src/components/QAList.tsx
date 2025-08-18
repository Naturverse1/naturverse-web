import { useMemo, useState } from 'react';
import { getQA, answerQuestion, removeQA } from '../lib/reviews';

export default function QAList({ productId }:{ productId:string }) {
  const [ver, setVer] = useState(0);
  const list = useMemo(()=> getQA(productId), [productId, ver]);
  const [ans, setAns] = useState<{[id:string]:string}>({});

  return (
    <div className="panel" style={{marginTop:12}}>
      {!list.length ? <p style={{opacity:.8}}>No questions yet.</p> : list.map(q=>(
        <div key={q.id} style={{borderBottom:'1px dashed rgba(255,255,255,.1)', padding:'10px 0'}}>
          <div><strong>Q:</strong> {q.question}</div>
          {q.answer ? <div style={{marginTop:6}}><strong>A:</strong> {q.answer}</div> : (
            <div style={{display:'flex', gap:8, marginTop:8}}>
              <input placeholder="Write an answer…" value={ans[q.id]||''} onChange={e=> setAns({...ans, [q.id]: e.target.value})}/>
              <button className="button" onClick={()=> { if (!ans[q.id]) return; answerQuestion(q.id, ans[q.id]); setVer(v=>v+1); }}>Post</button>
            </div>
          )}
          <div style={{marginTop:6}}>
            <button className="link danger" onClick={()=> { if (confirm('Remove this Q/A locally?')) { removeQA(q.id); setVer(v=>v+1); } }}>Remove (local)</button>
          </div>
        </div>
      ))}
    </div>
  );
}
