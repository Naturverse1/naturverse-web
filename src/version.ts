// Lightweight runtime version info (no build tooling required).
export const BUILD_TIME_ISO = new Date().toISOString();

// If you later add these to Netlify > Environment variables, they’ll show up automatically.
// e.g. VITE_BRANCH=main-stable-642, VITE_RELEASE=v0.1.0
export const BRANCH =
  import.meta.env.VITE_BRANCH || "main-stable-642";
export const RELEASE =
  import.meta.env.VITE_RELEASE || "";
