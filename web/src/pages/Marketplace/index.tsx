import { products } from '../../data/marketplace'
import { useEffect, useState } from 'react'
type Cart = Record<string, number>

export default function Marketplace(){
  const [cart,setCart] = useState<Cart>({})
  useEffect(()=>{ setCart(JSON.parse(localStorage.getItem('nv_cart')||'{}'))},[])
  useEffect(()=>{ localStorage.setItem('nv_cart', JSON.stringify(cart))},[cart])

  const add = (id:string)=> setCart(c=>({...c,[id]:(c[id]||0)+1}))
  const total = products.reduce((sum,p)=> sum + (cart[p.id]||0)*p.price, 0)

  return (
    <section>
      <h1>Marketplace</h1>
      <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))', gap:16}}>
        {products.map(p=>(
          <div key={p.id} style={{border:'1px solid #ddd', padding:12, borderRadius:8}}>
            <h3>{p.name}</h3>
            <p>{p.blurb}</p>
            <p><strong>${p.price.toFixed(2)}</strong></p>
            <button onClick={()=>add(p.id)}>Add to cart</button>
          </div>
        ))}
      </div>
      <h2 style={{marginTop:20}}>Cart</h2>
      <ul>
        {Object.entries(cart).map(([id,qty])=>{
          const p = products.find(x=>x.id===id)!; return <li key={id}>{p.name} × {qty}</li>
        })}
      </ul>
      <p><strong>Total: ${total.toFixed(2)}</strong></p>
    </section>
  )
}
