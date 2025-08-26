export type Database = {
  natur: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string | null;
          username: string | null;
          full_name: string | null;
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
          username?: string | null;
          full_name?: string | null;
          display_name?: string | null;
          avatar_url?: string | null;
          kid_safe?: boolean | null;
          theme?: string | null;
        };
        Update: Partial<Database['natur']['Tables']['profiles']['Insert']>;
      };
      navatars: {
        Row: {
          id: string;
          user_id: string;
          name: string | null;
          base_type: string;
          backstory: string | null;
          image_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<
          Database['natur']['Tables']['navatars']['Row'],
          'id' | 'created_at' | 'updated_at'
        >;
        Update: Partial<Database['natur']['Tables']['navatars']['Insert']>;
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
