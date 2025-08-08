import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resetLoading, setResetLoading] = useState(false);
  const [resetMessage, setResetMessage] = useState("");
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      const { user, error } = await signIn(email, password);
      
      if (error) {
        setError(error.message);
        return;
      }
      
      if (user) {
        navigate('/profile');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setError("Please enter your email first");
      return;
    }
    setResetLoading(true);
    setResetMessage("");
    setError("");
    
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + '/reset'
      });
      
      if (error) {
        setError(error.message);
      } else {
        setResetMessage("Check your email for password reset link");
      }
    } catch (err) {
      setError("Failed to send reset email");
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-mint via-background to-sage/5 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <Card className="modern-card-elevated">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-2xl font-display text-foreground mb-2">
              <span className="text-emerald">🌟</span> Welcome Back
            </CardTitle>
            <CardDescription className="text-muted-foreground text-base">
              Sign in to continue your journey in Naturverse
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-lg mb-4">
                {error}
              </div>
            )}
            {resetMessage && (
              <div className="bg-emerald/10 border border-emerald/20 text-emerald px-4 py-3 rounded-lg mb-4">
                {resetMessage}
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-foreground font-medium">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="focus-ring"
                  required
                  data-testid="input-email"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-foreground font-medium">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="focus-ring"
                  required
                  data-testid="input-password"
                />
              </div>
              <Button 
                type="submit" 
                className="w-full btn-primary py-3" 
                disabled={loading} 
                data-testid="button-submit"
              >
                {loading ? "Signing In..." : "🚀 Sign In"}
              </Button>
            </form>
            
            <div className="text-center mt-6 space-y-4">
              <Button
                type="button"
                variant="ghost"
                onClick={handleForgotPassword}
                disabled={resetLoading}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
                data-testid="button-forgot-password"
              >
                {resetLoading ? "Sending..." : "🔑 Forgot password?"}
              </Button>
              
              <div className="pt-4 border-t border-border">
                <p className="text-sm text-muted-foreground">
                  Don't have an account?{" "}
                  <Link to="/signup" className="text-primary hover:text-primary/80 font-medium transition-colors duration-200">
                    🌱 Join Naturverse
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