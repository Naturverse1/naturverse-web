import { Link, useLocation } from "wouter";
import { useAuth } from "../context/AuthContext";

export default function NavBar() {
  const [, setLocation] = useLocation();
  const { user, signOut } = useAuth();

  const handleLogout = async () => {
    await signOut();
    setLocation("/login");
  };

  const linkStyle = {
    textDecoration: 'none' as const,
    color: '#374151',
    fontWeight: '500' as const,
    padding: '0.5rem 1rem',
    borderRadius: '0.375rem',
    transition: 'background-color 0.2s',
    cursor: 'pointer' as const
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.currentTarget.style.backgroundColor = '#f3f4f6';
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.currentTarget.style.backgroundColor = 'transparent';
  };

  const handleButtonMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.style.backgroundColor = '#dc2626';
  };

  const handleButtonMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.style.backgroundColor = '#ef4444';
  };

  return (
    <nav style={{
      backgroundColor: '#ffffff',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      padding: '1rem 2rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderBottom: '1px solid #e5e7eb'
    }}>
      {/* App Name */}
      <div style={{
        fontSize: '1.5rem',
        fontWeight: 'bold',
        color: '#1f2937'
      }}>
        🌱 Naturverse
      </div>

      {/* Navigation Links and Logout */}
      {user && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1.5rem'
        }}>
          <Link href="/dashboard">
            <a 
              style={linkStyle}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              data-testid="nav-dashboard"
            >
              Dashboard
            </a>
          </Link>

          <Link href="/profile">
            <a 
              style={linkStyle}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              data-testid="nav-profile"
            >
              Profile
            </a>
          </Link>

          <button
            onClick={handleLogout}
            style={{
              backgroundColor: '#ef4444',
              color: 'white',
              border: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '0.375rem',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'background-color 0.2s'
            }}
            onMouseEnter={handleButtonMouseEnter}
            onMouseLeave={handleButtonMouseLeave}
            data-testid="nav-logout"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}