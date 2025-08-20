import { zones } from '../data/zones'
import { Link } from 'react-router-dom'

export default function Zones(){
  return (
    <section>
      <h1>Zones</h1>
      <ul>
        {zones.map(z=>(
          <li key={z.path}>
            <Link to={z.path}>{z.title}</Link> — {z.blurb}
          </li>
        ))}
      </ul>
    </section>
  )
}
