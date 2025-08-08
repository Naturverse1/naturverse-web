import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { X, MessageCircle, Sparkles, Heart } from 'lucide-react';

// Import Turian's assets
import TurianImg from '../assets/Turian.jpg';
import TurianDurianImg from '../assets/Turian the Durian.png';

interface TurianMessage {
  id: string;
  text: string;
  emoji: string;
  delay?: number;
}

const welcomeMessages: TurianMessage[] = [
  {
    id: '1',
    text: "สวัสดี! Hello, my magical friend! I'm Turian! 🌟",
    emoji: '👋',
    delay: 0
  },
  {
    id: '2', 
    text: "Dee mak! Welcome to our amazing Naturverse! ✨",
    emoji: '🌿',
    delay: 2000
  },
  {
    id: '3',
    text: "I'm here to guide you on the most incredible adventures! Want to explore? 🗺️",
    emoji: '🧭',
    delay: 4000
  }
];

const randomEncouragement: TurianMessage[] = [
  {
    id: 'encourage1',
    text: "Dee mak! You're doing amazing! Keep exploring! 🌟",
    emoji: '⭐'
  },
  {
    id: 'encourage2',
    text: "Wow! I'm so proud of your curiosity! What shall we discover next? 🔍",
    emoji: '🎉'
  },
  {
    id: 'encourage3',
    text: "Magical! You're becoming a true Nature Hero! Dee mak mak! 🌿",
    emoji: '🏆'
  },
  {
    id: 'encourage4',
    text: "Amazing work, friend! The forest spirits are dancing with joy! 🧚‍♀️",
    emoji: '✨'
  },
  {
    id: 'encourage5',
    text: "Look at you go! Every step is an adventure! Dee mak! 🌈",
    emoji: '🚀'
  }
];

export function TurianAiGuide() {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [currentMessages, setCurrentMessages] = useState<TurianMessage[]>([]);
  const [hasShownWelcome, setHasShownWelcome] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  // Show Turian bubble after a short delay on first load
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  // Show welcome messages sequence when first opening
  useEffect(() => {
    if (isOpen && !hasShownWelcome) {
      setIsAnimating(true);
      welcomeMessages.forEach((message) => {
        setTimeout(() => {
          setCurrentMessages(prev => [...prev, message]);
        }, message.delay || 0);
      });
      
      setTimeout(() => {
        setHasShownWelcome(true);
        setIsAnimating(false);
      }, 6000);
    }
  }, [isOpen, hasShownWelcome]);

  // Random encouragement every 45 seconds when visible
  useEffect(() => {
    if (!isVisible) return;
    
    const encouragementTimer = setInterval(() => {
      const randomMsg = randomEncouragement[Math.floor(Math.random() * randomEncouragement.length)];
      if (!isOpen) {
        // Show brief floating message
        setCurrentMessages([randomMsg]);
        setTimeout(() => {
          setCurrentMessages([]);
        }, 5000);
      }
    }, 45000);

    return () => clearInterval(encouragementTimer);
  }, [isVisible, isOpen]);

  const handleTurianClick = () => {
    setIsOpen(true);
    if (!hasShownWelcome) {
      setCurrentMessages([]);
    }
  };

  const getRandomGreeting = () => {
    const greetings = [
      "Dee mak! How can I help you explore? 🌟",
      "Hello, my magical friend! Ready for an adventure? 🗺️",
      "Wonderful to see you again! What shall we discover today? ✨",
      "Greetings, Nature Hero! Where shall our journey take us? 🌿",
      "Dee mak mak! I'm so excited you're here! Let's explore! 🎉"
    ];
    return greetings[Math.floor(Math.random() * greetings.length)];
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Floating Turian Bubble */}
      <div className="fixed bottom-6 right-6 z-50">
        {/* Floating encouragement messages when chat is closed */}
        {!isOpen && currentMessages.length > 0 && (
          <div className="absolute bottom-20 right-0 mb-2 mr-2 animate-bounce-in">
            <div className="bg-gradient-to-r from-emerald to-magic text-white px-6 py-3 rounded-2xl shadow-magical max-w-64 relative">
              <div className="text-lg font-bold text-shadow">
                {currentMessages[0]?.emoji} {currentMessages[0]?.text}
              </div>
              {/* Speech bubble tail */}
              <div className="absolute bottom-0 right-4 transform translate-y-2 rotate-45 w-3 h-3 bg-magic"></div>
            </div>
          </div>
        )}

        {/* Main Turian Bubble Button */}
        <Button
          onClick={handleTurianClick}
          className="w-20 h-20 rounded-full p-0 bg-gradient-to-r from-magic via-emerald to-sparkle hover:from-sparkle hover:via-magic hover:to-emerald shadow-magical hover:shadow-glow transition-all duration-500 hover:scale-110 group border-4 border-white/30"
          data-testid="button-turian-guide"
        >
          <div className="relative w-full h-full rounded-full overflow-hidden">
            <img 
              src={TurianDurianImg} 
              alt="Turian the Durian Guide" 
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            />
            
            {/* Magical sparkles around Turian */}
            <div className="absolute -top-1 -right-1 text-lg animate-sparkle-twinkle">✨</div>
            <div className="absolute -bottom-1 -left-1 text-lg animate-sparkle-twinkle stagger-1">🌟</div>
            <div className="absolute top-1 -left-2 text-sm animate-sparkle-twinkle stagger-2">⭐</div>
            
            {/* Pulsing magic ring */}
            <div className="absolute inset-0 rounded-full border-2 border-sparkle animate-ping opacity-30"></div>
          </div>
          
          {/* Chat indicator */}
          <div className="absolute -top-2 -right-2 bg-coral text-white text-xs rounded-full w-6 h-6 flex items-center justify-center animate-bounce-gentle font-bold shadow-lg">
            <MessageCircle className="w-3 h-3" />
          </div>
        </Button>
      </div>

      {/* Turian Chat Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md bg-gradient-to-br from-mint/90 via-sparkle/90 to-magic/90 backdrop-blur-lg border-2 border-emerald/30 shadow-2xl rounded-3xl">
          <DialogHeader className="text-center pb-4">
            <div className="flex justify-center mb-4">
              <div className="relative">
                <img 
                  src={TurianImg} 
                  alt="Turian the Durian" 
                  className="w-20 h-20 rounded-full border-4 border-emerald/50 shadow-xl object-cover"
                />
                <div className="absolute -top-2 -right-2 text-2xl animate-sparkle-twinkle">✨</div>
                <div className="absolute -bottom-1 -left-1 text-xl animate-sparkle-twinkle stagger-1">🌟</div>
              </div>
            </div>
            
            <DialogTitle className="text-3xl font-display text-emerald font-bold flex items-center justify-center gap-2 text-shadow">
              <Sparkles className="w-6 h-6 text-magic animate-sparkle-twinkle" />
              Turian the Durian
              <Heart className="w-6 h-6 text-coral animate-pulse" />
            </DialogTitle>
            
            <DialogDescription className="text-lg text-forest font-bold">
              Your Magical Nature Guide
            </DialogDescription>
          </DialogHeader>

          {/* Chat Messages Area */}
          <div className="max-h-80 overflow-y-auto space-y-4 p-2">
            {hasShownWelcome && (
              <div className="bg-white/80 backdrop-blur rounded-2xl p-4 shadow-lg">
                <p className="text-lg font-bold text-emerald mb-2">
                  <span className="text-2xl mr-2">🌟</span>
                  {getRandomGreeting()}
                </p>
                <div className="grid grid-cols-2 gap-3 mt-4">
                  <button 
                    className="bg-gradient-to-r from-emerald to-forest text-white px-4 py-3 rounded-xl font-bold hover:scale-105 transition-all shadow-lg text-sm"
                    onClick={() => window.location.href = '/map'}
                  >
                    🗺️ Show me the map!
                  </button>
                  <button 
                    className="bg-gradient-to-r from-magic to-sparkle text-white px-4 py-3 rounded-xl font-bold hover:scale-105 transition-all shadow-lg text-sm"
                    onClick={() => window.location.href = '/quests'}
                  >
                    🏆 Start a quest!
                  </button>
                  <button 
                    className="bg-gradient-to-r from-ocean to-turquoise text-white px-4 py-3 rounded-xl font-bold hover:scale-105 transition-all shadow-lg text-sm"
                    onClick={() => window.location.href = '/storybook'}
                  >
                    📚 Tell me a story!
                  </button>
                  <button 
                    className="bg-gradient-to-r from-sunset to-amber text-white px-4 py-3 rounded-xl font-bold hover:scale-105 transition-all shadow-lg text-sm"
                    onClick={() => window.location.href = '/modules'}
                  >
                    🎓 Let's learn!
                  </button>
                </div>
              </div>
            )}

            {/* Welcome message sequence */}
            {currentMessages.map((message, index) => (
              <div 
                key={message.id}
                className={`bg-white/90 backdrop-blur rounded-2xl p-4 shadow-lg animate-bounce-in`}
                style={{ animationDelay: `${index * 0.5}s` }}
              >
                <p className="text-lg font-bold text-emerald">
                  <span className="text-2xl mr-2">{message.emoji}</span>
                  {message.text}
                </p>
              </div>
            ))}

            {isAnimating && (
              <div className="bg-white/70 backdrop-blur rounded-2xl p-4 shadow-lg">
                <div className="flex items-center space-x-2 text-emerald">
                  <div className="w-2 h-2 bg-emerald rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-emerald rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                  <div className="w-2 h-2 bg-emerald rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  <span className="text-sm font-bold ml-2">Turian is thinking...</span>
                </div>
              </div>
            )}
          </div>

          {/* Close Button */}
          <div className="flex justify-center pt-4">
            <Button
              onClick={() => setIsOpen(false)}
              variant="outline"
              className="bg-white/80 backdrop-blur border-2 border-emerald/30 text-emerald hover:bg-emerald hover:text-white font-bold rounded-xl px-6 py-2 shadow-lg transition-all"
              data-testid="button-close-turian"
            >
              <span className="mr-2">👋</span>
              See you later, Dee mak!
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}