import { useCart } from "../lib/cart";
export default function SaveButton({ id }:{id:string}) {
  const { saved, toggleSave } = useCart();
  const on = !!saved[id];
  return (
    <button className={on? "btn-solid" : "btn-outline"} onClick={()=>toggleSave(id)}>
      {on ? "♥ Saved" : "♡ Save"}
    </button>
  );
}
