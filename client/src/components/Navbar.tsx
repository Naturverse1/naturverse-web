import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const [location] = useLocation();
  const { user, signOut } = useAuth();

  const navLinks = user
    ? [
        { path: "/", label: "Home" },
        { path: "/dashboard", label: "Dashboard" },
      ]
    : [
        { path: "/", label: "Home" },
        { path: "/login", label: "Login" },
        { path: "/signup", label: "Sign Up" },
      ];

  const handleLogout = async () => {
    await signOut();
    // Navigation to "/" will happen automatically via auth state change
  };

  const isActive = (path: string) => {
    if (path === "/" && location === "/") return true;
    if (path !== "/" && location.startsWith(path)) return true;
    return false;
  };

  return (
    <nav className="bg-white shadow-lg border-b">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link href="/">
              <span className="text-2xl font-bold text-blue-800 cursor-pointer" data-testid="nav-logo">
                The Naturverse
              </span>
            </Link>
            
            <div className="hidden md:flex space-x-4">
              {navLinks.map((link) => (
                <Link key={link.path} href={link.path}>
                  <Button
                    variant={isActive(link.path) ? "default" : "ghost"}
                    className={`${isActive(link.path) ? "bg-blue-600 text-white" : "text-gray-600 hover:text-blue-600"}`}
                    data-testid={`nav-${link.label.toLowerCase().replace(" ", "-")}`}
                  >
                    {link.label}
                  </Button>
                </Link>
              ))}
              {user && (
                <Button
                  onClick={handleLogout}
                  variant="ghost"
                  className="text-gray-600 hover:text-red-600"
                  data-testid="nav-logout"
                >
                  Logout
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}