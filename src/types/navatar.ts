export type NavatarMethod = "upload" | "canon" | "ai";
export interface NavatarRow {
  id: string;
  user_id: string;
  name: string | null;
  method: NavatarMethod;
  storage_path: string | null;
  canon_key: string | null;
  created_at: string;
}
