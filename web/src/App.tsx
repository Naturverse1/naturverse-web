import { Link, Outlet } from 'react-router-dom'

export default function App() {
  return (
    <div style={{ maxWidth: 960, margin: '40px auto', padding: '0 16px' }}>
      <header style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
        <h1 style={{ margin: 0, fontSize: 24 }}>The Naturverse</h1>
        <nav style={{ display: 'flex', gap: 12 }}>
          <Link to="/">Home</Link>
          <Link to="/health">Health</Link>
        </nav>
      </header>
      <main style={{ marginTop: 24 }}>
        <Outlet />
      </main>
    </div>
  )
}
