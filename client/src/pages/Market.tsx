import { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface MarketItem {
  id: string;
  name: string;
  description: string;
  category: 'avatar' | 'decoration' | 'power' | 'music' | 'story';
  price: number;
  currency: 'gems' | 'coins';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  icon: string;
  isOwned: boolean;
  isLocked: boolean;
  unlockRequirement?: string;
}

export default function Market() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [userCurrency] = useState({ gems: 150, coins: 850 }); // TODO: Connect to user data

  const marketItems: MarketItem[] = [
    {
      id: '1',
      name: 'Rainbow Wings',
      description: 'Magical wings that shimmer with all colors of nature',
      category: 'avatar',
      price: 100,
      currency: 'gems',
      rarity: 'epic',
      icon: '🌈',
      isOwned: false,
      isLocked: false,
    },
    {
      id: '2',
      name: 'Enchanted Garden Theme',
      description: 'Transform your profile background into a magical garden',
      category: 'decoration',
      price: 50,
      currency: 'coins',
      rarity: 'rare',
      icon: '🌺',
      isOwned: false,
      isLocked: false,
    },
    {
      id: '3',
      name: 'Wisdom Boost',
      description: 'Gain extra points on your next three quizzes',
      category: 'power',
      price: 25,
      currency: 'gems',
      rarity: 'common',
      icon: '🧠',
      isOwned: false,
      isLocked: false,
    },
    {
      id: '4',
      name: 'Crystal Cave Melody',
      description: 'Unlock exclusive crystal cave instrument sounds',
      category: 'music',
      price: 75,
      currency: 'coins',
      rarity: 'rare',
      icon: '💎',
      isOwned: true,
      isLocked: false,
    },
    {
      id: '5',
      name: "Dragon's Tale",
      description: 'An exclusive story about friendly dragons in The Naturverse',
      category: 'story',
      price: 200,
      currency: 'gems',
      rarity: 'legendary',
      icon: '🐲',
      isOwned: false,
      isLocked: true,
      unlockRequirement: 'Complete 10 stories',
    },
    {
      id: '6',
      name: 'Starlight Crown',
      description: 'A crown that glows with the light of distant stars',
      category: 'avatar',
      price: 300,
      currency: 'gems',
      rarity: 'legendary',
      icon: '👑',
      isOwned: false,
      isLocked: true,
      unlockRequirement: 'Reach Explorer Level 15',
    },
  ];

  const categories = [
    { id: 'all', name: 'All Items', icon: '🌟' },
    { id: 'avatar', name: 'Avatar Items', icon: '🎨' },
    { id: 'decoration', name: 'Decorations', icon: '🏠' },
    { id: 'power', name: 'Power-ups', icon: '⚡' },
    { id: 'music', name: 'Music', icon: '🎵' },
    { id: 'story', name: 'Stories', icon: '📚' },
  ];

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common':
        return 'bg-gray-500 text-white';
      case 'rare':
        return 'bg-turquoise text-white';
      case 'epic':
        return 'bg-magic text-white';
      case 'legendary':
        return 'bg-sunny text-strong';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const getCurrencyIcon = (currency: string) => {
    return currency === 'gems' ? '💎' : '🪙';
  };

  const canAfford = (item: MarketItem) => {
    return userCurrency[item.currency] >= item.price;
  };

  const filteredItems =
    selectedCategory === 'all'
      ? marketItems
      : marketItems.filter((item) => item.category === selectedCategory);

  const handlePurchase = (item: MarketItem) => {
    if (item.isLocked || item.isOwned || !canAfford(item)) return;

    // TODO: Implement purchase logic with backend
    console.log(`Purchasing ${item.name} for ${item.price} ${item.currency}`);
  };

  return (
    <div className="min-h-screen magic-gradient py-12">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-fredoka text-white mb-4" data-testid="text-title">
            🏪 Naturverse Marketplace
          </h1>
          <p className="text-white/90 text-lg">Discover magical items to enhance your adventure!</p>

          {/* Currency Display */}
          <Card className="backdrop-blur-sm bg-white/95 border-nature/20 shadow-xl mt-6 max-w-md mx-auto">
            <CardContent className="pt-4">
              <div className="flex justify-center space-x-6">
                <div className="text-center">
                  <div className="text-2xl font-fredoka text-forest">{userCurrency.gems}</div>
                  <div className="text-sm text-forest/70">💎 Gems</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-fredoka text-forest">{userCurrency.coins}</div>
                  <div className="text-sm text-forest/70">🪙 Coins</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Category Filter */}
        <div className="flex justify-center mb-8 flex-wrap gap-2">
          {categories.map((category) => (
            <Button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              variant={selectedCategory === category.id ? 'default' : 'outline'}
              className={`${
                selectedCategory === category.id
                  ? 'bg-nature text-white'
                  : 'border-white text-white hover:bg-white hover:text-forest'
              }`}
              data-testid={`button-category-${category.id}`}
            >
              {category.icon} {category.name}
            </Button>
          ))}
        </div>

        {/* Market Items */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <Card
              key={item.id}
              className={`backdrop-blur-sm bg-white/95 border-nature/20 shadow-xl transition-all duration-200 ${
                !item.isLocked && !item.isOwned ? 'hover:scale-105' : ''
              } ${item.isOwned ? 'ring-2 ring-nature' : ''}`}
              data-testid={`card-item-${item.id}`}
            >
              <CardHeader className="text-center">
                <div
                  className={`text-5xl mb-3 ${item.isLocked ? 'opacity-50' : 'animate-bounce-gentle'}`}
                >
                  {item.isLocked ? '🔒' : item.icon}
                </div>
                <div className="flex justify-center space-x-2 mb-2">
                  <Badge className={getRarityColor(item.rarity)}>{item.rarity}</Badge>
                  {item.isOwned && <Badge className="bg-nature text-white">Owned</Badge>}
                </div>
                <CardTitle
                  className={`text-lg font-fredoka ${item.isLocked ? 'text-gray-500' : 'text-forest'}`}
                >
                  {item.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className={`text-sm mb-4 ${item.isLocked ? 'text-gray-400' : 'text-forest/80'}`}>
                  {item.description}
                </p>

                {item.isLocked && item.unlockRequirement && (
                  <div className="mb-4 p-3 bg-gray-100 rounded-lg">
                    <p className="text-xs text-gray-600 text-center">🔒 {item.unlockRequirement}</p>
                  </div>
                )}

                <div className="flex justify-between items-center mb-4">
                  <div className="text-lg font-fredoka text-forest">
                    {getCurrencyIcon(item.currency)} {item.price}
                  </div>
                  {!canAfford(item) && !item.isOwned && !item.isLocked && (
                    <Badge variant="destructive" className="text-xs">
                      Can't afford
                    </Badge>
                  )}
                </div>

                <Button
                  onClick={() => handlePurchase(item)}
                  disabled={item.isLocked || item.isOwned || !canAfford(item)}
                  className={`w-full ${
                    item.isOwned
                      ? 'bg-nature text-white'
                      : item.isLocked
                        ? 'bg-gray-300 text-gray-500'
                        : canAfford(item)
                          ? 'bg-turquoise hover:bg-teal-600 text-white'
                          : 'bg-gray-300 text-gray-500'
                  }`}
                  data-testid={`button-purchase-${item.id}`}
                >
                  {item.isOwned
                    ? '✅ Owned'
                    : item.isLocked
                      ? '🔒 Locked'
                      : canAfford(item)
                        ? '🛒 Purchase'
                        : '💰 Not enough currency'}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4 opacity-50">🏪</div>
            <h3 className="text-xl font-fredoka text-white mb-2">No items in this category</h3>
            <p className="text-white/70">Check back later for new magical items!</p>
          </div>
        )}
      </div>
    </div>
  );
}
