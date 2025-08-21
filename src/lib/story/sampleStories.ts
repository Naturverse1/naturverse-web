import { Story } from "./types";

const mk = (id: string, title: string, realm: string, emoji: string, scenes: any[]): Story => ({
  id, title, realm, emoji, start: scenes[0].id, scenes
});

export const SAMPLE_STORIES: Story[] = [
  mk("thailandia-river-song", "River Song", "Thailandia", "🐘",
    [
      { id: "dock", title: "Floating Dock",
        body: "Morning mist hugs the canal. A mango falls with a plop. Grandma says the river is singing again.",
        choices: [
          { id: "c1", text: "Listen from the dock", goto: "listen" },
          { id: "c2", text: "Borrow the canoe", goto: "canoe" }
        ]},
      { id: "listen", title: "Whispers in Water",
        body: "You hear three notes. They echo from the banyan roots.",
        choices: [
          { id: "c3", text: "Follow the roots", goto: "roots" },
          { id: "c4", text: "Hum along", goto: "hum" }
        ]},
      { id: "canoe", title: "Canoe Glide",
        body: "Silver fish race beside you. The current forks.",
        choices: [
          { id: "c5", text: "Left toward the market", goto: "market" },
          { id: "c6", text: "Right into the mangroves", goto: "mangrove" }
        ]},
      { id: "roots", title: "Root Bridge",
        body: "A living bridge bends low. Underneath, a shy river dolphin surfaces.",
        choices: [
          { id: "c7", text: "Offer mango", goto: "ally" },
          { id: "c8", text: "Dash across", goto: "dash" }
        ]},
      { id: "hum", title: "Harmony",
        body: "Your hum completes the river’s melody. The water brightens.",
        choices: [
          { id: "c9", text: "Sing louder", goto: "ally" },
          { id: "c10", text: "Record the tune", goto: "market" }
        ]},
      { id: "market", title: "Floating Market",
        body: "Boats brim with herbs and coconuts. A vendor taps a drum: the song again!",
        choices: [
          { id: "c11", text: "Trade for the drum", goto: "ally" },
          { id: "c12", text: "Share the melody", goto: "dash" }
        ]},
      { id: "mangrove", title: "Mangrove Shade",
        body: "Fireflies flicker, spelling notes.",
        choices: [
          { id: "c13", text: "Follow the lights", goto: "ally" },
          { id: "c14", text: "Collect a leaf talisman", goto: "dash" }
        ]},
      { id: "ally", title: "River’s Ally",
        body: "You learn the River Song. The dolphin gifts a shell that echoes home. • Ending: Guardian of Melody",
        choices: []
      },
      { id: "dash", title: "Tide’s Trick",
        body: "A swirl nudges your canoe back to the dock, safe and wiser. • Ending: Morning Explorer",
        choices: []
      }
    ]),

  mk("amazonia-feather-map", "Feather Map", "Amazonia", "🦜",
    [
      { id: "nest", title: "Macaw Feather",
        body: "A blue feather shows a pattern like a map.",
        choices: [
          { id: "a1", text: "Ask the macaws", goto: "cliff" },
          { id: "a2", text: "Trace the pattern", goto: "riverbend" }
        ]},
      { id: "cliff", title: "Clay Cliff",
        body: "Macaws feast on clay. One squawks, pointing beak-east.",
        choices: [
          { id: "a3", text: "Follow east path", goto: "grove" },
          { id: "a4", text: "Gift fruit", goto: "friend" }
        ]},
      { id: "riverbend", title: "Hidden Bend",
        body: "The river curves like the feather’s quill.",
        choices: [
          { id: "a5", text: "Dive for a shell", goto: "friend" },
          { id: "a6", text: "Sketch the curve", goto: "grove" }
        ]},
      { id: "friend", title: "Rain Partner",
        body: "Rain drums the leaf-roof. A capybara joins you, unbothered.",
        choices: [
          { id: "a7", text: "Share shade", goto: "treasure" },
          { id: "a8", text: "Follow footprints", goto: "grove" }
        ]},
      { id: "grove", title: "Ceiba Grove",
        body: "Roots arch like gates. Inside: a hollow with ancient marks.",
        choices: [
          { id: "a9", text: "Place the feather", goto: "treasure" },
          { id: "a10", text: "Listen for wind", goto: "treasure" }
        ]},
      { id: "treasure", title: "Map Revealed",
        body: "Marks glow—routes for safe travel and nesting sites. • Ending: Keeper of Paths",
        choices: []
      }
    ])
];
