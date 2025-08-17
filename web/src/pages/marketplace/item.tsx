import React, { useMemo, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { getProduct, Product } from '../../lib/products';
import { getNavatarSrc } from '../../lib/navatar';
import { useCart } from '../../context/CartContext';

type Sel = { size: string; material?: string; qty: number };

function priceNatur(p: Product, sel: Sel) {
  const sizeMul = p.options.sizes.find(s => s.key === sel.size)?.multiplier ?? 1;
  const matMul  = p.options.materials?.find(m => m.key === sel.material)?.multiplier ?? 1;
  return p.baseNatur * sizeMul * matMul * sel.qty;
}

export default function ItemPage() {
  const [sp] = useSearchParams();            // ?id=plush-classic
  const nav = useNavigate();
  const id  = sp.get('id') || '';
  const product = getProduct(id);

  const { add } = useCart();
  const [sel, setSel] = useState<Sel>({ size: product?.options.sizes[0]?.key || 's', material: product?.options.materials?.[0]?.key, qty: 1 });

  const total = useMemo(() => product ? priceNatur(product, sel) : 0, [product, sel]);
  const navatar = getNavatarSrc();

  if (!product) {
    return (
      <section>
        <h1>Product not found</h1>
        <a href="/marketplace">Back to Marketplace</a>
      </section>
    );
  }

  const addToCart = () => {
    const lineId = `${product.id}-${sel.size}-${sel.material || 'na'}`;
    add({
      id: lineId,
      name: `${product.name} • ${sel.size}${sel.material ? ' • ' + sel.material : ''}`,
      qty: sel.qty,
      priceNatur: priceNatur(product, { ...sel, qty: 1 }), // unit price
      meta: { productId: product.id, size: sel.size, material: sel.material }
    });
    nav('/marketplace/cart');
  };

  return (
    <section>
      <a href="/marketplace">← Back to Marketplace</a>
      <div style={{display:'grid', gridTemplateColumns:'minmax(280px,1fr) 1fr', gap:'1.5rem', alignItems:'start', marginTop:'1rem'}}>
        <div>
          <div className="preview">
            {/* product base image */}
            {product.img ? <img src={product.img} alt="" className="base" /> : <div className="base placeholder" />}
            {/* navatar overlay */}
            {navatar ? <img src={navatar} alt="Navatar" className="overlay" /> : <div className="overlay placeholder">Add your Navatar to Profile</div>}
          </div>
          <small style={{opacity:.8}}>Preview is illustrative; final production rendering may vary.</small>
        </div>

        <div>
          <h1>{product.name}</h1>
          <p><strong>Price:</strong> {total.toFixed(2)} NATUR</p>

          <div style={{marginTop:'1rem'}}>
            <label>Size:&nbsp;</label>
            <select
              value={sel.size}
              onChange={e => setSel(s => ({ ...s, size: e.target.value }))}
            >
              {product.options.sizes.map(s => (
                <option key={s.key} value={s.key}>{s.label}</option>
              ))}
            </select>
          </div>

          {product.options.materials?.length ? (
            <div style={{marginTop:'0.75rem'}}>
              <label>Material:&nbsp;</label>
              <select
                value={sel.material}
                onChange={e => setSel(s => ({ ...s, material: e.target.value }))}
              >
                {product.options.materials.map(m => (
                  <option key={m.key} value={m.key}>{m.label}</option>
                ))}
              </select>
            </div>
          ) : null}

          <div style={{marginTop:'0.75rem'}}>
            <label>Quantity:&nbsp;</label>
            <button onClick={() => setSel(s => ({ ...s, qty: Math.max(1, s.qty-1) }))}>–</button>
            <span style={{padding:'0 .5rem'}}>{sel.qty}</span>
            <button onClick={() => setSel(s => ({ ...s, qty: s.qty+1 }))}>+</button>
          </div>

          <div style={{marginTop:'1rem'}}>
            <button onClick={addToCart}>Add to cart</button>
          </div>

          {!navatar && (
            <p style={{marginTop:'0.75rem', opacity:.9}}>
              Tip: set your Navatar on the <a href="/profile">Profile</a> page to see it in the preview.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}

