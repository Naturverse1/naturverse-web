import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const NavBar: React.FC = () => {
  const { user, signOut } = useAuth();
  
  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <nav className="gradient-bg shadow-lg">
      <div className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="font-fredoka text-2xl text-white hover:text-sunny transition-colors duration-200">
            🌿 Naturverse
          </Link>
          
          <ul className="flex items-center space-x-6">
            <li>
              <Link to="/" className="text-white hover:text-sunny transition-colors duration-200 font-medium">
                Home
              </Link>
            </li>
            <li>
              <Link to="/about" className="text-white hover:text-sunny transition-colors duration-200 font-medium">
                About
              </Link>
            </li>
            {user ? (
              <>
                <li>
                  <Link to="/profile" className="text-white hover:text-sunny transition-colors duration-200 font-medium">
                    Profile
                  </Link>
                </li>
                <li>
                  <button 
                    onClick={handleSignOut}
                    className="bg-coral hover:bg-red-500 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
                  >
                    Sign Out
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link to="/signup" className="text-white hover:text-sunny transition-colors duration-200 font-medium">
                    Sign Up
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/login" 
                    className="bg-turquoise hover:bg-teal-500 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
                  >
                    Login
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;