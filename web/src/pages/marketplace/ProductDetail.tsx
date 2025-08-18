import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import Gallery from '../../components/Gallery';
import { getProduct } from '../../lib/products';
import { addToCart } from '../../lib/cart';
import RecoStrip from '../../components/RecoStrip';
import { recommendFor, pushRecent, Item } from '../../lib/reco';
import { PRODUCTS } from '../../lib/products';
import ReviewList from '../../components/reviews/ReviewList';
import QAList from '../../components/qa/QAList';
import RatingStars from '../../components/reviews/RatingStars';
import { getReviewSummary } from '../../lib/supaReviews';
import { isFav, toggleFav, subscribe, unsubscribe } from '../../lib/wishlist';

const allItems: Item[] = PRODUCTS.map(p => ({
  id: p.id,
  name: p.name,
  price: p.baseNatur,
  category: p.category,
  image: p.img,
  createdAt: p.createdAt,
}));

const DEF_SIZES = ['XS','S','M','L','XL'];
const DEF_MATERIALS = ['Cotton','Recycled','Premium'];

export default function ProductDetail() {
  const [sp] = useSearchParams();
  const id = sp.get('id') || '';
  const product = getProduct(id);
  const [fav, setFav] = useState(isFav(id));

  const images = product && (product as any).images ? (product as any).images : [product?.img || ''];
  const sizes = (product as any)?.variants?.sizes || DEF_SIZES;
  const materials = (product as any)?.variants?.materials || DEF_MATERIALS;

  const [size, setSize] = useState<string>(sizes[0]);
  const [material, setMaterial] = useState<string>(materials[0]);
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState<'details' | 'reviews' | 'qa'>('details');
  const [summary, setSummary] = useState<{ avg: number; count: number }>({
    avg: 0,
    count: 0,
  });

  useEffect(() => {
    if (product) pushRecent(product.id);
  }, [product?.id]);

  useEffect(() => {
    const cb = (ids: string[]) => setFav(ids.includes(id));
    subscribe(cb);
    return () => unsubscribe(cb);
  }, [id]);

  useEffect(() => {
    if (product) {
      getReviewSummary(product.id).then(s =>
        setSummary({ avg: s.avg, count: s.count }),
      );
    }
  }, [product]);

  const recos = product
    ? recommendFor(
        {
          id: product.id,
          name: product.name,
          price: product.baseNatur,
          category: product.category,
          image: images[0],
          createdAt: product.createdAt,
        },
        allItems,
        8,
      )
    : [];

  if (!product) {
    return (
      <section>
        <h1>Product not found</h1>
        <a href="/marketplace">Back to Marketplace</a>
      </section>
    );
  }

  function add() {
    addToCart({ id: product.id, name: product.name, price: product.baseNatur, image: images[0], options: { size, material }, qty });
    console.log('cart_add', { id: product.id, qty });
    alert('Added to cart');
  }

  return (
    <section>
      <a href="/marketplace">← Back to Marketplace</a>
      <div style={{display:'grid', gap:'1rem', marginTop:'1rem'}}>
        <Gallery images={images} />
        <div>
          <h1 style={{ display: 'flex', alignItems: 'center', gap: '.5rem' }}>
            {product.name}
            <button
              className="icon-btn"
              aria-label={fav ? 'Remove from wishlist' : 'Add to wishlist'}
              aria-pressed={fav}
              onClick={() => setFav(toggleFav(product.id))}
            >
              {fav ? '♥' : '♡'}
            </button>
            {summary.count > 0 && (
              <span style={{ marginLeft: '.5rem', fontSize: '0.9rem' }}>
                <RatingStars value={summary.avg} readOnly size={14} />
                {summary.avg.toFixed(1)} ({summary.count})
              </span>
            )}
          </h1>
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
          <div className="buy-row" style={{marginTop:'1rem'}}>
            <div className="qty">
              <button onClick={()=> setQty(q=> Math.max(1,q-1))}>-</button>
              <input value={qty} onChange={e=> setQty(Math.max(1, +e.target.value||1))}/>
              <button onClick={()=> setQty(q=> q+1)}>+</button>
            </div>
            <button className="primary" onClick={add}>Add to cart</button>
            <Link className="button" to="/marketplace/checkout">Checkout</Link>
          </div>
        </div>
      </div>
      <div className="tab-bar">
        <button
          className={tab === 'details' ? 'active' : ''}
          onClick={() => setTab('details')}
        >
          Details
        </button>
        <button
          className={tab === 'reviews' ? 'active' : ''}
          onClick={() => setTab('reviews')}
        >
          Reviews
        </button>
        <button
          className={tab === 'qa' ? 'active' : ''}
          onClick={() => setTab('qa')}
        >
          Q&A
        </button>
      </div>
      {tab === 'details' && <div> </div>}
      {tab === 'reviews' && <ReviewList productId={product.id} />}
      {tab === 'qa' && <QAList productId={product.id} />}
      <RecoStrip title="For you" items={recos} source="detail" />
    </section>
  );
}
