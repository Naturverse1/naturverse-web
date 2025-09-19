export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string | null;
          display_name: string | null;
          avatar_url: string | null;
          kid_safe: boolean | null;
          theme: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email?: string | null;
          display_name?: string | null;
          avatar_url?: string | null;
          kid_safe?: boolean | null;
          theme?: string | null;
        };
        Update: Partial<Database['public']['Tables']['profiles']['Insert']>;
      };
      navatars: {
        Row: {
          id: string;
          owner_id: string;
          name: string | null;
          base_type: string | null;
          species: string | null;
          kingdom: string | null;
          backstory: string | null;
          image_url: string | null;
          image_path: string | null;
          thumbnail_url: string | null;
          is_public: boolean | null;
          is_primary: boolean | null;
          metadata: Record<string, unknown> | null;
          card: Record<string, unknown> | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          owner_id: string;
          name?: string | null;
          base_type?: string | null;
          species?: string | null;
          kingdom?: string | null;
          backstory?: string | null;
          image_url?: string | null;
          image_path?: string | null;
          thumbnail_url?: string | null;
          is_public?: boolean | null;
          is_primary?: boolean | null;
          metadata?: Record<string, unknown> | null;
          card?: Record<string, unknown> | null;
        };
        Update: Partial<Database['public']['Tables']['navatars']['Insert']>;
      };
      navatar_cards: {
        Row: {
          id: string;
          navatar_id: string;
          powers: string[] | null;
          traits: string[] | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          navatar_id: string;
          powers?: string[] | null;
          traits?: string[] | null;
        };
        Update: Partial<Database['public']['Tables']['navatar_cards']['Insert']>;
      };
      passport_stamps: {
        Row: { id: number; user_id: string; kingdom: string; stamped_at: string };
        Insert: { user_id: string; kingdom: string };
        Update: Partial<{ kingdom: string }>;
      };
    };
    Views: {
      user_xp: {
        Row: { user_id: string; xp: number };
      };
      natur_balances: {
        Row: { user_id: string; balance: number };
      };
    };
  };
};
