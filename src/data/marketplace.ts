export type Product = {
  id:string; name:string; price:number; image?:string; tag?:string; blurb?:string
}
export const products: Product[] = [
  { id:'seed-pack', name:'Wildflower Seed Pack', price:5, tag:'Seeds', blurb:'30 native flowers for pollinators' },
  { id:'kid-shovel', name:'Kid Garden Shovel', price:12, tag:'Tools', blurb:'Lightweight, sturdy handle' },
  { id:'field-notes', name:'Field Notes Mini', price:6, tag:'Journal', blurb:'Pocket notebook for nature logs' },
]
