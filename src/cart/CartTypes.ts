export type CartItem = {
  id: string;                 // stable product id
  name: string;
  price: number;              // in smallest unit (cents)
  image?: string;
  variant?: string;           // e.g., size/color
  qty: number;
};

export type CartState = {
  items: CartItem[];
  note?: string;
  coupon?: string | null;
};

export type CartAction =
  | { type: "ADD"; item: Omit<CartItem, "qty">; qty?: number }
  | { type: "INC"; id: string; variant?: string }
  | { type: "DEC"; id: string; variant?: string }
  | { type: "SETQTY"; id: string; variant?: string; qty: number }
  | { type: "REMOVE"; id: string; variant?: string }
  | { type: "CLEAR" }
  | { type: "SET_NOTE"; note: string }
  | { type: "SET_COUPON"; coupon: string | null };

export type Totals = {
  subtotal: number;
  discount: number;
  tax: number;
  shipping: number;
  total: number;
};
