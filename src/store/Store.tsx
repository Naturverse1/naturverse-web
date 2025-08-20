import { createContext, useContext, useMemo, useReducer } from "react";

type Item = { id: string; name: string; price: number; qty: number };
type State = { cart: Item[] };
type Action =
  | { type: "add"; item: Omit<Item,"qty"> }
  | { type: "remove"; id: string }
  | { type: "qty"; id: string; qty: number }
  | { type: "clear" };

const Store = createContext<{state: State; dispatch: React.Dispatch<Action>} | null>(null);

function reducer(state: State, action: Action): State {
  switch(action.type){
    case "add": {
      const found = state.cart.find(i=>i.id===action.item.id);
      if (found) return { cart: state.cart.map(i=>i.id===found.id? {...i, qty:i.qty+1}:i) };
      return { cart: [...state.cart, {...action.item, qty:1}] };
    }
    case "remove": return { cart: state.cart.filter(i=>i.id!==action.id) };
    case "qty": return { cart: state.cart.map(i=>i.id===action.id? {...i, qty: action.qty }: i) };
    case "clear": return { cart: [] };
    default: return state;
  }
}

export function StoreProvider({children}:{children: React.ReactNode}){
  const [state, dispatch] = useReducer(reducer, { cart: [] });
  const value = useMemo(()=>({state, dispatch}),[state]);
  return <Store.Provider value={value}>{children}</Store.Provider>;
}
export function useStore(){
  const ctx = useContext(Store);
  if (!ctx) throw new Error("Store missing");
  return ctx;
}
