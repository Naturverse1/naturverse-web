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
import TurianCharacter from "@assets/Turian_1754677394027.jpg";
import CoconutCruze from "@assets/Coconut Cruze_1754677394021.png";
import BluButterfly from "@assets/Blu Butterfly_1754677394021.png";
import FrankieFrogs from "@assets/Frankie Frogs_1754677394022.png";
import MangoMike from "@assets/Mango Mike_1754677394025.png";
import PineapplePapa from "@assets/Pineapple Pa-Pa_1754677394026.png";

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
      
      {/* Floating Naturverse Character Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 animate-float-bounce opacity-80" style={{animationDelay: '0s'}}>
          <img 
            src={CoconutCruze} 
            alt="Coconut Cruze" 
            className="w-18 h-18 rounded-full border-3 border-blue-300/70 shadow-xl bg-blue-50/30 p-1"
            style={{ filter: 'drop-shadow(0 6px 15px rgba(59,130,246,0.4))' }}
          />
        </div>
        <div className="absolute top-40 right-20 animate-gentle-pulse opacity-70" style={{animationDelay: '1s'}}>
          <img 
            src={BluButterfly} 
            alt="Blue Butterfly" 
            className="w-16 h-16 rounded-2xl border-2 border-purple-400/70 shadow-lg bg-purple-50/30"
            style={{ filter: 'drop-shadow(0 4px 12px rgba(147,51,234,0.4))' }}
          />
        </div>
        <div className="absolute bottom-32 left-16 animate-float-bounce opacity-80" style={{animationDelay: '2s'}}>
          <img 
            src={MangoMike} 
            alt="Mango Mike" 
            className="w-16 h-16 rounded-full bg-orange-100/80 p-1 border-3 border-orange-400/70 shadow-xl"
            style={{ filter: 'drop-shadow(0 6px 15px rgba(251,146,60,0.5))' }}
          />
        </div>
        <div className="absolute top-1/3 right-1/3 animate-gentle-pulse opacity-70" style={{animationDelay: '3s'}}>
          <img 
            src={FrankieFrogs} 
            alt="Frankie Frogs" 
            className="w-14 h-14 rounded-lg border-2 border-green-400/70 shadow-lg bg-green-50/30"
            style={{ filter: 'drop-shadow(0 4px 10px rgba(34,197,94,0.4))' }}
          />
        </div>
        <div className="absolute bottom-20 right-32 animate-float-bounce opacity-75" style={{animationDelay: '4s'}}>
          <img 
            src={PineapplePapa} 
            alt="Pineapple Pa-Pa" 
            className="w-14 h-14 rounded-full border-2 border-yellow-400/70 shadow-lg bg-yellow-50/30 object-cover"
            style={{ filter: 'drop-shadow(0 4px 10px rgba(234,179,8,0.4))' }}
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
                src={MangoMike} 
                alt="Mango Mike sparkle" 
                className="w-6 h-6 rounded-full border border-yellow-400 bg-yellow-100"
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
            {/* Character decorative elements */}
            <div className="absolute -top-4 -right-4 animate-gentle-pulse opacity-80" style={{animationDelay: '1s'}}>
              <img 
                src={BluButterfly} 
                alt="Blue Butterfly decoration" 
                className="w-10 h-10 rounded-full border-2 border-blue-300 shadow-lg bg-blue-100/70"
              />
            </div>
            <div className="absolute -bottom-4 -left-4 animate-gentle-pulse opacity-80" style={{animationDelay: '2s'}}>
              <img 
                src={CoconutCruze} 
                alt="Coconut Cruze decoration" 
                className="w-10 h-10 rounded-full border-2 border-green-300 shadow-lg bg-green-100/70"
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
                    src={BluButterfly} 
                    alt="Blue Butterfly decoration" 
                    className="w-8 h-8 mr-3 rounded-xl border-2 border-white/60 bg-white/30 p-1 shadow-lg"
                    style={{ filter: 'drop-shadow(0 3px 8px rgba(255,255,255,0.4))' }}
                  />
                  Continue with Google
                  <img 
                    src={FrankieFrogs} 
                    alt="Frankie Frogs decoration" 
                    className="w-8 h-8 ml-3 rounded-xl border-2 border-white/60 bg-white/30 p-1 shadow-lg"
                    style={{ filter: 'drop-shadow(0 3px 8px rgba(255,255,255,0.4))' }}
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
                          src={TurianCharacter} 
                          alt="Turian character" 
                          className="w-8 h-8 mr-3 rounded-xl border-2 border-white/60 bg-white/30 object-cover shadow-lg"
                          style={{ filter: 'drop-shadow(0 3px 8px rgba(255,255,255,0.4))' }}
                        />
                        Continue with Email
                        <img 
                          src={MangoMike} 
                          alt="Mango Mike decoration" 
                          className="w-8 h-8 ml-3 rounded-xl border-2 border-white/60 bg-white/30 object-cover shadow-lg"
                          style={{ filter: 'drop-shadow(0 3px 8px rgba(255,255,255,0.4))' }}
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
          {/* Turian Character Image with magical border */}
          <div className="relative">
            <img 
              src={TurianCharacter} 
              alt="Turian the durian mascot" 
              className="w-36 h-36 rounded-full object-cover border-4 border-green-400 shadow-2xl bg-gradient-to-br from-green-100 to-yellow-100 p-1"
              style={{
                filter: 'drop-shadow(0 0 25px rgba(34,197,94,0.7))',
              }}
            />
            
            {/* Speech Bubble */}
            <div className="absolute -top-20 -left-36 bg-white/95 backdrop-blur-sm rounded-2xl p-4 shadow-xl border-3 border-green-400 max-w-xs" style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.98) 0%, rgba(240,255,240,0.95) 100%)',
              boxShadow: '0 15px 35px rgba(34,197,94,0.2)'
            }}>
              <div className="text-center">
                <div className="text-lg font-bold mb-2" style={{
                  fontFamily: 'Fredoka, sans-serif',
                  color: '#166534'
                }}>
                  Hi! I'm Turian! 🌿
                </div>
                <div className="text-sm" style={{
                  fontFamily: 'Fredoka, sans-serif',
                  color: '#166534',
                  lineHeight: '1.4'
                }}>
                  "Ready to explore The Naturverse together?"
                </div>
              </div>
              
              {/* Speech bubble pointer */}
              <div className="absolute bottom-0 right-12 transform translate-y-full">
                <div className="w-0 h-0 border-l-[12px] border-r-[12px] border-t-[12px] border-l-transparent border-r-transparent border-t-green-400"></div>
                <div className="w-0 h-0 border-l-[10px] border-r-[10px] border-t-[10px] border-l-transparent border-r-transparent border-t-white absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-[1px]"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}