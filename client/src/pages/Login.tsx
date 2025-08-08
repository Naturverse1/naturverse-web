import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "../context/AuthContext";
import { useLocation, Link } from "wouter";
import { supabase } from "../lib/supabaseClient";

// Official Naturverse™ Assets
import TurianLogo from "@assets/turian_media_logo_transparent.png";
import MagicalForestImg from "@assets/download_1754675331614.jpg";
import TurianCharacter from "@assets/Turian_1754677394027.jpg";
import StorybookScene from "@assets/Storybook img_1754673794866.jpg";
import ShroomForest from "@assets/Shroom forest_1754673794866.jpg";

// Character Assets
import CoconutCruze from "@assets/Coconut Cruze_1754677394021.png";
import BluButterfly from "@assets/Blu Butterfly_1754677394021.png";
import FrankieFrogs from "@assets/Frankie Frogs_1754677394022.png";
import DrP from "@assets/Dr P_1754677394022.png";
import Inkie from "@assets/Inkie_1754677394023.png";
import JaySing from "@assets/Jay-Sing_1754677394023.png";
import NikkiMT from "@assets/Nikki MT_1754677394025.png";
import NonBua from "@assets/Non-Bua_1754677394025.png";
import PineapplePapa from "@assets/Pineapple Pa-Pa_1754677394026.png";
import PineapplePetey from "@assets/Pineapple Petey_1754677394026.png";
import Snakers from "@assets/Snakers_1754677394026.png";
import Teeyor from "@assets/Teeyor_1754677394026.png";
import TommyTukTuk from "@assets/Tommy Tuk Tuk_1754677394026.png";

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

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError("");
    
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/profile`
        }
      });
      
      if (error) {
        setError(error.message);
      }
    } catch (err) {
      setError('Failed to sign in with Google');
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
    setLoading(true);
    setError("");
    
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin + '/profile'
        }
      });
      
      if (error) {
        setError(error.message);
      }
    } catch (err) {
      setError('Failed to sign in with Google');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Naturverse™ Logo Header - Always Visible */}
      <div className="absolute top-6 left-1/2 transform -translate-x-1/2 z-50">
        <div className="flex items-center justify-center bg-white/95 backdrop-blur-sm px-8 py-4 rounded-3xl shadow-2xl border-4 border-yellow-400/80">
          <img 
            src={TurianLogo} 
            alt="The Naturverse™" 
            className="w-16 h-16 mr-4"
          />
          <h1 className="text-3xl font-bold text-green-700" style={{ fontFamily: 'Fredoka, sans-serif' }}>
            The Naturverse™
          </h1>
        </div>
      </div>

      {/* Magical Storybook Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat" 
        style={{
          backgroundImage: `
            linear-gradient(
              135deg,
              rgba(34, 197, 94, 0.2) 0%,
              rgba(59, 130, 246, 0.25) 30%,
              rgba(251, 146, 60, 0.2) 60%,
              rgba(234, 179, 8, 0.25) 100%
            ),
            url(${StorybookScene})
          `,
        }}
      />
      
      {/* Enhanced Magical Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br" style={{
        background: `
          radial-gradient(circle at 15% 25%, rgba(34,197,94,0.3) 0%, transparent 50%),
          radial-gradient(circle at 85% 15%, rgba(59,130,246,0.2) 0%, transparent 50%),
          radial-gradient(circle at 75% 85%, rgba(251,146,60,0.25) 0%, transparent 50%),
          radial-gradient(circle at 25% 75%, rgba(234,179,8,0.2) 0%, transparent 50%),
          linear-gradient(
            135deg, 
            rgba(195, 225, 245, 0.7) 0%, 
            rgba(220, 255, 220, 0.6) 25%, 
            rgba(255, 235, 200, 0.6) 75%, 
            rgba(255, 248, 220, 0.7) 100%
          )`
      }} />

      {/* Floating Character Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
        <div className="absolute top-32 left-16 animate-float-bounce opacity-90" style={{animationDelay: '0s'}}>
          <div className="w-24 h-24 p-2 bg-white/80 rounded-3xl border-4 border-blue-300 shadow-2xl">
            <img 
              src={CoconutCruze} 
              alt="Coconut Cruze" 
              className="w-full h-full object-cover rounded-2xl"
            />
          </div>
        </div>
        
        <div className="absolute top-48 right-20 animate-gentle-pulse opacity-80" style={{animationDelay: '1s'}}>
          <div className="w-20 h-20 p-2 bg-white/80 rounded-full border-4 border-purple-300 shadow-xl">
            <img 
              src={BluButterfly} 
              alt="Blue Butterfly" 
              className="w-full h-full object-cover rounded-full"
            />
          </div>
        </div>
        
        <div className="absolute bottom-40 left-20 animate-float-bounce opacity-85" style={{animationDelay: '2s'}}>
          <div className="w-22 h-22 p-2 bg-white/80 rounded-2xl border-4 border-green-400 shadow-xl">
            <img 
              src={FrankieFrogs} 
              alt="Frankie Frogs" 
              className="w-full h-full object-cover rounded-xl"
            />
          </div>
        </div>
        
        <div className="absolute top-1/3 right-1/4 animate-gentle-pulse opacity-75" style={{animationDelay: '3s'}}>
          <div className="w-18 h-18 p-2 bg-white/80 rounded-full border-4 border-orange-400 shadow-lg">
            <img 
              src={DrP} 
              alt="Dr P" 
              className="w-full h-full object-cover rounded-full"
            />
          </div>
        </div>
        
        <div className="absolute bottom-32 right-28 animate-float-bounce opacity-80" style={{animationDelay: '4s'}}>
          <div className="w-20 h-20 p-2 bg-white/80 rounded-2xl border-4 border-yellow-400 shadow-xl">
            <img 
              src={PineapplePapa} 
              alt="Pineapple Pa-Pa" 
              className="w-full h-full object-cover rounded-xl"
            />
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center pt-24 pb-8">
        <div className="w-full max-w-md px-6 relative z-20">
          <Card className="bg-white/95 backdrop-blur-md border-4 border-green-300/60 shadow-2xl rounded-3xl overflow-hidden">
            {/* Magical Header */}
            <CardHeader className="text-center pb-4 bg-gradient-to-br from-green-50 to-blue-50">
              <div className="flex justify-center mb-4">
                <div className="relative">
                  <img 
                    src={TurianCharacter} 
                    alt="Turian the Durian" 
                    className="w-24 h-24 rounded-full object-cover border-4 border-green-400 shadow-xl bg-gradient-to-br from-green-100 to-yellow-100 p-1"
                  />
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full border-2 border-white animate-bounce">
                    <span className="text-lg">✨</span>
                  </div>
                </div>
              </div>
              
              <CardTitle className="text-3xl font-bold text-green-700 mb-2" style={{ fontFamily: 'Fredoka, sans-serif' }}>
                Welcome to The Naturverse!
              </CardTitle>
              <CardDescription className="text-lg text-green-600" style={{ fontFamily: 'Fredoka, sans-serif' }}>
                Join Turian and friends on magical adventures! 🌿
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6 p-8">
              {error && (
                <div className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-xl font-medium">
                  {error}
                </div>
              )}
              
              {resetMessage && (
                <div className="bg-green-50 border-2 border-green-200 text-green-700 px-4 py-3 rounded-xl font-medium">
                  {resetMessage}
                </div>
              )}

              {/* Google Sign In */}
              <Button 
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="w-full py-4 text-lg font-bold rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transition-all duration-300 hover:scale-105 shadow-xl border-2 border-blue-300/50"
                style={{ fontFamily: 'Fredoka, sans-serif' }}
                data-testid="button-google-signin"
              >
                <div className="flex items-center justify-center space-x-3">
                  <div className="w-8 h-8 p-1 bg-white/90 rounded-lg">
                    <img 
                      src={BluButterfly} 
                      alt="Magic" 
                      className="w-full h-full object-cover rounded-md"
                    />
                  </div>
                  <span>Continue with Google</span>
                  <div className="w-8 h-8 p-1 bg-white/90 rounded-lg">
                    <img 
                      src={FrankieFrogs} 
                      alt="Magic" 
                      className="w-full h-full object-cover rounded-md"
                    />
                  </div>
                </div>
              </Button>

              <div className="text-center text-gray-500 font-medium">
                <span style={{ fontFamily: 'Fredoka, sans-serif' }}>or</span>
              </div>

              {/* Email Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-lg font-bold text-green-700" style={{ fontFamily: 'Fredoka, sans-serif' }}>
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="py-3 text-lg rounded-xl border-2 border-green-200 focus:border-green-400 bg-white/90"
                    style={{ fontFamily: 'Fredoka, sans-serif' }}
                    data-testid="input-email"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-lg font-bold text-green-700" style={{ fontFamily: 'Fredoka, sans-serif' }}>
                    Password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="py-3 text-lg rounded-xl border-2 border-green-200 focus:border-green-400 bg-white/90"
                    style={{ fontFamily: 'Fredoka, sans-serif' }}
                    data-testid="input-password"
                    required
                  />
                </div>

                <Button 
                  type="submit" 
                  disabled={loading}
                  className="w-full py-4 text-lg font-bold rounded-2xl bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 transition-all duration-300 hover:scale-105 shadow-xl border-2 border-green-300/50"
                  style={{ fontFamily: 'Fredoka, sans-serif' }}
                  data-testid="button-email-signin"
                >
                  <div className="flex items-center justify-center space-x-3">
                    <div className="w-8 h-8 p-1 bg-white/90 rounded-lg">
                      <img 
                        src={TurianCharacter} 
                        alt="Turian" 
                        className="w-full h-full object-cover rounded-md"
                      />
                    </div>
                    <span>{loading ? 'Entering The Naturverse...' : 'Enter The Naturverse'}</span>
                    <div className="w-8 h-8 p-1 bg-white/90 rounded-lg">
                      <img 
                        src={CoconutCruze} 
                        alt="Magic" 
                        className="w-full h-full object-cover rounded-md"
                      />
                    </div>
                  </div>
                </Button>
              </form>

              <div className="text-center space-y-3">
                <button
                  onClick={handleForgotPassword}
                  disabled={resetLoading}
                  className="text-green-600 hover:text-green-700 font-bold underline transition-colors"
                  style={{ fontFamily: 'Fredoka, sans-serif' }}
                  data-testid="button-forgot-password"
                >
                  {resetLoading ? 'Sending...' : 'Forgot Password?'}
                </button>
                
                <div className="text-gray-600" style={{ fontFamily: 'Fredoka, sans-serif' }}>
                  Don't have an account?{' '}
                  <Link href="/signup">
                    <span className="text-green-600 hover:text-green-700 font-bold underline cursor-pointer transition-colors">
                      Join The Adventure!
                    </span>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Turian Guide - Bottom Right */}
      <div className="fixed bottom-6 right-6 z-50">
        <div className="relative animate-float-bounce">
          <div className="w-40 h-40 p-2 bg-white/95 rounded-full border-4 border-green-400 shadow-2xl">
            <img 
              src={TurianCharacter} 
              alt="Turian the Durian Guide" 
              className="w-full h-full object-cover rounded-full"
            />
          </div>
          
          {/* Speech Bubble */}
          <div className="absolute -top-24 -left-40 bg-white/95 backdrop-blur-sm rounded-3xl p-6 shadow-2xl border-4 border-green-400 max-w-sm">
            <div className="text-center">
              <div className="text-xl font-bold mb-2 text-green-700" style={{ fontFamily: 'Fredoka, sans-serif' }}>
                Hi! I'm Turian! 🌿
              </div>
              <div className="text-base text-green-600" style={{ fontFamily: 'Fredoka, sans-serif' }}>
                Ready to explore The Naturverse together?
              </div>
            </div>
            
            {/* Speech bubble pointer */}
            <div className="absolute bottom-0 right-16 transform translate-y-full">
              <div className="w-0 h-0 border-l-[16px] border-r-[16px] border-t-[16px] border-l-transparent border-r-transparent border-t-green-400"></div>
              <div className="w-0 h-0 border-l-[12px] border-r-[12px] border-t-[12px] border-l-transparent border-r-transparent border-t-white absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-[2px]"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}