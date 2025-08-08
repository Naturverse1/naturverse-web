import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "../context/AuthContext";
import { useLocation, Link } from "wouter";
import { supabase } from "../lib/supabaseClient";
import TurianLogo from "@assets/turian_media_logo_transparent.png";
import MagicalForestImg from "@assets/download_1754675331614.jpg";

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
      {/* Magical Forest Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${MagicalForestImg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      />
      
      {/* Warm storybook overlay */}
      <div className="absolute inset-0" style={{
        background: `linear-gradient(135deg, 
          rgba(255,248,220,0.6) 0%, 
          rgba(255,255,255,0.4) 30%, 
          rgba(245,245,220,0.5) 70%, 
          rgba(255,240,230,0.6) 100%
        )`
      }} />
      
      {/* Gentle Floating Nature Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="text-4xl absolute top-20 left-20 animate-float-bounce opacity-40" style={{animationDelay: '0s'}}>🍃</div>
        <div className="text-3xl absolute top-40 right-20 animate-gentle-pulse opacity-50" style={{animationDelay: '1s'}}>🌿</div>
        <div className="text-4xl absolute bottom-32 left-16 animate-float-bounce opacity-40" style={{animationDelay: '2s'}}>🌱</div>
        <div className="text-3xl absolute top-1/3 right-1/3 animate-gentle-pulse opacity-30" style={{animationDelay: '3s'}}>🦋</div>
        <div className="text-4xl absolute bottom-20 right-32 animate-float-bounce opacity-40" style={{animationDelay: '4s'}}>🍃</div>
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
            background: `
              linear-gradient(135deg, 
                rgba(255,248,220,0.98) 0%, 
                rgba(245,245,220,0.96) 25%,
                rgba(255,250,240,0.98) 50%,
                rgba(240,248,255,0.96) 75%,
                rgba(255,240,245,0.98) 100%
              )
            `,
            borderRadius: '2rem',
            boxShadow: '0 30px 60px rgba(0,0,0,0.2), 0 0 50px rgba(255,215,0,0.3), inset 0 1px 0 rgba(255,255,255,0.6)',
            border: '3px solid rgba(255,215,0,0.4)',
            backgroundImage: `
              radial-gradient(circle at 20% 20%, rgba(255,255,255,0.3) 0%, transparent 50%),
              radial-gradient(circle at 80% 80%, rgba(255,215,0,0.2) 0%, transparent 50%)
            `
          }}>
            {/* Gentle decorative elements */}
            <div className="absolute -top-2 -right-2 text-2xl animate-gentle-pulse opacity-60" style={{animationDelay: '1s'}}>🌸</div>
            <div className="absolute -bottom-2 -left-2 text-2xl animate-gentle-pulse opacity-60" style={{animationDelay: '2s'}}>🌿</div>
            
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
                "Login and let Turian guide you on your adventure!"
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6" style={{ padding: '0 2rem 2rem' }}>
              {/* Google Button - Friendly Fruit Style */}
              <Button
                onClick={handleGoogleSignIn}
                className="w-full text-lg py-6 font-bold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                style={{
                  background: 'linear-gradient(135deg, #4285F4 0%, #34A853 50%, #FBBC05 100%)',
                  color: 'white',
                  borderRadius: '2rem',
                  fontFamily: 'Fredoka, cursive',
                  border: '2px solid rgba(255,255,255,0.3)',
                  textShadow: '1px 1px 2px rgba(0,0,0,0.2)'
                }}
                data-testid="button-google-signin"
              >
                <span className="text-xl mr-3">🌸</span>
                Continue with Google
                <span className="text-xl ml-3">🌸</span>
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
                    borderRadius: '2rem',
                    fontFamily: 'Fredoka, cursive',
                    border: '2px solid rgba(255,255,255,0.3)',
                    textShadow: '1px 1px 2px rgba(0,0,0,0.2)'
                  }}
                  data-testid="button-submit"
                >
                  {loading ? (
                    <>
                      <span className="mr-3 animate-spin">🔄</span>
                      Loading your adventure...
                    </>
                  ) : (
                    <>
                      <span className="text-xl mr-3">🌿</span>
                      Continue with Email
                      <span className="text-xl ml-3">🌿</span>
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

      {/* Turian's Friendly Greeting - Bottom Right */}
      <div className="fixed bottom-6 right-6 z-50">
        <div className="relative animate-float-bounce">
          {/* Friendly Speech Bubble */}
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-4 shadow-lg border-2 border-green-300 max-w-xs relative" style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.98) 0%, rgba(240,255,240,0.95) 100%)',
            boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
          }}>
            <div className="text-center">
              <div className="text-4xl mb-2 animate-gentle-pulse">🥭</div>
              <div className="text-sm font-bold mb-1" style={{
                fontFamily: 'Fredoka, sans-serif',
                color: '#2F5233'
              }}>
                I'm Turian!
              </div>
              <div className="text-xs" style={{
                fontFamily: 'Fredoka, sans-serif',
                color: '#2F5233',
                lineHeight: '1.3'
              }}>
                "Let's explore The Naturverse together!"
              </div>
            </div>
            
            {/* Speech bubble pointer */}
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full">
              <div className="w-0 h-0 border-l-[15px] border-r-[15px] border-t-[15px] border-l-transparent border-r-transparent border-t-green-300"></div>
              <div className="w-0 h-0 border-l-[12px] border-r-[12px] border-t-[12px] border-l-transparent border-r-transparent border-t-white absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-[1px]"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}