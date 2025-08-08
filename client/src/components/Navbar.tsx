import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  const [location] = useLocation();

  const navLinks = [
    { path: "/", label: "Home" },
    { path: "/signup", label: "Sign Up" },
    { path: "/login", label: "Login" },
    { path: "/dashboard", label: "Dashboard" },
  ];

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
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}