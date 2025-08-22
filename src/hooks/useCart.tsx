import React, { createContext, useContext, useEffect, useMemo, useReducer, useState } from "react";
import { CartItem, CartState, Totals } from "../cart/CartTypes";
import { reducer, initialCart, loadCart } from "../cart/cartReducer";

type Ctx = {
  state: CartState;
  add: (item: Omit<CartItem, "qty">, qty?: number) => void;
  inc: (id: string, variant?: string) => void;
  dec: (id: string, variant?: string) => void;
  setQty: (id: string, qty: number, variant?: string) => void;
  remove: (id: string, variant?: string) => void;
  clear: () => void;
  setNote: (note: string) => void;
  setCoupon: (coupon: string | null) => void;
  totals: Totals;
  count: number;
  open: () => void;
  close: () => void;
  isOpen: boolean;
  items: CartItem[];
  updateQty: (id: string, qty: number, variant?: string) => void;
  subtotal: number;
};

const CartCtx = createContext<Ctx | null>(null);
export const useCart = () => {
  const ctx = useContext(CartCtx);
  if (!ctx) throw new Error("useCart must be used within <CartProvider>");
  return ctx;
};

function calcTotals(items: CartItem[]): Totals {
  const subtotal = items.reduce((s, it) => s + it.price * it.qty, 0);
  const discount = 0; // placeholder for future coupons
  const taxable = subtotal - discount;
  const tax = Math.round(taxable * 0.075); // 7.5% demo
  const shipping = taxable > 5000 ? 0 : items.length ? 599 : 0; // free > $50
  const total = taxable + tax + shipping;
  return { subtotal, discount, tax, shipping, total };
}

function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialCart, () =>
    (typeof window !== "undefined" ? loadCart() : initialCart)
  );
  const [isOpen, setIsOpen] = useState(false);

  const api = useMemo(
    () => ({
      state,
      add: (item: Omit<CartItem, "qty">, qty?: number) =>
        dispatch({ type: "ADD", item, qty }),
      inc: (id: string, variant?: string) =>
        dispatch({ type: "INC", id, variant }),
      dec: (id: string, variant?: string) =>
        dispatch({ type: "DEC", id, variant }),
      setQty: (id: string, qty: number, variant?: string) =>
        dispatch({ type: "SETQTY", id, qty, variant }),
      updateQty: (id: string, qty: number, variant?: string) =>
        dispatch({ type: "SETQTY", id, qty, variant }),
      remove: (id: string, variant?: string) =>
        dispatch({ type: "REMOVE", id, variant }),
      clear: () => dispatch({ type: "CLEAR" }),
      setNote: (note: string) => dispatch({ type: "SET_NOTE", note }),
      setCoupon: (coupon: string | null) => dispatch({ type: "SET_COUPON", coupon }),
      totals: calcTotals(state.items),
      count: state.items.reduce((n, it) => n + it.qty, 0),
      open: () => setIsOpen(true),
      close: () => setIsOpen(false),
      isOpen,
      items: state.items,
      subtotal: state.items.reduce((s, it) => s + it.price * it.qty, 0),
    }),
    [state, isOpen]
  );

  // keep in sync across tabs
  useEffect(() => {
    const h = (e: StorageEvent) => { if (e.key === "naturverse.cart.v1") location.reload(); };
    window.addEventListener("storage", h);
    return () => window.removeEventListener("storage", h);
  }, []);

  return <CartCtx.Provider value={api}>{children}</CartCtx.Provider>;
}

export default CartProvider;
export { CartProvider };
