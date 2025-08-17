export type SKU = 'PLUSH_TUR' | 'COSTUME_HAL' | 'STICKER_STD' | 'TEE_KIDS';

export interface Product {
  sku: SKU;
  title: string;
  basePriceNatur: number; // price in NATUR (for later web3)
  thumb: string; // simple /assets/... path
  options?: {
    size?: 'XS' | 'S' | 'M' | 'L';
    color?: string[];
    material?: 'Cotton' | 'Poly' | 'Organic';
  };
}

export interface Customization {
  navatarUrl: string; // pulled from profile/supabase or local preview
  size?: string;
  color?: string;
  material?: string;
  textLine?: string;
  qty: number;
}

export interface CartItem {
  sku: SKU;
  title: string;
  unitNatur: number;
  customization: Customization;
  lineNatur: number;
  id: string; // uid for item row
}

export interface Order {
  id: string;
  createdAt: string;
  items: CartItem[];
  totalNatur: number;
  previewUrl?: string; // composite preview (v2)
}
