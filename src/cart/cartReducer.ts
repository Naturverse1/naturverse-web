import { CartAction, CartItem, CartState } from "./CartTypes";

export const initialCart: CartState = { items: [] };

const key = "naturverse.cart.v1";

export function loadCart(): CartState {
  try { return JSON.parse(localStorage.getItem(key) || "null") || initialCart; }
  catch { return initialCart; }
}

export function saveCart(state: CartState) {
  try { localStorage.setItem(key, JSON.stringify(state)); } catch {}
}

function same(a: CartItem, b: Partial<CartItem>) {
  return a.id === b.id && a.variant === b.variant;
}

export function reducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD": {
      const qty = action.qty ?? 1;
      const i = state.items.findIndex(it => same(it, action.item));
      const items = [...state.items];
      if (i >= 0) items[i] = { ...items[i], qty: items[i].qty + qty };
      else items.push({ ...action.item, qty });
      const next = { ...state, items };
      saveCart(next);
      return next;
    }
    case "INC":
    case "DEC":
    case "SETQTY": {
      const items = state.items.map(it => {
        if (it.id !== action.id || it.variant !== action.variant) return it;
        const q = action.type === "INC" ? it.qty + 1
              : action.type === "DEC" ? Math.max(1, it.qty - 1)
              : Math.max(1, action.qty);
        return { ...it, qty: q };
      });
      const next = { ...state, items };
      saveCart(next);
      return next;
    }
    case "REMOVE": {
      const items = state.items.filter(it => !(it.id === action.id && it.variant === action.variant));
      const next = { ...state, items };
      saveCart(next);
      return next;
    }
    case "CLEAR": {
      saveCart(initialCart);
      return initialCart;
    }
    case "SET_NOTE": {
      const next = { ...state, note: action.note };
      saveCart(next);
      return next;
    }
    case "SET_COUPON": {
      const next = { ...state, coupon: action.coupon };
      saveCart(next);
      return next;
    }
    default:
      return state;
  }
}
