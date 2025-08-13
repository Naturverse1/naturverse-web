// Official Naturverse™ Assets
import BluButterfly from '@assets/Blu Butterfly_1754677394021.png';
import CoconutCruze from '@assets/Coconut Cruze_1754677394021.png';
import FrankieFrogs from '@assets/Frankie Frogs_1754677394022.png';
import JaySing from '@assets/Jay-Sing_1754677394023.png';
import MangoMike from '@assets/Mango Mike_1754677394025.png';
import NikkiMT from '@assets/Nikki MT_1754677394025.png';
import ShroomForest from '@assets/Shroom forest_1754673794866.jpg';
import StorybookScene from '@assets/Storybook img_1754673794866.jpg';
import TurianCharacter from '@assets/Turian_1754677394027.jpg';
import TurianLogo from '@assets/turian_media_logo_transparent.png';
import { useState } from 'react';
import { useLocation } from 'wouter';

import { useAuth } from '../context/AuthContext';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Login() {
  const { signInWithGoogle, loading } = useAuth();
  const [, setLocation] = useLocation();
  const [error, setError] = useState('');

  // Array of all our magical characters
  const characters = [
    { src: TurianCharacter, name: 'Turian', position: 'top-10 left-10', delay: '0s' },
    { src: CoconutCruze, name: 'Coconut Cruze', position: 'top-20 right-16', delay: '0.5s' },
    { src: BluButterfly, name: 'Blu Butterfly', position: 'bottom-32 left-16', delay: '1s' },
    { src: FrankieFrogs, name: 'Frankie Frogs', position: 'bottom-20 right-20', delay: '1.5s' },
    { src: JaySing, name: 'Jay-Sing', position: 'top-32 left-1/3', delay: '2s' },
    { src: MangoMike, name: 'Mango Mike', position: 'bottom-40 right-1/3', delay: '2.5s' },
    { src: NikkiMT, name: 'Nikki MT', position: 'top-40 right-10', delay: '3s' },
  ];

  const handleGoogleSignIn = async () => {
    try {
      setError('');
      await signInWithGoogle();
      // The auth context will handle redirecting after successful auth
    } catch (err: any) {
      console.error('Google sign-in error:', err);
      setError(
        `Google authentication failed: ${err.message || 'Please check Supabase OAuth configuration'}`,
      );
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Magical Storybook Background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `
            linear-gradient(
              135deg,
              rgba(34, 197, 94, 0.4) 0%,
              rgba(59, 130, 246, 0.3) 25%,
              rgba(251, 146, 60, 0.3) 50%,
              rgba(234, 179, 8, 0.3) 75%,
              rgba(147, 51, 234, 0.4) 100%
            ),
            url(${StorybookScene})
          `,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      {/* Floating Character Elements */}
      {characters.map((character, index) => (
        <div
          key={character.name}
          className={`floating-character ${character.position} w-16 h-16 md:w-20 md:h-20 animate-character-entrance`}
          style={{ animationDelay: character.delay }}
        >
          <img
            src={character.src}
            alt={character.name}
            className="w-full h-full object-cover rounded-full border-4 border-white/60 shadow-2xl animate-float-bounce"
          />
        </div>
      ))}

      {/* Floating Sparkles */}
      <div className="floating-sparkles" style={{ top: '10%', left: '20%' }}>
        ✨
      </div>
      <div className="floating-sparkles" style={{ top: '20%', right: '30%', animationDelay: '1s' }}>
        🌟
      </div>
      <div
        className="floating-sparkles"
        style={{ bottom: '30%', left: '15%', animationDelay: '2s' }}
      >
        ⭐
      </div>
      <div
        className="floating-sparkles"
        style={{ top: '60%', right: '15%', animationDelay: '1.5s' }}
      >
        ✨
      </div>
      <div
        className="floating-sparkles"
        style={{ bottom: '20%', left: '60%', animationDelay: '3s' }}
      >
        🌟
      </div>
      <div
        className="floating-sparkles"
        style={{ top: '40%', left: '70%', animationDelay: '0.5s' }}
      >
        ⭐
      </div>

      {/* Main Login Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-6">
        <div className="w-full max-w-lg">
          {/* Logo and Welcome Section */}
          <div className="text-center mb-8 animate-character-entrance">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <img
                  src={TurianLogo}
                  alt="The Naturverse™"
                  className="w-24 h-24 md:w-32 md:h-32 drop-shadow-2xl animate-gentle-pulse"
                />
                <div className="absolute -top-2 -right-2 text-3xl animate-sparkle-dance">✨</div>
              </div>
            </div>

            <h1 className="text-4xl md:text-6xl font-magical text-white drop-shadow-2xl mb-4 text-magical-rainbow">
              Welcome to The Naturverse™!
            </h1>
            <p className="text-xl md:text-2xl font-playful text-white drop-shadow-lg">
              🌟 Where Learning Becomes Adventure! 🌟
            </p>
          </div>

          {/* Login Card */}
          <Card
            className="story-card animate-character-entrance"
            style={{ animationDelay: '0.5s' }}
          >
            <CardHeader className="text-center pb-6">
              <div className="flex justify-center mb-4">
                <img
                  src={TurianCharacter}
                  alt="Turian Guide"
                  className="w-20 h-20 rounded-full border-4 border-green-400 shadow-xl animate-gentle-pulse"
                />
              </div>

              <CardTitle className="text-3xl font-magical text-green-700">
                🌺 Join the Adventure! 🌺
              </CardTitle>
              <p className="text-lg font-story text-green-600 mt-4">
                Hi there, brave explorer! I'm Turian, your magical durian guide. Ready to discover
                the wonders of nature together?
              </p>
            </CardHeader>

            <CardContent className="space-y-6">
              {error && (
                <Alert className="border-red-200 bg-red-50 animate-character-entrance">
                  <AlertDescription className="text-red-700 font-bold">{error}</AlertDescription>
                </Alert>
              )}

              {/* Demo Mode - Primary Option */}
              <div className="text-center">
                <Button
                  onClick={() => setLocation('/map')}
                  className="btn-magical w-full text-xl py-6 text-white font-bold relative overflow-hidden"
                  data-testid="demo-signin-button"
                >
                  <div className="flex items-center justify-center space-x-3">
                    <span className="text-2xl">🌟</span>
                    <span>Start Your Adventure!</span>
                    <span className="text-2xl">✨</span>
                  </div>

                  {/* Magical Shimmer Effect */}
                  <div className="absolute inset-0 animate-magical-shimmer"></div>
                </Button>
              </div>

              {/* Google Sign In Alternative */}
              <div className="text-center">
                <Button
                  onClick={handleGoogleSignIn}
                  disabled={loading}
                  variant="outline"
                  className="w-full py-3 text-lg font-bold border-2 border-white/30 bg-white/10 hover:bg-white/20 text-white"
                  data-testid="google-signin-button"
                >
                  <span>{loading ? 'Signing in...' : 'Or sign in with Google'}</span>
                </Button>
              </div>

              <div className="text-center">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t-2 border-green-300"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white text-green-600 font-bold font-playful">
                      🌿 Quick & Safe Sign-In 🌿
                    </span>
                  </div>
                </div>
              </div>

              {/* Features Preview */}
              <div className="grid grid-cols-2 gap-4 mt-8">
                <div className="text-center p-4 bg-green-50/80 rounded-2xl border-2 border-green-200">
                  <div className="text-2xl mb-2">🗺️</div>
                  <div className="text-sm font-bold text-green-700 font-playful">Explore Maps</div>
                </div>

                <div className="text-center p-4 bg-blue-50/80 rounded-2xl border-2 border-blue-200">
                  <div className="text-2xl mb-2">📚</div>
                  <div className="text-sm font-bold text-blue-700 font-playful">Read Stories</div>
                </div>

                <div className="text-center p-4 bg-purple-50/80 rounded-2xl border-2 border-purple-200">
                  <div className="text-2xl mb-2">⚡</div>
                  <div className="text-sm font-bold text-purple-700 font-playful">Epic Quests</div>
                </div>

                <div className="text-center p-4 bg-yellow-50/80 rounded-2xl border-2 border-yellow-200">
                  <div className="text-2xl mb-2">🧠</div>
                  <div className="text-sm font-bold text-yellow-700 font-playful">Fun Quizzes</div>
                </div>
              </div>

              {/* Fun Facts */}
              <div className="bg-gradient-to-br from-green-50 to-blue-50 p-6 rounded-2xl border-4 border-green-200/60">
                <h3 className="font-magical text-lg text-green-700 mb-3 text-center">
                  🌟 Fun Facts About The Naturverse! 🌟
                </h3>
                <ul className="space-y-2 text-sm font-story text-green-600">
                  <li>🐸 Meet Frankie Frogs - our hopping adventure guide!</li>
                  <li>🥥 Coconut Cruze knows all the best tropical paths!</li>
                  <li>🦋 Blu Butterfly shows us the beauty of transformation!</li>
                  <li>🎤 Jay-Sing teaches us nature's wonderful songs!</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Footer Message */}
          <div
            className="text-center mt-8 animate-character-entrance"
            style={{ animationDelay: '1s' }}
          >
            <p className="text-white font-story text-lg drop-shadow-lg">
              🌺 Safe, fun, and educational - join thousands of young explorers! 🌺
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
