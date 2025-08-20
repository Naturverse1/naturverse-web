import { games } from '../../data/games'
import { useEffect, useState } from 'react'

type Scores = Record<string, number>

export default function Arcade() {
  const [scores, setScores] = useState<Scores>({})
  useEffect(() => {
    const raw = localStorage.getItem('nv_scores') || '{}'
    setScores(JSON.parse(raw))
  }, [])
  const bump = (id:string) => {
    const next = { ...scores, [id]: (scores[id]||0)+Math.ceil(Math.random()*5) }
    setScores(next); localStorage.setItem('nv_scores', JSON.stringify(next))
  }
  return (
    <section>
      <h1>Arcade</h1>
      <ul>
        {games.map(g => (
          <li key={g.id} style={{margin:'12px 0'}}>
            <strong>{g.title}</strong> — {g.description}
            <div style={{display:'flex', gap:8, marginTop:6}}>
              <button onClick={()=>bump(g.id)}>Play (demo)</button>
              <span>High score: {scores[g.id] || 0}</span>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}
