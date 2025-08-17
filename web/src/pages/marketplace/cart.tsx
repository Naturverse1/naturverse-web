import React from 'react';
import { useCart } from '../../context/CartContext';

export default function CartPage() {
  const { items, remove, add, clear, totalNatur } = useCart();

  const dec = (id: string) => {
    const line = items.find(i => i.id === id);
    if (!line) return;
    if (line.qty <= 1) remove(id);
    else add({ ...line, qty: -1 }); // add negative qty handled in CartProvider
  };

  const inc = (id: string) => {
    const line = items.find(i => i.id === id);
    if (!line) return;
    add({ ...line, qty: 1 });
  };

  if (!items.length) {
    return (
      <section>
        <h1>Your cart</h1>
        <p>Your cart is empty.</p>
        <a href="/marketplace">Browse products</a>
      </section>
    );
  }

  return (
    <section>
      <h1>Your cart</h1>
      <table>
        <thead>
          <tr><th>Item</th><th>Qty</th><th>Price (NATUR)</th><th></th></tr>
        </thead>
        <tbody>
          {items.map(i => (
            <tr key={i.id}>
              <td>{i.name}</td>
              <td>
                <button onClick={() => dec(i.id)} aria-label="decrease">–</button>
                <span style={{padding:'0 .5rem'}}>{i.qty}</span>
                <button onClick={() => inc(i.id)} aria-label="increase">+</button>
              </td>
              <td>{(i.priceNatur * i.qty).toFixed(2)}</td>
              <td><button onClick={() => remove(i.id)}>Remove</button></td>
            </tr>
          ))}
        </tbody>
      </table>

      <p style={{marginTop:'1rem'}}><strong>Total:</strong> {totalNatur.toFixed(2)} NATUR</p>

      <div style={{marginTop:'1rem'}}>
        <a href="/marketplace/checkout">Proceed to checkout</a>
        <button onClick={clear} style={{marginLeft:'.75rem'}}>Clear cart</button>
      </div>
    </section>
  );
}
