import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <section>
      <h2>404 — Not found</h2>
      <p>The page you’re looking for doesn’t exist.</p>
      <p><Link to="/">Go home</Link></p>
    </section>
  )
}
