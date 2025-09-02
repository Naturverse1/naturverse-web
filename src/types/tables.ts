export type AvatarMethod = "upload" | "ai" | "canon";
export interface AvatarRow {
  id: string;
  user_id: string|null;
  name: string|null;
  method: AvatarMethod;
  image_url: string; // always a public URL now
  created_at?: string;
}
