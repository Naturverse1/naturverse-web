export type AIMode = "demo" | "live";
export const AI_MODE: AIMode =
  (import.meta.env.VITE_AI_MODE as AIMode) || "demo";

export const isDemo = () => AI_MODE === "demo";
