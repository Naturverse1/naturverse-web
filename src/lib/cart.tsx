import React, {createContext, useContext, useMemo, useState, useEffect} from "react";

export type CartItem = { id:string; name:string; price:number; image:string; qty:number };
type Saved = Record<string, true>;

type CartCtx = {
  items: CartItem[];
  saved: Saved;
  add: (item: Omit<CartItem,"qty">, qty?: number) => void;
  inc: (id: string) => void;
  dec: (id: string) => void;
  remove: (id: string) => void;
  toggleSave: (id: string) => void;
  count: number;       // total qty
  subtotal: number;
};

const CartContext = createContext<CartCtx | null>(null);
const CART_KEY = "nv.cart";
const SAVE_KEY = "nv.wishlist";

export const CartProvider: React.FC<{children: React.ReactNode}> = ({children}) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [saved, setSaved] = useState<Saved>({});

  useEffect(() => {
    try {
      const c = JSON.parse(localStorage.getItem(CART_KEY) || "[]"); setItems(c);
      const s = JSON.parse(localStorage.getItem(SAVE_KEY) || "{}"); setSaved(s);
    } catch {}
  }, []);
  useEffect(() => { localStorage.setItem(CART_KEY, JSON.stringify(items)); }, [items]);
  useEffect(() => { localStorage.setItem(SAVE_KEY, JSON.stringify(saved)); }, [saved]);

  const api = useMemo<CartCtx>(() => {
    const add: CartCtx["add"] = (item, qty = 1) =>
      setItems(prev => {
        const i = prev.findIndex(p => p.id === item.id);
        if (i >= 0) { const copy=[...prev]; copy[i].qty += qty; return copy; }
        return [...prev, {...item, qty}];
      });
    const inc = (id:string) => setItems(p => p.map(it => it.id===id? {...it, qty: it.qty+1}: it));
    const dec = (id:string) => setItems(p => p.flatMap(it => it.id===id? (it.qty>1? [{...it, qty:it.qty-1}] : []) : [it]));
    const remove = (id:string) => setItems(p => p.filter(it => it.id!==id));
    const toggleSave = (id:string) => setSaved(s => ({...s, [id]: s[id]? undefined as never : true}));
    const count = items.reduce((n,i)=>n+i.qty,0);
    const subtotal = items.reduce((n,i)=>n+i.qty*i.price,0);
    return {items, saved, add, inc, dec, remove, toggleSave, count, subtotal};
  }, [items, saved]);

  return <CartContext.Provider value={api}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be inside CartProvider");
  return ctx;
};
