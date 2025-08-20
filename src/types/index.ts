export type Score = { id: string; game: string; name: string; points: number; created_at: string };
export type ChatReq = { messages: { role: "system"|"user"|"assistant"; content: string }[] };
export type ChatRes = { reply: string };

