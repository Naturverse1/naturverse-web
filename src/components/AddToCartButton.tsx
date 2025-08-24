import { useCart } from "../lib/cart";
export default function AddToCartButton({ id, name, price, image }:{
  id:string; name:string; price:number; image:string;
}) {
  const { items, add, inc, dec, remove } = useCart();
  const line = items.find(i => i.id===id);
  if (!line) {
    return <button className="btn-primary w-full" onClick={()=>add({id,name,price,image},1)}>Add to cart</button>;
  }
  return (
    <div className="nv-stepper">
      <button className="btn-ghost" onClick={()=>dec(id)} aria-label="Decrease">−</button>
      <span aria-live="polite">{line.qty}</span>
      <button className="btn-ghost" onClick={()=>inc(id)} aria-label="Increase">+</button>
      <button className="btn-danger ml-auto" onClick={()=>remove(id)}>Remove</button>
    </div>
  );
}
