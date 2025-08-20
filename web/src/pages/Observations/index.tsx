import { observations } from '../../data/observations'
export default function Observations(){
  return (
    <section>
      <h1>Observations</h1>
      <ul>
        {observations.map(o=>(
          <li key={o.id}>
            <strong>{o.title}</strong> — {o.note} <em>({new Date(o.when).toLocaleString()})</em>
          </li>
        ))}
      </ul>
    </section>
  )
}
