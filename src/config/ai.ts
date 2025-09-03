// Single switch for all “AI” features across the app.
export const AI_MODE = (import.meta.env.VITE_AI_MODE || "demo") as
  | "demo"  // no external calls, mocked replies
  | "live"; // real API calls (OpenAI, etc.)

export const isDemo = AI_MODE === "demo";
export const isLive = AI_MODE === "live";

