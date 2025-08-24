export type LocalProfile = {
  displayName: string;
  email: string;
  kidSafeChat: boolean;
  theme: "system" | "light" | "dark";
  newsletter: boolean;
};

export type CloudProfile = {
  id: string;
  display_name: string | null;
  email: string | null;
  kid_safe_chat: boolean | null;
  theme: "system" | "light" | "dark" | null;
  newsletter: boolean | null;
  avatar_url: string | null;
  updated_at?: string | null;
};
