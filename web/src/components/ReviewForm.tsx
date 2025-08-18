import { useState } from 'react';
import Stars from './Stars';
import { addReview } from '../lib/reviews';

export default function ReviewForm({ productId, onAdded }:{ productId:string; onAdded:()=>void }) {
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [author, setAuthor] = useState('');

  function submit(e:React.FormEvent) {
    e.preventDefault();
    if (!title || !body) return;
    addReview({ productId, rating, title, body, author: author||'Anonymous' });
    setTitle(''); setBody(''); setAuthor('');
    onAdded();
  }

  return (
    <form onSubmit={submit} className="panel" style={{marginTop:12}}>
      <h4>Write a review</h4>
      <div style={{display:'flex', gap:12, alignItems:'center', margin:'6px 0'}}>
        <span>Rating:</span> <Stars value={rating} onChange={setRating}/>
      </div>
      <input placeholder="Title" value={title} onChange={e=>setTitle(e.target.value)} />
      <textarea placeholder="Your thoughts…" value={body} onChange={e=>setBody(e.target.value)} />
      <input placeholder="Your name (optional)" value={author} onChange={e=>setAuthor(e.target.value)} />
      <button className="primary" style={{marginTop:8}}>Submit review</button>
    </form>
  );
}
