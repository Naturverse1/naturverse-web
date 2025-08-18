import { useMemo, useState } from 'react';
import Stars from './Stars';
import { getReviews, ratingStats, voteReview, removeReview } from '../lib/reviews';

type Props = { productId: string };
export default function ReviewsList({ productId }: Props) {
  const [revVersion, setRevVersion] = useState(0);
  const list = useMemo(()=> getReviews(productId), [productId, revVersion]);
  const stats = ratingStats(productId);
  const [sort, setSort] = useState<'new'|'top'|'low'>('new');

  const items = useMemo(()=>{
    const arr = [...list];
    if (sort==='new') arr.sort((a,b)=> b.createdAt.localeCompare(a.createdAt));
    else if (sort==='top') arr.sort((a,b)=> (b.votesUp-b.votesDown) - (a.votesUp-a.votesDown));
    else arr.sort((a,b)=> a.rating - b.rating);
    return arr;
  }, [list, sort]);

  return (
    <div>
      <div className="panel" style={{display:'grid', gap:8}}>
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
          <div><strong>{stats.avg.toFixed(1)}</strong>/5 · {stats.total} review(s)</div>
          <select value={sort} onChange={e=> setSort(e.target.value as any)}>
            <option value="new">Newest</option>
            <option value="top">Top</option>
            <option value="low">Lowest</option>
          </select>
        </div>
        <div style={{display:'grid', gap:6}}>
          {[5,4,3,2,1].map(star=>{
            const count = getBarCount(star, stats);
            const pct = stats.total ? Math.round((count/stats.total)*100) : 0;
            return (
              <div key={star} style={{display:'flex', alignItems:'center', gap:8}}>
                <span style={{width:28}}>{star}★</span>
                <div style={{flex:1, height:8, background:'rgba(255,255,255,.08)', borderRadius:6, overflow:'hidden'}}>
                  <div style={{width:`${pct}%`, height:'100%', background:'#ffd76b'}}/>
                </div>
                <span style={{width:36, textAlign:'right'}}>{count}</span>
              </div>
            );
          })}
        </div>
      </div>

      {!items.length ? <p style={{opacity:.8}}>No reviews yet.</p> : (
        <div className="panel" style={{marginTop:12}}>
          {items.map(r=>(
            <div key={r.id} className="rev">
              <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                <Stars value={r.rating}/>
                <span className="muted small">{new Date(r.createdAt).toLocaleDateString()}</span>
              </div>
              <div style={{marginTop:6}}><strong>{r.title}</strong></div>
              <div style={{opacity:.9}}>{r.body}</div>
              <div className="muted small" style={{marginTop:4}}>by {r.author || 'Anonymous'}</div>
              <div style={{display:'flex', gap:8, marginTop:8}}>
                <button className="button" onClick={()=> { voteReview(r.id,true); setRevVersion(v=>v+1); }}>Helpful ({r.votesUp})</button>
                <button className="button" onClick={()=> { voteReview(r.id,false); setRevVersion(v=>v+1); }}>Not helpful ({r.votesDown})</button>
                <button className="link danger" onClick={()=> { if(confirm('Remove this review from this device?')) { removeReview(r.id); setRevVersion(v=>v+1); } }}>Remove (local)</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function getBarCount(star:number, stats:{dist:number[]}) {
  // stats.dist = counts for [1..5]
  return stats.dist[star-1] || 0;
}
