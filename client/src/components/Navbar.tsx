import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const [location] = useLocation();
  const { user, profile, signOut } = useAuth();

  const navLinks = [{ path: "/", label: "Home" }];
  const authLinks = user ? [] : [
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
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center space-x-2" data-testid="nav-user-menu">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={profile?.avatar_url || undefined} />
                        <AvatarFallback>{user.email?.[0]?.toUpperCase() || 'U'}</AvatarFallback>
                      </Avatar>
                      <span className="hidden md:block">{profile?.display_name || user.email}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link href="/profile" data-testid="nav-profile">Profile</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard" data-testid="nav-dashboard">Dashboard</Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} data-testid="nav-logout">
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <>
                  {authLinks.map((link) => (
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
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}