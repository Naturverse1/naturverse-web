// Safe, network-friendly warmup for route chunks
// - Uses import.meta.glob to discover *existing* pages
// - Only preloads when idle & on decent connections

type Loader = () => Promise<unknown>;

const pages = import.meta.glob('../pages/**/*.tsx') as Record<string, Loader>;

// Pick the routes you want to warm (keys must exist or we skip)
const CANDIDATES = [
  '../pages/Worlds.tsx',
  '../pages/Zones.tsx',
  '../pages/marketplace.tsx',
  '../pages/marketplace/wishlist.tsx',
  '../pages/naturversity.tsx',
  '../pages/NaturBank.tsx',
  '../pages/navatar.tsx',
  '../pages/Passport.tsx',
  '../pages/Turian.tsx',
  '../pages/Cart.tsx',
];

function warm(key: string) {
  const loader = pages[key];
  if (typeof loader === 'function') {
    loader().catch(() => {
      // silently ignore; never break runtime
    });
  }
}

function isGoodConnection() {
  // @ts-ignore – NetworkInformation isn't in TS lib by default everywhere
  const info = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  if (!info) return true;
  const save = 'saveData' in info && info.saveData;
  const downlink = 'downlink' in info ? Number(info.downlink) : 1;
  return !save && downlink >= 1;
}

const start = () => CANDIDATES.forEach(warm);

if (isGoodConnection()) {
  if ('requestIdleCallback' in window) {
    // @ts-ignore
    requestIdleCallback(start, { timeout: 3000 });
  } else {
    setTimeout(start, 1200);
  }
}
