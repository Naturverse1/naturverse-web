export type CultureSection = {
  id: string;
  emoji: string;
  kingdom: string;
  caption: string;
  beliefs: string[];
  holidays: { name: string; when: string; note: string }[];
  ceremonies?: string[];
};

export const CULTURE_SECTIONS: CultureSection[] = [
  {
    id: "thailandia",
    emoji: "🌺🛕",
    kingdom: "Thailandia",
    caption: "Coconuts & Elephants",
    beliefs: [
      "Kindness, merit, and harmony with nature.",
      "Respect for water, forests, and elephants as guardian spirits."
    ],
    holidays: [
      { name: "Songkran (Water Festival)", when: "Mid-April", note: "New year blessing with water splashing, gratitude, and renewal." },
      { name: "Loy Krathong", when: "Full moon of the 12th lunar month", note: "Lanterns & floating baskets thanking rivers and letting go of worries." }
    ],
    ceremonies: [
      "Dawn offerings to temples.",
      "Water blessings before long journeys or new quests."
    ]
  },
  {
    id: "amerilandia",
    emoji: "🎆🦅",
    kingdom: "Amerilandia",
    caption: "Apples & Eagles",
    beliefs: [
      "Freedom, community service, and fair play.",
      "Stewardship of parks, trails, and wild places."
    ],
    holidays: [
      { name: "Independence Festival", when: "Early July", note: "Parades, fireworks, and community clean-ups." },
      { name: "Harvest Day", when: "Late November", note: "Gratitude feasts and food drives for neighbors." }
    ],
    ceremonies: [
      "Trail pledges before expeditions.",
      "Community flag & firelight gatherings."
    ]
  },
  {
    id: "chilandia",
    emoji: "🐼🐉",
    kingdom: "Chilandia",
    caption: "Pandas & Dragons",
    beliefs: [
      "Balance, family, and scholarly curiosity.",
      "Bamboo as a symbol of resilience."
    ],
    holidays: [
      { name: "Lunar New Year", when: "Late Jan / Feb", note: "Reunion dinners, red envelopes, lion & dragon dances." },
      { name: "Mid-Autumn Festival", when: "Sep / Oct", note: "Mooncakes, lantern walks, stories of the moon." }
    ],
    ceremonies: [
      "Tea sharing to begin peace talks and quests.",
      "Lantern messages for wishes and thanks."
    ]
  },
  {
    id: "japonica",
    emoji: "🎋🦊",
    kingdom: "Japonica",
    caption: "Cherry Blossoms & Foxes",
    beliefs: [
      "Seasonal mindfulness and craftsmanship.",
      "Shrine paths honoring guardians of forest and sea."
    ],
    holidays: [
      { name: "Hanami Blossoms", when: "Spring", note: "Picnics under blossoms; reflection on impermanence." },
      { name: "New Year First Sunrise", when: "Jan 1", note: "Hatsumode shrine visits; first wishes and goals." }
    ],
    ceremonies: [
      "Forest bell & clap at shrines before adventures.",
      "Paper charms for safe travel."
    ]
  },
  {
    id: "europalia",
    emoji: "🌻🦔",
    kingdom: "Europalia",
    caption: "Sunflowers & Hedgehogs",
    beliefs: [
      "Village festivals, guilds, and artistry.",
      "Stone circles and garden lore."
    ],
    holidays: [
      { name: "Midsummer Fires", when: "June", note: "Bonfires, wreaths, and nature songs." },
      { name: "Winter Lights", when: "Dec", note: "Markets, candles, and carols." }
    ],
    ceremonies: [
      "Bread-breaking to welcome travelers.",
      "Wreath crafting for luck."
    ]
  },
  {
    id: "africana",
    emoji: "🦁🥁",
    kingdom: "Africana",
    caption: "Mangoes & Lions",
    beliefs: [
      "Elders’ wisdom, drums, and star navigation.",
      "Respect for savanna spirits and great cats."
    ],
    holidays: [
      { name: "First Rains", when: "Seasonal", note: "Dances for renewal; seed blessings." }
    ],
    ceremonies: [
      "Drum circles to mark milestones.",
      "Griot storytelling nights."
    ]
  }
  // More kingdoms can be appended later without code changes.
];
