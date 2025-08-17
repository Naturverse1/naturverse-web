import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Gallery from '../../components/Gallery';
import { getProduct } from '../../lib/products';
import { useCart } from '../../context/CartContext';

const DEF_SIZES = ['XS','S','M','L','XL'];
const DEF_MATERIALS = ['Cotton','Recycled','Premium'];

export default function ProductDetail() {
  const [sp] = useSearchParams();
  const id = sp.get('id') || '';
  const product = getProduct(id);
  const { add, openMiniCart } = useCart();

  const images = product && (product as any).images ? (product as any).images : [product?.img || ''];
  const sizes = (product as any)?.variants?.sizes || DEF_SIZES;
  const materials = (product as any)?.variants?.materials || DEF_MATERIALS;

  const [size, setSize] = useState<string>(sizes[0]);
  const [material, setMaterial] = useState<string>(materials[0]);
  const [qty, setQty] = useState(1);

  if (!product) {
    return (
      <section>
        <h1>Product not found</h1>
        <a href="/marketplace">Back to Marketplace</a>
      </section>
    );
  }

  const addToCart = () => {
    add({
      id: `${product.id}::${size}::${material}`,
      name: product.name,
      image: images[0],
      priceNatur: product.baseNatur,
      qty,
      variant: { size, material },
    });
    openMiniCart();
  };

  return (
    <section>
      <a href="/marketplace">← Back to Marketplace</a>
      <div style={{display:'grid', gap:'1rem', marginTop:'1rem'}}>
        <Gallery images={images} />
        <div>
          <h1>{product.name}</h1>
          <div style={{marginTop:'.5rem'}}>
            <label>Size: </label>
            <select value={size} onChange={e => setSize(e.target.value)}>
              {sizes.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          <div style={{marginTop:'.5rem'}}>
            <label>Material: </label>
            <select value={material} onChange={e => setMaterial(e.target.value)}>
              {materials.map(m => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>
          <div className="qty" style={{marginTop:'.5rem'}}>
            <button disabled={qty<=1} onClick={()=>setQty(q=>Math.max(1,q-1))}>-</button>
            <span>{qty}</span>
            <button disabled={qty>=99} onClick={()=>setQty(q=>Math.min(99,q+1))}>+</button>
          </div>
          <div style={{marginTop:'1rem'}}>
            <button onClick={addToCart}>Add to cart</button>
          </div>
        </div>
      </div>
    </section>
  );
}
