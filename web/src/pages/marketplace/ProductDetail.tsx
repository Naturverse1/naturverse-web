import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import Gallery from '../../components/Gallery';
import { Skeleton } from '../../components/ui/Skeleton';
import { useToast } from '../../components/ui/useToast';
import { getProduct, PRODUCTS } from '../../lib/products';
import { addToCart } from '../../lib/cart';
import RecoStrip from '../../components/RecoStrip';
import { recommendFor, Item } from '../../lib/reco';
import Stars from '../../components/Stars';
import ReviewForm from '../../components/ReviewForm';
import ReviewsList from '../../components/ReviewsList';
import QAForm from '../../components/QAForm';
import QAList from '../../components/QAList';
import { ratingStats } from '../../lib/reviews';
import Seo from '../../components/Seo';
import ShareRow from '../../components/ShareRow';
import WishlistButton from '../../components/WishlistButton';
import { pushRecent } from '../../lib/recent';
import RecentCarousel from '../../components/RecentCarousel';

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
  const toast = useToast();
  const [imgLoaded, setImgLoaded] = useState(false);

  const images = product && (product as any).images ? (product as any).images : [product?.img || ''];
  const sizes = (product as any)?.variants?.sizes || DEF_SIZES;
  const materials = (product as any)?.variants?.materials || DEF_MATERIALS;
  useEffect(() => {
    const img = new Image();
    if (images[0]) img.src = images[0];
    img.onload = () => setImgLoaded(true);
  }, [images]);

  const [size, setSize] = useState<string>('');
  const [material, setMaterial] = useState<string>('');
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState<'details' | 'reviews' | 'qa'>('details');
  const stats = ratingStats(product?.id || '');

  useEffect(() => {
    if (product) pushRecent(product.id);
  }, [product?.id]);

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

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: images,
    offers: {
      '@type': 'Offer',
      price: product.baseNatur,
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
      url: typeof window !== 'undefined' ? window.location.href : ''
    }
  };

  function add() {
    if (!size || !material) {
      toast.error('Pick a size/material first');
      return;
    }
    addToCart({ id: product.id, name: product.name, price: product.baseNatur, image: images[0], options: { size, material }, qty });
    console.log('cart_add', { id: product.id, qty });
    toast.success('Added to cart');
  }

  return (
    <section>
      <Seo
        title={product.name}
        description={`Buy ${product.name} on The Naturverse`}
        image={images[0]}
        jsonLd={jsonLd}
      />
      <a href="/marketplace">← Back to Marketplace</a>
      <div style={{display:'grid', gap:'1rem', marginTop:'1rem'}}>
        <div>
          {!imgLoaded && <Skeleton className="h-64" />}
          {imgLoaded && <Gallery images={images} />}
        </div>
        <div>
          <h1 style={{ display: 'flex', alignItems: 'center', gap: '.5rem' }}>
            {product.name}
            <WishlistButton id={product.id} />
          </h1>
          <div style={{display:'flex', alignItems:'center', gap:8, marginTop:6}}>
            <Stars value={Math.round(stats.avg)} />
            <span className="muted small">{stats.total} review(s)</span>
          </div>
          <div style={{marginTop:'.5rem'}}>
            <label>Size: </label>
            <select value={size} onChange={e => setSize(e.target.value)}>
              <option value="" disabled>Select size</option>
              {sizes.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          <div style={{marginTop:'.5rem'}}>
            <label>Material: </label>
            <select value={material} onChange={e => setMaterial(e.target.value)}>
              <option value="" disabled>Select material</option>
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
          <ShareRow />
        </div>
      </div>
      <div className="tabs">
        <button className={tab==='details'?'active':''} onClick={()=>setTab('details')}>Details</button>
        <button className={tab==='reviews'?'active':''} onClick={()=>setTab('reviews')}>Reviews</button>
        <button className={tab==='qa'?'active':''} onClick={()=>setTab('qa')}>Q&A</button>
      </div>

      {tab==='details' && (
        <section>{/* keep your existing details content */}</section>
      )}
      {tab==='reviews' && (
        <section>
          <ReviewsList productId={product.id}/>
          <ReviewForm productId={product.id} onAdded={() => { setTab('reviews'); toast.success('Thanks for your review!'); }}/>
        </section>
      )}
      {tab==='qa' && (
        <section>
          <QAList productId={product.id}/>
          <QAForm productId={product.id} onAdded={() => { setTab('qa'); toast.success('Question posted'); }}/>
        </section>
      )}
      <RecoStrip title="For you" items={recos} source="detail" />
      <RecentCarousel />
    </section>
  );
}
