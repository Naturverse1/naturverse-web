import { getDeviceId } from '../lib/device';
export default function FavButton({type,id}:{type:'product'|'content';id:string}) {
  async function toggle() {
    await fetch('/.netlify/functions/wishlist',{method:'POST',headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ device: getDeviceId(), type, id })});
  }
  return <button onClick={toggle} aria-label="favorite" style={{marginLeft:8}}>♡</button>;
}
