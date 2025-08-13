// Official Naturverse™ Character Assets
import TwoKay from '@assets/2kay_1754677394018.png';
import BluButterfly from '@assets/Blu Butterfly_1754677394021.png';
import CoconutCruze from '@assets/Coconut Cruze_1754677394021.png';
import DrP from '@assets/Dr P_1754677394022.png';
import FrankieFrogs from '@assets/Frankie Frogs_1754677394022.png';
import Inkie from '@assets/Inkie_1754677394023.png';
import JaySing from '@assets/Jay-Sing_1754677394023.png';
import JenSuex from '@assets/Jen-Suex_1754677394024.png';
import LaoCow from '@assets/Lao Cow_1754677394024.png';
import MangoMike from '@assets/Mango Mike_1754677394025.png';
import NikkiMT from '@assets/Nikki MT_1754677394025.png';
import NonBua from '@assets/Non-Bua_1754677394025.png';
import PineapplePaPa from '@assets/Pineapple Pa-Pa_1754677394026.png';
import PineapplePetey from '@assets/Pineapple Petey_1754677394026.png';
import Snakers from '@assets/Snakers_1754677394026.png';
import Teeyor from '@assets/Teeyor_1754677394026.png';
import TommyTukTuk from '@assets/Tommy Tuk Tuk_1754677394026.png';
import Hank from '@assets/hank_1754677394023.png';

// Background Assets
import StorybookScene from '@assets/Storybook img_1754673794866.jpg';
import BookImg from '@assets/book img_1754673794864.jpg';
import ShroomForest from '@assets/Shroom forest_1754673794866.jpg';
import TurianCharacter from '@assets/Turian_1754677394027.jpg';
import TurianLogo from '@assets/turian_media_logo_transparent.png';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Storybook() {
  const [selectedStory, setSelectedStory] = useState<string | null>(null);

  const stories = [
    {
      id: 'turian-adventure',
      title: "Turian's Tropical Journey",
      character: TurianCharacter,
      characterName: 'Turian the Durian',
      description:
        "Join Turian as he discovers the magical secrets of the tropical rainforest and learns about nature's incredible diversity.",
      color: 'from-green-400 to-emerald-600',
      bgColor: 'from-green-50 to-emerald-50',
      borderColor: 'border-green-300',
      emoji: '🌿',
      difficulty: 'Beginner',
    },
    {
      id: 'coconut-cruze-adventure',
      title: "Coconut Cruze's Ocean Quest",
      character: CoconutCruze,
      characterName: 'Coconut Cruze',
      description:
        'Sail with Coconut Cruze across crystal blue waters to explore coral reefs and meet amazing sea creatures.',
      color: 'from-blue-400 to-cyan-600',
      bgColor: 'from-blue-50 to-cyan-50',
      borderColor: 'border-blue-300',
      emoji: '🌊',
      difficulty: 'Beginner',
    },
    {
      id: 'frankie-frog-hop',
      title: "Frankie Frogs' Hopping Adventure",
      character: FrankieFrogs,
      characterName: 'Frankie Frogs',
      description:
        'Hop along with Frankie through lily pads and discover the amazing world of wetlands and amphibians.',
      color: 'from-purple-400 to-violet-600',
      bgColor: 'from-purple-50 to-violet-50',
      borderColor: 'border-purple-300',
      emoji: '🐸',
      difficulty: 'Intermediate',
    },
    {
      id: 'blu-butterfly-transformation',
      title: "Blu Butterfly's Amazing Change",
      character: BluButterfly,
      characterName: 'Blu Butterfly',
      description:
        'Experience the magical transformation from caterpillar to butterfly and learn about metamorphosis.',
      color: 'from-pink-400 to-rose-600',
      bgColor: 'from-pink-50 to-rose-50',
      borderColor: 'border-pink-300',
      emoji: '🦋',
      difficulty: 'Intermediate',
    },
    {
      id: 'jay-sing-melody',
      title: "Jay-Sing's Musical Forest",
      character: JaySing,
      characterName: 'Jay-Sing',
      description:
        'Listen to the beautiful songs of nature with Jay-Sing and discover how animals communicate through sound.',
      color: 'from-yellow-400 to-orange-600',
      bgColor: 'from-yellow-50 to-orange-50',
      borderColor: 'border-yellow-300',
      emoji: '🎵',
      difficulty: 'Beginner',
    },
    {
      id: 'mango-mike-feast',
      title: "Mango Mike's Fruit Festival",
      character: MangoMike,
      characterName: 'Mango Mike',
      description:
        'Join Mango Mike at the tropical fruit festival and learn about healthy eating and plant nutrition.',
      color: 'from-orange-400 to-red-600',
      bgColor: 'from-orange-50 to-red-50',
      borderColor: 'border-orange-300',
      emoji: '🥭',
      difficulty: 'Beginner',
    },
    {
      id: 'nikki-mt-mountain',
      title: "Nikki MT's Mountain Expedition",
      character: NikkiMT,
      characterName: 'Nikki MT',
      description:
        'Climb high peaks with Nikki MT and discover the unique plants and animals that live in mountain ecosystems.',
      color: 'from-gray-400 to-slate-600',
      bgColor: 'from-gray-50 to-slate-50',
      borderColor: 'border-gray-300',
      emoji: '🏔️',
      difficulty: 'Advanced',
    },
    {
      id: 'pineapple-papa-wisdom',
      title: "Pineapple Pa-Pa's Ancient Wisdom",
      character: PineapplePaPa,
      characterName: 'Pineapple Pa-Pa',
      description:
        'Learn timeless lessons about patience, growth, and the cycles of nature from wise Pineapple Pa-Pa.',
      color: 'from-amber-400 to-yellow-600',
      bgColor: 'from-amber-50 to-yellow-50',
      borderColor: 'border-amber-300',
      emoji: '🍍',
      difficulty: 'Intermediate',
    },
    {
      id: 'snakers-underground',
      title: "Snakers' Underground World",
      character: Snakers,
      characterName: 'Snakers',
      description:
        'Explore the hidden underground world with Snakers and discover the important role of soil creatures.',
      color: 'from-emerald-400 to-green-600',
      bgColor: 'from-emerald-50 to-green-50',
      borderColor: 'border-emerald-300',
      emoji: '🐍',
      difficulty: 'Advanced',
    },
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'Intermediate':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'Advanced':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
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
              rgba(252, 211, 77, 0.4) 0%,
              rgba(251, 146, 60, 0.3) 25%,
              rgba(239, 68, 68, 0.3) 50%,
              rgba(219, 39, 119, 0.3) 75%,
              rgba(147, 51, 234, 0.4) 100%
            ),
            url(${StorybookScene})
          `,
        }}
      />

      {/* Floating Sparkles */}
      <div className="floating-sparkles" style={{ top: '10%', left: '15%' }}>
        📚
      </div>
      <div className="floating-sparkles" style={{ top: '20%', right: '20%', animationDelay: '1s' }}>
        ✨
      </div>
      <div
        className="floating-sparkles"
        style={{ bottom: '30%', left: '25%', animationDelay: '2s' }}
      >
        🌟
      </div>
      <div
        className="floating-sparkles"
        style={{ top: '60%', right: '30%', animationDelay: '1.5s' }}
      >
        📖
      </div>
      <div
        className="floating-sparkles"
        style={{ bottom: '20%', right: '10%', animationDelay: '3s' }}
      >
        ⭐
      </div>

      <div className="relative z-10 min-h-screen py-8 px-6">
        {/* Header Section */}
        <div className="text-center mb-12 animate-character-entrance">
          <div className="flex items-center justify-center mb-6">
            <img
              src={TurianLogo}
              alt="The Naturverse™"
              className="w-16 h-16 mr-4 animate-gentle-pulse"
            />
            <div>
              <h1 className="text-4xl md:text-6xl font-magical text-white drop-shadow-2xl text-magical-rainbow">
                📚 Magical Storybook 📚
              </h1>
              <p className="text-xl text-white drop-shadow-lg font-playful mt-2">
                Discover amazing adventures with our Naturverse friends!
              </p>
            </div>
          </div>
        </div>

        {/* Story Cards Grid */}
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {stories.map((story, index) => (
              <Card
                key={story.id}
                className="story-card animate-character-entrance cursor-pointer group"
                style={{ animationDelay: `${index * 0.1}s` }}
                onClick={() => setSelectedStory(story.id)}
                data-testid={`story-card-${story.id}`}
              >
                <CardHeader className="pb-4">
                  <div className="flex justify-center mb-4">
                    <div className="relative">
                      <img
                        src={story.character}
                        alt={story.characterName}
                        className="w-20 h-20 rounded-full border-4 border-white shadow-xl group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute -top-2 -right-2 text-2xl animate-sparkle-dance">
                        {story.emoji}
                      </div>
                    </div>
                  </div>

                  <CardTitle className="text-2xl font-magical text-center text-green-700 group-hover:text-purple-700 transition-colors duration-300">
                    {story.title}
                  </CardTitle>

                  <div className="flex justify-center mt-3">
                    <div
                      className={`px-3 py-1 rounded-full text-xs font-bold border-2 ${getDifficultyColor(story.difficulty)}`}
                    >
                      {story.difficulty}
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="pt-0">
                  <p className="text-gray-600 font-story text-center leading-relaxed mb-6">
                    {story.description}
                  </p>

                  <div className="text-center">
                    <Button
                      className="btn-magical w-full font-bold"
                      data-testid={`read-story-${story.id}`}
                    >
                      <span className="mr-2">📖</span>
                      Start Reading
                      <span className="ml-2">✨</span>
                    </Button>
                  </div>
                </CardContent>

                {/* Magical Glow Effect */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${story.bgColor} opacity-0 group-hover:opacity-20 rounded-3xl transition-opacity duration-300`}
                />
              </Card>
            ))}
          </div>
        </div>

        {/* Featured Story Section */}
        <div className="max-w-4xl mx-auto mt-16">
          <Card
            className="quest-card animate-character-entrance"
            style={{ animationDelay: '0.8s' }}
          >
            <CardHeader className="text-center pb-6">
              <div className="flex justify-center mb-4">
                <img
                  src={BookImg}
                  alt="Featured Story"
                  className="w-24 h-24 rounded-xl border-4 border-green-400 shadow-xl animate-gentle-pulse"
                />
              </div>

              <CardTitle className="text-3xl font-magical text-green-700">
                🌟 Story of the Week 🌟
              </CardTitle>
            </CardHeader>

            <CardContent className="text-center">
              <div className="bg-gradient-to-br from-yellow-50 to-green-50 p-8 rounded-2xl border-4 border-yellow-200/60">
                <div className="flex justify-center mb-6">
                  <img
                    src={TurianCharacter}
                    alt="Turian Featured"
                    className="w-32 h-32 rounded-full border-4 border-yellow-400 shadow-xl animate-float-bounce"
                  />
                </div>

                <h3 className="text-2xl font-magical text-green-700 mb-4">
                  Turian's Great Discovery
                </h3>

                <p className="text-lg font-story text-green-600 leading-relaxed mb-6">
                  Join Turian on his most exciting adventure yet! When mysterious glowing seeds
                  appear in the forest, our brave durian friend must solve nature's greatest puzzle.
                  Along the way, he'll learn about plant growth, friendship, and the magic that
                  exists in every living thing.
                </p>

                <div className="flex justify-center space-x-4">
                  <Button className="btn-tropical text-lg font-bold" data-testid="read-featured">
                    <span className="mr-2">🌟</span>
                    Read Featured Story
                    <span className="ml-2">📚</span>
                  </Button>

                  <Button className="btn-nature text-lg font-bold" data-testid="listen-audio">
                    <span className="mr-2">🎧</span>
                    Listen to Audio
                    <span className="ml-2">🎵</span>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Stats */}
        <div className="max-w-4xl mx-auto mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-6 bg-white/90 backdrop-blur-sm rounded-3xl border-4 border-green-300/60 shadow-xl animate-character-entrance">
            <div className="text-4xl mb-3">📖</div>
            <div className="text-2xl font-bold text-green-700 font-magical">12+</div>
            <div className="text-green-600 font-playful">Amazing Stories</div>
          </div>

          <div
            className="text-center p-6 bg-white/90 backdrop-blur-sm rounded-3xl border-4 border-blue-300/60 shadow-xl animate-character-entrance"
            style={{ animationDelay: '0.2s' }}
          >
            <div className="text-4xl mb-3">🌟</div>
            <div className="text-2xl font-bold text-blue-700 font-magical">18+</div>
            <div className="text-blue-600 font-playful">Magical Characters</div>
          </div>

          <div
            className="text-center p-6 bg-white/90 backdrop-blur-sm rounded-3xl border-4 border-purple-300/60 shadow-xl animate-character-entrance"
            style={{ animationDelay: '0.4s' }}
          >
            <div className="text-4xl mb-3">🎯</div>
            <div className="text-2xl font-bold text-purple-700 font-magical">100+</div>
            <div className="text-purple-600 font-playful">Learning Adventures</div>
          </div>
        </div>
      </div>

      {/* Turian Guide */}
      <div className="fixed bottom-6 right-6 z-50">
        <div className="relative animate-float-bounce">
          <div className="w-24 h-24 p-2 bg-white/95 rounded-full border-4 border-purple-400 shadow-2xl">
            <img
              src={TurianCharacter}
              alt="Turian Guide"
              className="w-full h-full object-cover rounded-full"
            />
          </div>

          <div className="absolute -top-16 -left-48 bg-white/95 backdrop-blur-sm rounded-2xl p-4 shadow-xl border-2 border-purple-400 max-w-xs">
            <div className="text-center">
              <div className="text-sm font-bold text-purple-700 font-playful">
                Choose a story to begin your magical learning adventure! 📚✨
              </div>
            </div>

            <div className="absolute bottom-0 right-8 transform translate-y-full">
              <div className="w-0 h-0 border-l-[12px] border-r-[12px] border-t-[12px] border-l-transparent border-r-transparent border-t-purple-400"></div>
              <div className="w-0 h-0 border-l-[8px] border-r-[8px] border-t-[8px] border-l-transparent border-r-transparent border-t-white absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-[1px]"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
