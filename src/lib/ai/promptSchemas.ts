export type NaturversityQuizItem = {
  q: string;
  a: string;
  choices?: string[];
};

export type NaturversityQuiz = {
  topic: string;
  age: number;
  items: NaturversityQuizItem[];
};

export type NaturversityQuizRequest = {
  topic: string;
  age: number;
  outline: string[];
};

export const NATURVERSITY_QUIZ_JSON_SCHEMA = {
  type: "object",
  required: ["topic", "age", "items"],
  properties: {
    topic: { type: "string" },
    age: { type: "number", minimum: 4, maximum: 16 },
    items: {
      type: "array",
      minItems: 3,
      maxItems: 3,
      items: {
        type: "object",
        required: ["q", "a"],
        properties: {
          q: { type: "string" },
          a: { type: "string" },
          choices: {
            type: "array",
            items: { type: "string" },
            minItems: 2,
            maxItems: 6,
          },
        },
        additionalProperties: false,
      },
    },
  },
  additionalProperties: false,
} as const;

export const NATURVERSITY_QUIZ_SYSTEM_PROMPT = `You are a playful, accurate kids' quiz writer.
Return STRICT JSON matching this schema:
{"topic": "string", "age": 8, "items": [{"q":"string","a":"string","choices":["A","B","C","D"]}]}
- 3 items exactly
- choices must include the correct answer "a"
- keep simple, age-appropriate
- no extra commentary`;

export const NATURVERSITY_QUIZ_SAFETY_RULES = `Keep questions positive, encouraging, and curious.
Avoid anything scary, violent, political, or adult. Use kid-friendly language.`;

export function clampNaturversityQuizAge(age: number): number {
  if (!Number.isFinite(age)) return 8;
  const rounded = Math.round(age);
  if (rounded < 4) return 4;
  if (rounded > 16) return 16;
  return rounded;
}

export function buildNaturversityQuizUserPrompt(topic: string, age: number, outline: string[]): string {
  const safeTopic = topic.trim().slice(0, 120) || "Nature";
  const safeAge = clampNaturversityQuizAge(age);
  const safeOutline = outline
    .map((item) => item?.trim().slice(0, 160))
    .filter(Boolean)
    .slice(0, 8);
  const outlineBlock = safeOutline.length
    ? safeOutline.map((item) => `- ${item}`).join("\n")
    : "- (no outline provided)";
  return `Topic: ${safeTopic}\nAge: ${safeAge}\nOutline bullets:\n${outlineBlock}`;
}
