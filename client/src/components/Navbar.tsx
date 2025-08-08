import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const [location] = useLocation();
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link to="/">
            <div className="text-2xl font-bold text-blue-800" data-testid="link-home">
              The Naturverse
            </div>
          </Link>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Link to="/dashboard">
                  <Button 
                    variant={location === "/dashboard" ? "default" : "ghost"}
                    data-testid="link-dashboard"
                  >
                    Dashboard
                  </Button>
                </Link>
                <Link to="/profile">
                  <Button 
                    variant={location === "/profile" ? "default" : "ghost"}
                    data-testid="link-profile"
                  >
                    Profile
                  </Button>
                </Link>
                <Button 
                  variant="outline" 
                  onClick={handleSignOut}
                  data-testid="button-signout"
                >
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button 
                    variant={location === "/login" ? "default" : "ghost"}
                    data-testid="link-login"
                  >
                    Login
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button 
                    variant={location === "/signup" ? "default" : "outline"}
                    data-testid="link-signup"
                  >
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}