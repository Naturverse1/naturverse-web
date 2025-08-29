import { Link } from 'react-router-dom'
import styles from './Header.module.css'
import { useAuth } from '../hooks/useAuth'
import NavatarBadge from './NavatarBadge'
import { getProfile } from '../lib/profile'
import { useEffect, useState } from 'react'

export default function Header() {
  const { user, loading } = useAuth()
  const [svg, setSvg] = useState<string>()

  useEffect(() => {
    if (!user) { setSvg(undefined); return }
    const cached = localStorage.getItem('navatar_svg')
    if (cached) { setSvg(cached); return }
    getProfile(user.id).then(p => {
      if (p?.avatar_id) {
        const c = localStorage.getItem('navatar_svg')
        if (c) setSvg(c)
      }
    })
  }, [user])

  return (
    <header className={styles.header}>
      <div className={styles.brand}>
        <Link to="/">🌿 Naturverse</Link>
      </div>

      {!loading && user && (
        <nav className={styles.nav}>
          <NavatarBadge svg={svg} size={28} alt="Your Navatar" />
          <Link to="/worlds">Worlds</Link>
          <Link to="/zones">Zones</Link>
          <Link to="/marketplace">Marketplace</Link>
          <Link to="/wishlist">Wishlist</Link>
          <Link to="/naturversity">Naturversity</Link>
          <Link to="/naturbank">NaturBank</Link>
          <Link to="/navatar">Navatar</Link>
          <Link to="/passport">Passport</Link>
          <Link to="/turian">Turian</Link>
          <Link to="/cart" aria-label="Cart">🛒</Link>
        </nav>
      )}
    </header>
  )
}
