import { stories } from '../../data/stories'
import { useState } from 'react'
export default function Stories() {
  const [open, setOpen] = useState<string | null>(null)
  return (
    <section>
      <h1>Stories</h1>
      {stories.map(s=>(
        <article key={s.slug} style={{margin:'16px 0'}}>
          <h3 style={{cursor:'pointer'}} onClick={()=>setOpen(open===s.slug?null:s.slug)}>{s.title}</h3>
          <p>{s.summary}</p>
          {open===s.slug && <p>{s.body}</p>}
        </article>
      ))}
    </section>
  )
}
