import { useParams, Link, useNavigate } from 'react-router-dom';
import { PRODUCTS } from './index';
import { getNavatarUrl } from '../../lib/navatar';
import { useEffect, useState } from 'react';
import { useCart } from '../../state/cart';
import type { CartItem, Customization, Product } from '../../types/marketplace';

const uid = () => Math.random().toString(36).slice(2);

export default function Customize() {
  const { sku } = useParams();
  const nav = useNavigate();
  const product = PRODUCTS.find((p) => p.sku === sku) as Product | undefined;
  const { add } = useCart();
  const [navatar, setNavatar] = useState<string | null>(null);
  const [cust, setCust] = useState<Customization>({ navatarUrl: '', qty: 1 });

  useEffect(() => {
    getNavatarUrl().then(setNavatar);
  }, []);

  useEffect(() => {
    setCust((c) => ({ ...c, navatarUrl: navatar || '' }));
  }, [navatar]);

  if (!product) return <div className="container">Unknown product.</div>;

  const unit = product.basePriceNatur;
  const lineNatur = unit * (cust.qty || 1);

  const addToCart = () => {
    if (!cust.navatarUrl) {
      alert('Please set your Navatar on your Profile first.');
      return;
    }
    const item: CartItem = {
      id: uid(),
      sku: product.sku,
      title: product.title,
      unitNatur: unit,
      lineNatur,
      customization: { ...cust, navatarUrl: cust.navatarUrl },
    };
    add(item);
    nav('/marketplace/cart');
  };

  return (
    <div className="container">
      <Link to="/marketplace">← Back to Marketplace</Link>
      <h2>{product.title}</h2>

      <div className="flex">
        <div className="preview">
          <div className="mock">
            <img src={product.thumb} alt="" />
            {navatar ? (
              <img className="overlay" src={navatar} alt="Navatar" />
            ) : (
              <div className="overlay empty">
                No Navatar
                <br />
                <Link to="/profile">Add on Profile →</Link>
              </div>
            )}
          </div>
        </div>

        <div className="form">
          {product.options?.size && (
            <label>
              Size
              <select onChange={(e) => setCust((c) => ({ ...c, size: e.target.value }))}>
                <option value="">Select</option>
                {product.options.size.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </label>
          )}
          {product.options?.color && (
            <label>
              Color
              <select onChange={(e) => setCust((c) => ({ ...c, color: e.target.value }))}>
                <option value="">Select</option>
                {product.options.color.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </label>
          )}
          {product.options?.material && (
            <label>
              Material
              <select onChange={(e) => setCust((c) => ({ ...c, material: e.target.value }))}>
                <option value="">Select</option>
                {product.options.material.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </label>
          )}
          <label>
            Qty
            <input
              type="number"
              min={1}
              defaultValue={1}
              onChange={(e) =>
                setCust((c) => ({ ...c, qty: Math.max(1, Number(e.target.value || 1)) }))
              }
            />
          </label>

          <div className="total">
            Total: <strong>{lineNatur} NATUR</strong>
          </div>
          <button onClick={addToCart}>Add to cart</button>
        </div>
      </div>
    </div>
  );
}
