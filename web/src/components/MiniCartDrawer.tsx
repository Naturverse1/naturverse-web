import React, { useEffect } from 'react';
import ModalRoot from './ModalRoot';
import { useCart } from '../context/CartContext';
import CartLine from './CartLine';
import { fmtNatur } from '../lib/money';

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function MiniCartDrawer({ open, onClose }: Props) {
  const { items, inc, dec, remove, totalNatur } = useCart();

  useEffect(() => {
    if (open) console.log('minicart_opened');
    else console.log('minicart_closed');
  }, [open]);

  return (
    <ModalRoot open={open} onClose={onClose}>
      <aside className="drawer" role="complementary">
        <header className="drawer-header"><h2>Cart</h2></header>
        <div className="drawer-body">
          {items.length ? (
            items.map(line => (
              <CartLine
                key={line.id}
                line={line}
                onInc={() => inc(line.id)}
                onDec={() => dec(line.id)}
                onRemove={() => remove(line.id)}
              />
            ))
          ) : (
            <p>Your cart is empty.</p>
          )}
        </div>
        <footer className="drawer-footer">
          <div className="totals">
            <div className="row"><span>Items</span><span>{fmtNatur(totalNatur)}</span></div>
            <div className="row"><span>Shipping</span><span>{fmtNatur(0)}</span></div>
            <div className="row grand"><span>Total</span><span>{fmtNatur(totalNatur)}</span></div>
          </div>
          <div style={{display:'flex', gap:'.5rem', marginTop:'0.75rem'}}>
            <a href="/marketplace/cart" className="btn">Go to Cart</a>
            <a href="/marketplace/checkout" className="btn">Checkout</a>
          </div>
        </footer>
      </aside>
    </ModalRoot>
  );
}
