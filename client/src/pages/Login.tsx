import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "../context/AuthContext";
import { useLocation, Link } from "wouter";
import { supabase } from "../lib/supabaseClient";
import TurianLogo from "@assets/turian_media_logo_transparent.png";
import BookImg from "@assets/book img_1754673794864.jpg";
import ShroomForestImg from "@assets/Shroom forest_1754673794866.jpg";
import StorybookImg from "@assets/Storybook img_1754673794866.jpg";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resetLoading, setResetLoading] = useState(false);
  const [resetMessage, setResetMessage] = useState("");
  const { signIn } = useAuth();
  const [location, setLocation] = useLocation();

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
        setLocation('/profile');
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

  const handleGoogleSignIn = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin + '/profile'
        }
      });
      if (error) setError(error.message);
    } catch (err) {
      setError('Google sign-in failed');
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Magical Storybook Background Layers */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40"
        style={{
          backgroundImage: `url(${BookImg})`,
          filter: 'sepia(20%) saturate(120%) hue-rotate(15deg)'
        }}
      />
      
      {/* Enchanted Forest Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30 mix-blend-soft-light"
        style={{
          backgroundImage: `url(${ShroomForestImg})`,
          backgroundPosition: 'center bottom'
        }}
      />
      
      {/* Magical Gradient Overlay */}
      <div className="absolute inset-0" style={{
        background: `
          linear-gradient(135deg, 
            rgba(255,182,193,0.3) 0%,    /* Light pink */
            rgba(173,216,230,0.3) 25%,   /* Light blue */
            rgba(152,251,152,0.3) 50%,   /* Pale green */
            rgba(255,218,185,0.3) 75%,   /* Peach */
            rgba(221,160,221,0.3) 100%   /* Plum */
          )
        `
      }} />
      
      {/* Floating Magical Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="text-6xl absolute top-10 left-20 animate-float-bounce opacity-60">🍎</div>
        <div className="text-5xl absolute top-32 right-16 animate-sparkle-twinkle opacity-70" style={{animationDelay: '0.5s'}}>✨</div>
        <div className="text-4xl absolute bottom-20 left-32 animate-float-bounce opacity-60" style={{animationDelay: '1s'}}>🍊</div>
        <div className="text-6xl absolute top-20 right-40 animate-gentle-pulse opacity-50" style={{animationDelay: '1.5s'}}>☁️</div>
        <div className="text-5xl absolute bottom-32 right-20 animate-sparkle-twinkle opacity-60" style={{animationDelay: '2s'}}>🌟</div>
        <div className="text-4xl absolute top-1/2 left-10 animate-float-bounce opacity-70" style={{animationDelay: '2.5s'}}>🍇</div>
        <div className="text-3xl absolute bottom-10 left-1/2 animate-gentle-pulse opacity-60" style={{animationDelay: '3s'}}>💫</div>
        <div className="text-5xl absolute top-40 left-1/2 animate-sparkle-twinkle opacity-50" style={{animationDelay: '0.8s'}}>🦋</div>
      </div>

      {/* Naturverse Logo in Top Corner */}
      <div className="absolute top-6 left-6 z-50">
        <Link to="/" className="flex items-center gap-2 hover:scale-105 transition-transform duration-300">
          <img 
            src={TurianLogo} 
            alt="The Naturverse" 
            className="w-12 h-12 drop-shadow-2xl animate-gentle-pulse"
          />
          <span className="text-display text-xl font-bold text-gradient">The Naturverse™</span>
        </Link>
      </div>

      {/* Centered Login Card */}
      <div className="flex items-center justify-center min-h-screen p-6 relative z-10">
        <div className="w-full max-w-md animate-card-float-in">
          {/* Magical Login Card */}
          <Card className="relative backdrop-blur-lg border-0 shadow-2xl" style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(240,255,240,0.95) 100%)',
            borderRadius: '2rem',
            boxShadow: '0 25px 50px rgba(0,0,0,0.15), 0 0 40px rgba(34,139,34,0.2)',
            border: '2px solid rgba(255,255,255,0.3)'
          }}>
            {/* Orbiting sparkles around the card */}
            <div className="absolute -top-3 -right-3 text-3xl animate-sparkle-orbit">✨</div>
            <div className="absolute -bottom-3 -left-3 text-3xl animate-sparkle-orbit-reverse">🌟</div>
            
            <CardHeader className="text-center pb-6" style={{ paddingTop: '2rem' }}>
              <CardTitle className="text-4xl font-bold mb-4" style={{
                fontFamily: 'Fredoka, cursive',
                background: 'linear-gradient(135deg, #228B22 0%, #32CD32 25%, #FFD700 50%, #FF6347 75%, #8A2BE2 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                textShadow: '2px 2px 4px rgba(0,0,0,0.1)'
              }}>
                Welcome to The Naturverse™
              </CardTitle>
              
              {/* Turian's Welcome Message */}
              <CardDescription className="text-lg mb-4" style={{
                fontFamily: 'Fredoka, sans-serif',
                color: '#2F5233',
                fontWeight: '500'
              }}>
                <span className="text-2xl mr-2">🧙‍♂️</span>
                "Hello, young explorer! Log in to begin your magical adventure with me, Turian!"
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6" style={{ padding: '0 2rem 2rem' }}>
              {/* Google Login Button */}
              <Button
                onClick={handleGoogleSignIn}
                className="w-full text-lg py-6 font-bold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                style={{
                  background: 'linear-gradient(135deg, #4285F4 0%, #34A853 100%)',
                  color: 'white',
                  borderRadius: '1.5rem',
                  fontFamily: 'Fredoka, cursive',
                  border: '2px solid rgba(255,255,255,0.3)'
                }}
                data-testid="button-google-signin"
              >
                <span className="text-2xl mr-3">🌟</span>
                Continue with Google Magic
              </Button>

              {/* Divider */}
              <div className="relative text-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t-2" style={{ borderColor: 'rgba(34,139,34,0.2)' }}></div>
                </div>
                <div className="relative inline-block px-4" style={{ 
                  background: 'rgba(255,255,255,0.9)',
                  fontFamily: 'Fredoka, sans-serif',
                  color: '#2F5233',
                  fontWeight: '600'
                }}>
                  <span className="text-xl mr-2">✨</span>
                  Or use your email
                  <span className="text-xl ml-2">✨</span>
                </div>
              </div>

              {/* Email Login Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-base font-bold" style={{
                    color: '#2F5233',
                    fontFamily: 'Fredoka, sans-serif'
                  }}>
                    <span className="mr-2">📧</span>
                    Your Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="explorer@naturverse.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="text-base py-3 px-4 border-2 focus:border-green-400 focus:ring-green-200"
                    style={{
                      borderRadius: '1rem',
                      borderColor: 'rgba(34,139,34,0.3)',
                      fontFamily: 'Inter, sans-serif'
                    }}
                    required
                    data-testid="input-email"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-base font-bold" style={{
                    color: '#2F5233',
                    fontFamily: 'Fredoka, sans-serif'
                  }}>
                    <span className="mr-2">🔐</span>
                    Your Secret Code
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Your magical password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="text-base py-3 px-4 border-2 focus:border-green-400 focus:ring-green-200"
                    style={{
                      borderRadius: '1rem',
                      borderColor: 'rgba(34,139,34,0.3)',
                      fontFamily: 'Inter, sans-serif'
                    }}
                    required
                    data-testid="input-password"
                  />
                </div>

                {error && (
                  <div className="p-3 text-center rounded-xl" style={{
                    background: 'rgba(239, 68, 68, 0.1)',
                    color: '#DC2626',
                    border: '2px solid rgba(239, 68, 68, 0.2)',
                    fontFamily: 'Fredoka, sans-serif',
                    fontWeight: '500'
                  }}>
                    <span className="mr-2">⚠️</span>
                    {error}
                  </div>
                )}

                {resetMessage && (
                  <div className="p-3 text-center rounded-xl" style={{
                    background: 'rgba(34, 197, 94, 0.1)',
                    color: '#059669',
                    border: '2px solid rgba(34, 197, 94, 0.2)',
                    fontFamily: 'Fredoka, sans-serif',
                    fontWeight: '500'
                  }}>
                    <span className="mr-2">📬</span>
                    {resetMessage}
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full text-lg py-6 font-bold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                  style={{
                    background: 'linear-gradient(135deg, #22C55E 0%, #16A34A 100%)',
                    color: 'white',
                    borderRadius: '1.5rem',
                    fontFamily: 'Fredoka, cursive',
                    border: '2px solid rgba(255,255,255,0.3)'
                  }}
                  data-testid="button-submit"
                >
                  {loading ? (
                    <>
                      <span className="mr-3">🔄</span>
                      Entering the magical realm...
                    </>
                  ) : (
                    <>
                      <span className="mr-3">🚀</span>
                      Enter The Naturverse
                    </>
                  )}
                </Button>
              </form>

              {/* Forgot Password Link */}
              <div className="text-center">
                <button
                  onClick={handleForgotPassword}
                  disabled={resetLoading}
                  className="text-green-700 hover:text-green-800 underline transition-colors duration-200"
                  style={{
                    fontFamily: 'Fredoka, sans-serif',
                    fontWeight: '500'
                  }}
                  data-testid="button-forgot-password"
                >
                  {resetLoading ? (
                    <>🔄 Sending magical reset...</>
                  ) : (
                    <>🔮 Forgot your magical password?</>
                  )}
                </button>
              </div>

              {/* Sign Up Link */}
              <div className="text-center pt-4">
                <p style={{
                  fontFamily: 'Fredoka, sans-serif',
                  color: '#2F5233',
                  fontSize: '1rem'
                }}>
                  New to our magical world?{' '}
                  <Link 
                    to="/signup"
                    className="text-green-700 hover:text-green-800 underline font-bold transition-colors duration-200"
                    data-testid="link-signup"
                  >
                    <span className="mr-1">✨</span>
                    Create Your Adventure
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}