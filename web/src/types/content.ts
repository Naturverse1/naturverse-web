export type ZoneId =
  | "music" | "wellness" | "creator-lab" | "community"
  | "teachers" | "partners" | "naturversity" | "parents";

export interface DocMeta {
  title: string;
  summary?: string;
  zone: ZoneId;
  slug: string;         // filesystem slug
  tags?: string[];
  cover?: string;       // path in /src/attached_assets or remote
  order?: number;
}

export interface Doc<T = unknown> extends DocMeta {
  body?: string;        // markdown html
  data?: T;             // optional JSON payload (quizzes, links, etc.)
}
