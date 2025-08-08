import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const NavBar: React.FC = () => {
  const { user, signOut } = useAuth();
  
  const styles = {
    navbar: {
      backgroundColor: '#222',
      color: '#fff',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '1rem 2rem',
    },
    logo: {
      color: '#fff',
      textDecoration: 'none',
      fontSize: '1.5rem',
      fontWeight: 'bold',
    },
    links: {
      listStyle: 'none' as const,
      display: 'flex',
      gap: '1.5rem',
      margin: 0,
      padding: 0,
    },
    link: {
      color: '#fff',
      textDecoration: 'none',
      fontWeight: 500 as const,
    },
    button: {
      background: 'none',
      border: 'none',
      color: '#fff',
      textDecoration: 'none',
      fontWeight: 500 as const,
      cursor: 'pointer',
    }
  };

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <nav style={styles.navbar}>
      <div>
        <Link to="/" style={styles.logo}>Naturverse</Link>
      </div>
      <ul style={styles.links}>
        <li><Link to="/" style={styles.link}>Home</Link></li>
        <li><Link to="/about" style={styles.link}>About</Link></li>
        {user ? (
          <>
            <li><Link to="/profile" style={styles.link}>Profile</Link></li>
            <li>
              <button onClick={handleSignOut} style={styles.button}>
                Sign Out
              </button>
            </li>
          </>
        ) : (
          <>
            <li><Link to="/signup" style={styles.link}>Sign Up</Link></li>
            <li><Link to="/login" style={styles.link}>Login</Link></li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default NavBar;