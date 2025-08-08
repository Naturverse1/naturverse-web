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
import CharacterImg from "@assets/Character img_1754673794865.jpg";
import StorybookImg from "@assets/Storybook img_1754673794866.jpg";
import ShroomForestImg from "@assets/Shroom forest_1754673794866.jpg";
import BookImg from "@assets/book img_1754673794864.jpg";

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
      
      {/* Floating Real Asset Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 animate-float-bounce opacity-70" style={{animationDelay: '0s'}}>
          <img 
            src={StorybookImg} 
            alt="Storybook element" 
            className="w-16 h-16 rounded-2xl border-3 border-pink-300/60 shadow-xl bg-white/20 p-1"
            style={{ filter: 'drop-shadow(0 4px 12px rgba(255,192,203,0.4))' }}
          />
        </div>
        <div className="absolute top-40 right-20 animate-gentle-pulse opacity-60" style={{animationDelay: '1s'}}>
          <img 
            src={ShroomForestImg} 
            alt="Magical forest" 
            className="w-12 h-12 rounded-full border-2 border-green-400/60 shadow-lg bg-white/20"
            style={{ filter: 'drop-shadow(0 4px 8px rgba(34,197,94,0.4))' }}
          />
        </div>
        <div className="absolute bottom-32 left-16 animate-float-bounce opacity-70" style={{animationDelay: '2s'}}>
          <img 
            src={TurianLogo} 
            alt="Turian mascot" 
            className="w-14 h-14 rounded-full bg-yellow-100/80 p-2 border-2 border-yellow-400/60 shadow-xl"
            style={{ filter: 'drop-shadow(0 4px 12px rgba(255,215,0,0.5))' }}
          />
        </div>
        <div className="absolute top-1/3 right-1/3 animate-gentle-pulse opacity-50" style={{animationDelay: '3s'}}>
          <img 
            src={BookImg} 
            alt="Storybook page" 
            className="w-10 h-10 rounded-lg border-2 border-purple-300/60 shadow-lg bg-white/30"
            style={{ filter: 'drop-shadow(0 3px 8px rgba(147,51,234,0.3))' }}
          />
        </div>
        <div className="absolute bottom-20 right-32 animate-float-bounce opacity-60" style={{animationDelay: '4s'}}>
          <img 
            src={CharacterImg} 
            alt="Character" 
            className="w-12 h-12 rounded-full border-2 border-blue-300/60 shadow-lg bg-white/20 object-cover"
            style={{ filter: 'drop-shadow(0 4px 8px rgba(59,130,246,0.4))' }}
          />
        </div>
      </div>

      {/* Naturverse Logo in Top Corner */}
      <div className="absolute top-6 left-6 z-50">
        <Link to="/" className="flex items-center gap-3 hover:scale-105 transition-transform duration-300">
          <div className="relative">
            <img 
              src={TurianLogo} 
              alt="The Naturverse" 
              className="w-16 h-16 drop-shadow-2xl animate-gentle-pulse rounded-full border-2 border-white/60 bg-white/20 p-1"
            />
            <div className="absolute -top-1 -right-1 animate-sparkle-twinkle">
              <img 
                src={StorybookImg} 
                alt="Magic sparkle" 
                className="w-5 h-5 rounded-full border border-yellow-400 bg-yellow-100"
              />
            </div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm px-3 py-1 rounded-full border border-white/60">
            <span className="text-display text-xl font-bold text-gradient">The Naturverse™</span>
          </div>
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
            {/* Real asset decorative elements */}
            <div className="absolute -top-3 -right-3 animate-gentle-pulse opacity-70" style={{animationDelay: '1s'}}>
              <img 
                src={StorybookImg} 
                alt="Decorative storybook" 
                className="w-8 h-8 rounded-full border border-pink-300 shadow-lg bg-pink-100/60"
              />
            </div>
            <div className="absolute -bottom-3 -left-3 animate-gentle-pulse opacity-70" style={{animationDelay: '2s'}}>
              <img 
                src={ShroomForestImg} 
                alt="Decorative forest" 
                className="w-8 h-8 rounded-full border border-green-300 shadow-lg bg-green-100/60"
              />
            </div>
            
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
              {/* Google Button with Storybook Theme */}
              <Button
                onClick={handleGoogleSignIn}
                className="w-full text-lg py-6 font-bold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 relative overflow-hidden"
                style={{
                  background: 'linear-gradient(135deg, #4285F4 0%, #34A853 50%, #FBBC05 100%)',
                  color: 'white',
                  borderRadius: '2rem',
                  fontFamily: 'Fredoka, cursive',
                  border: '3px solid rgba(255,255,255,0.4)',
                  textShadow: '1px 1px 2px rgba(0,0,0,0.2)',
                  boxShadow: '0 8px 25px rgba(66,133,244,0.3), inset 0 1px 0 rgba(255,255,255,0.3)'
                }}
                data-testid="button-google-signin"
              >
                <div className="absolute top-1 left-3 w-6 h-6 rounded-full bg-white/20 animate-gentle-pulse"></div>
                <div className="flex items-center justify-center">
                  <img 
                    src={StorybookImg} 
                    alt="Storybook decoration" 
                    className="w-8 h-8 mr-3 rounded-xl border-2 border-white/50 bg-white/20 p-1 shadow-lg"
                    style={{ filter: 'drop-shadow(0 2px 6px rgba(255,255,255,0.3))' }}
                  />
                  Continue with Google
                  <img 
                    src={BookImg} 
                    alt="Book decoration" 
                    className="w-8 h-8 ml-3 rounded-xl border-2 border-white/50 bg-white/20 p-1 shadow-lg"
                    style={{ filter: 'drop-shadow(0 2px 6px rgba(255,255,255,0.3))' }}
                  />
                </div>
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
                  className="w-full text-lg py-6 font-bold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 relative overflow-hidden"
                  style={{
                    background: 'linear-gradient(135deg, #22C55E 0%, #16A34A 100%)',
                    color: 'white',
                    borderRadius: '2rem',
                    fontFamily: 'Fredoka, cursive',
                    border: '3px solid rgba(255,255,255,0.4)',
                    textShadow: '1px 1px 2px rgba(0,0,0,0.2)',
                    boxShadow: '0 8px 25px rgba(34,197,94,0.3), inset 0 1px 0 rgba(255,255,255,0.3)'
                  }}
                  data-testid="button-submit"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin mr-3 w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
                      Loading your adventure...
                    </>
                  ) : (
                    <>
                      <div className="absolute top-1 left-3 w-6 h-6 rounded-full bg-white/20 animate-gentle-pulse"></div>
                      <div className="flex items-center justify-center">
                        <img 
                          src={TurianLogo} 
                          alt="Turian mascot" 
                          className="w-8 h-8 mr-3 rounded-xl border-2 border-white/50 bg-white/20 p-1 shadow-lg"
                          style={{ filter: 'drop-shadow(0 2px 6px rgba(255,255,255,0.3))' }}
                        />
                        Continue with Email
                        <img 
                          src={CharacterImg} 
                          alt="Character decoration" 
                          className="w-8 h-8 ml-3 rounded-xl border-2 border-white/50 bg-white/20 object-cover shadow-lg"
                          style={{ filter: 'drop-shadow(0 2px 6px rgba(255,255,255,0.3))' }}
                        />
                      </div>
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

      {/* Turian Character - Bottom Right */}
      <div className="fixed bottom-6 right-6 z-50">
        <div className="relative animate-float-bounce">
          {/* Character Image with magical border */}
          <div className="relative">
            <img 
              src={CharacterImg} 
              alt="Turian mascot character" 
              className="w-32 h-32 rounded-full object-cover border-4 border-yellow-400 shadow-2xl"
              style={{
                filter: 'drop-shadow(0 0 20px rgba(255,215,0,0.6))',
                background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,248,220,0.9) 100%)'
              }}
            />
            
            {/* Speech Bubble */}
            <div className="absolute -top-16 -left-32 bg-white/95 backdrop-blur-sm rounded-2xl p-3 shadow-lg border-2 border-green-300 max-w-xs" style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.98) 0%, rgba(240,255,240,0.95) 100%)',
              boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
            }}>
              <div className="text-center">
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
              <div className="absolute bottom-0 right-8 transform translate-y-full">
                <div className="w-0 h-0 border-l-[10px] border-r-[10px] border-t-[10px] border-l-transparent border-r-transparent border-t-green-300"></div>
                <div className="w-0 h-0 border-l-[8px] border-r-[8px] border-t-[8px] border-l-transparent border-r-transparent border-t-white absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-[1px]"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}