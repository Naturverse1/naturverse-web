import { Link, useSearchParams } from 'react-router-dom';

export default function Success() {
  const [sp] = useSearchParams();
  const id = sp.get('id') || '';
  return (
    <div className="container" style={{padding:'24px', textAlign:'center'}}>
      <h1>Order placed 🎉</h1>
      <p>Thank you! Your order <strong>{id.slice(0,8)}</strong> has been recorded.</p>
      <div style={{marginTop:16, display:'flex', gap:12, justifyContent:'center'}}>
        <Link className="button" to="/marketplace">Continue shopping</Link>
        <Link className="button" to="/account/orders">View orders</Link>
      </div>
    </div>
  );
}
