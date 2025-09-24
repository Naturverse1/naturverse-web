import { supabase } from "@/lib/supabaseClient";

const productIdCache = new Map<string, string>();

export type WishlistProduct = {
  id: string;
  slug: string;
  title: string;
  priceCents: number;
  imageUrl: string;
};

type WishlistMapRow = {
  product_id: string | null;
  products: { slug: string | null } | null;
};

type WishlistProductRow = {
  product_id: string | null;
  products: {
    slug: string | null;
    title: string | null;
    price_cents: number | null;
    image_url: string | null;
  } | null;
};

async function ensureProductId(slug: string): Promise<string> {
  const cached = productIdCache.get(slug);
  if (cached) return cached;

  const { data, error } = await supabase
    .from("products")
    .select("id")
    .eq("slug", slug)
    .maybeSingle();

  if (error) throw error;
  if (!data?.id) {
    throw new Error("product_not_found");
  }

  productIdCache.set(slug, data.id);
  return data.id;
}

export async function getWishlistMap(): Promise<Record<string, boolean>> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {};
  }

  const { data, error } = await supabase
    .from("wishlist_items")
    .select("product_id, products ( slug )")
    .eq("user_id", user.id);

  if (error) throw error;

  const map: Record<string, boolean> = {};
  const rows = (data ?? []) as unknown as WishlistMapRow[];
  for (const row of rows) {
    const slug = row.products?.slug ?? undefined;
    if (slug) {
      map[slug] = true;
      if (row.product_id) {
        productIdCache.set(slug, row.product_id);
      }
    }
  }

  return map;
}

export async function toggleWishlist(slug: string): Promise<boolean> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("not_signed_in");
  }

  const productId = await ensureProductId(slug);

  const existing = await supabase
    .from("wishlist_items")
    .select("id")
    .eq("user_id", user.id)
    .eq("product_id", productId)
    .maybeSingle();

  if (existing.error) throw existing.error;

  if (existing.data) {
    const { error } = await supabase
      .from("wishlist_items")
      .delete()
      .eq("user_id", user.id)
      .eq("product_id", productId);

    if (error) throw error;
    productIdCache.delete(slug);
    return false;
  }

  const { error } = await supabase
    .from("wishlist_items")
    .insert({ user_id: user.id, product_id: productId });

  if (error) throw error;
  productIdCache.set(slug, productId);
  return true;
}

export async function listWishlistProducts(): Promise<WishlistProduct[]> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return [];
  }

  const { data, error } = await supabase
    .from("wishlist_items")
    .select(
      "product_id, products ( slug, title, price_cents, image_url )"
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) throw error;

  const items: WishlistProduct[] = [];
  const rows = (data ?? []) as unknown as WishlistProductRow[];
  for (const row of rows) {
    const product = row.products;
    if (!product?.slug) continue;
    if (row.product_id) {
      productIdCache.set(product.slug, row.product_id);
    }
    items.push({
      id: row.product_id ?? product.slug,
      slug: product.slug,
      title: product.title ?? product.slug,
      priceCents: product.price_cents ?? 0,
      imageUrl: product.image_url ?? "",
    });
  }

  return items;
}
