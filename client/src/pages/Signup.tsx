import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }
    
    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      setLoading(false);
      return;
    }
    
    try {
      const { user, error } = await signUp(email, password);
      
      if (error) {
        setError(error.message);
        return;
      }
      
      if (user) {
        // Insert user into users table (ignore if already exists)
        await supabase
          .from('users')
          .insert([{ id: user.id, email: user.email }])
          .select()
          .single();
        
        navigate('/profile');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <Card className="backdrop-blur-sm bg-white/95 border-nature/20 shadow-xl">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-3xl font-fredoka text-forest mb-2">
              🌱 Join The Adventure
            </CardTitle>
            <CardDescription className="text-forest/80 text-lg">
              Create your account to explore The Naturverse
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="bg-coral/10 border border-coral/20 text-coral px-4 py-3 rounded-lg mb-4">
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-forest font-medium">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="border-nature/20 focus:border-nature focus:ring-nature/20"
                  required
                  data-testid="input-email"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-forest font-medium">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Create a password (min 6 characters)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="border-nature/20 focus:border-nature focus:ring-nature/20"
                  required
                  data-testid="input-password"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-forest font-medium">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="border-nature/20 focus:border-nature focus:ring-nature/20"
                  required
                  data-testid="input-confirm-password"
                />
              </div>
              <Button 
                type="submit" 
                className="w-full bg-turquoise hover:bg-teal-600 text-white transition-colors duration-200 py-3" 
                disabled={loading} 
                data-testid="button-submit"
              >
                {loading ? "🌟 Creating Account..." : "✨ Create Account"}
              </Button>
            </form>
            
            <div className="text-center mt-6">
              <div className="pt-4 border-t border-nature/10">
                <p className="text-sm text-forest/70">
                  Already have an account?{" "}
                  <Link to="/login" className="text-magic hover:text-coral font-medium transition-colors duration-200">
                    🚀 Sign In Here
                  </Link>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}