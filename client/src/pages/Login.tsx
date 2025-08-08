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
    <div className="min-h-screen magic-gradient flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <Card className="backdrop-blur-sm bg-white/95 border-nature/20 shadow-xl">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-3xl font-fredoka text-forest mb-2">
              🌟 Welcome Back
            </CardTitle>
            <CardDescription className="text-forest/80 text-lg">
              Sign in to continue your magical journey in The Naturverse
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="bg-coral/10 border border-coral/20 text-coral px-4 py-3 rounded-lg mb-4">
                {error}
              </div>
            )}
            {resetMessage && (
              <div className="bg-nature/10 border border-nature/20 text-forest px-4 py-3 rounded-lg mb-4">
                {resetMessage}
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
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="border-nature/20 focus:border-nature focus:ring-nature/20"
                  required
                  data-testid="input-password"
                />
              </div>
              <Button 
                type="submit" 
                className="w-full bg-nature hover:bg-forest text-white transition-colors duration-200 py-3" 
                disabled={loading} 
                data-testid="button-submit"
              >
                {loading ? "🌿 Signing In..." : "🚀 Sign In"}
              </Button>
            </form>
            
            <div className="text-center mt-6 space-y-4">
              <Button
                type="button"
                variant="ghost"
                onClick={handleForgotPassword}
                disabled={resetLoading}
                className="text-sm text-magic hover:text-coral transition-colors duration-200"
                data-testid="button-forgot-password"
              >
                {resetLoading ? "Sending..." : "🔑 Forgot password?"}
              </Button>
              
              <div className="pt-4 border-t border-nature/10">
                <p className="text-sm text-forest/70">
                  Don't have an account?{" "}
                  <Link to="/signup" className="text-magic hover:text-coral font-medium transition-colors duration-200">
                    🌱 Join The Adventure
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