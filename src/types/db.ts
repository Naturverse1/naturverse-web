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
          image_url: string | null;
          image_path: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          owner_id: string;
          name?: string | null;
          image_url?: string | null;
          image_path?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['navatars']['Insert']>;
      };
      navatar_cards: {
        Row: {
          id: string;
          owner_id: string;
          navatar_id: string | null;
          name: string | null;
          species: string | null;
          kingdom: string | null;
          backstory: string | null;
          powers: string[] | null;
          traits: string[] | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          owner_id: string;
          navatar_id?: string | null;
          name?: string | null;
          species?: string | null;
          kingdom?: string | null;
          backstory?: string | null;
          powers?: string[] | null;
          traits?: string[] | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['navatar_cards']['Insert']>;
      };
      passport_stamps: {
        Row: { id: number; user_id: string; kingdom: string; stamped_at: string };
        Insert: { user_id: string; kingdom: string };
        Update: Partial<{ kingdom: string }>;
      };
      orders_demo: {
        Row: {
          id: string;
          user_id: string | null;
          line_items: unknown;
          status: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          line_items: unknown;
          status?: string | null;
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['orders_demo']['Insert']>;
      };
      wishlists: {
        Row: {
          id: string;
          user_id: string | null;
          item_id: string;
          product_name: string;
          product_price: number | string | null;
          product_image: string | null;
          product_href: string | null;
          added_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          item_id: string;
          product_name: string;
          product_price?: number | string | null;
          product_image?: string | null;
          product_href?: string | null;
          added_at?: string | null;
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['wishlists']['Insert']>;
      };
      events: {
        Row: {
          id: string;
          user_id: string;
          type: string;
          meta: unknown;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          type: string;
          meta?: unknown;
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['events']['Insert']>;
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
