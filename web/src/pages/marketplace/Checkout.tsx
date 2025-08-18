import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getCart, setQty, removeLine, totals, clearCart } from '../../lib/cart';
import { saveOrder } from '../../lib/orders';
import LoadingOverlay from '../../components/ui/LoadingOverlay';
import { useToast } from '../../components/ui/useToast';

export default function Checkout() {
  const [cart, setCart] = useState(getCart());
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [addr, setAddr] = useState('');
  const amounts = useMemo(()=> totals(cart), [cart]);
  const nav = useNavigate();
const toast = useToast();
  const [processing, setProcessing] = useState(false);

  function qtyChange(id:string, options:any, q:number) {
    setCart(setQty(id, options, q));
  }
  function remove(id:string, options:any) {
    setCart(removeLine(id, options));
  }

  function placeOrder(e:React.FormEvent) {
    e.preventDefault();
    if (!cart.length) return;
    if (!email || !name || !addr) { toast.error('Please complete contact and shipping'); return; }
    setProcessing(true);
    const id = crypto.randomUUID();
    saveOrder({
      id, createdAt: new Date().toISOString(),
      email, shippingName: name, shippingAddress: addr,
      lines: cart.map(l => ({ id:l.id, name:l.name, price:l.price, qty:l.qty, image:l.image })),
      amounts
    });
    clearCart();
    setTimeout(() => {
      setProcessing(false);
      toast.success('Order placed');
      nav(`/marketplace/success?id=${id}`);
    }, 300);
  }

  return (
    <div className="container" style={{padding:'24px'}}>
      <LoadingOverlay visible={processing} text="Placing order..." />
      <Link to="/marketplace" style={{color:'#7fe3ff'}}>&larr; Back to Marketplace</Link>
      <h1 style={{margin:'12px 0'}}>Checkout</h1>

      {!cart.length ? (
        <p>Your cart is empty.</p>
      ) : (
        <div className="grid" style={{gridTemplateColumns:'1fr 360px'}}>
          <section className="panel">
            <h3>Items</h3>
            {cart.map((l,i)=>(
              <div key={i} className="line">
                {l.image && <img src={l.image} alt="" />}
                <div className="info">
                  <strong>{l.name}</strong>
                  <div className="muted">${l.price.toFixed(2)}</div>
                  {l.options && <div className="muted small">{Object.entries(l.options).map(([k,v])=>`${k}: ${v}`).join(' · ')}</div>}
                </div>
                <div className="qty">
                  <button onClick={()=> qtyChange(l.id, l.options, l.qty-1)}>-</button>
                  <input value={l.qty} onChange={e=> qtyChange(l.id, l.options, Math.max(0, +e.target.value||0))}/>
                  <button onClick={()=> qtyChange(l.id, l.options, l.qty+1)}>+</button>
                </div>
                <button className="link danger" onClick={()=> remove(l.id, l.options)}>Remove</button>
              </div>
            ))}
          </section>

          <aside className="panel">
            <h3>Summary</h3>
            <div className="row"><span>Subtotal</span><span>${amounts.subtotal.toFixed(2)}</span></div>
            <div className="row"><span>Shipping</span><span>${amounts.shipping.toFixed(2)}</span></div>
            <div className="row"><span>Tax</span><span>${amounts.tax.toFixed(2)}</span></div>
            <div className="row total"><span>Total</span><span>${amounts.total.toFixed(2)}</span></div>

            <h3 style={{marginTop:16}}>Contact</h3>
            <input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />

            <h3 style={{marginTop:16}}>Shipping</h3>
            <input placeholder="Full name" value={name} onChange={e=>setName(e.target.value)} />
            <textarea placeholder="Address" value={addr} onChange={e=>setAddr(e.target.value)} />

            <button className="primary" style={{marginTop:16}} onClick={placeOrder}>
              Place Order
            </button>
            <div className="muted small" style={{marginTop:8}}>Demo checkout: no payment collected.</div>
          </aside>
        </div>
      )}
    </div>
  );
}
