import React from 'react';
import { fmtNatur } from '../lib/money';

export type Line = {
  id: string;
  name: string;
  qty: number;
  priceNatur: number; // unit price
  meta?: Record<string, any>;
};

type Props = {
  line: Line;
  onInc?: () => void;
  onDec?: () => void;
  onRemove?: () => void;
};

export default function CartLine({ line, onInc, onDec, onRemove }: Props) {
  const subtotal = line.priceNatur * line.qty;
  return (
    <div style={{
      display:'grid', gridTemplateColumns:'1fr auto auto', gap:'0.75rem',
      padding:'0.75rem 1rem', background:'rgba(255,255,255,.04)', borderRadius:12
    }}>
      <div>
        <div style={{fontWeight:600}}>{line.name}</div>
        <div style={{opacity:.8, fontSize:'.9rem'}}>
          Unit: {fmtNatur(line.priceNatur)} • Subtotal: {fmtNatur(subtotal)}
        </div>
      </div>
      <div className="qty" style={{display:'flex', alignItems:'center', gap:'.5rem'}}>
        <button onClick={onDec} aria-label="decrease">–</button>
        <span>{line.qty}</span>
        <button onClick={onInc} aria-label="increase">+</button>
      </div>
      <div style={{display:'flex', alignItems:'center', gap:'.5rem', justifyContent:'flex-end'}}>
        <button onClick={onRemove}>Remove</button>
      </div>
    </div>
  );
}
