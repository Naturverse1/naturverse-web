import { getSupabase } from "@/lib/supabaseClient";

export async function ensureBucket(): Promise<void> {
  const supabase = getSupabase();
  if (!supabase) return;
  const { error } = await supabase.storage.createBucket('order-previews', {
    public: true,
  });
  if (error && error.status !== 409) {
    throw error;
  }
}

export async function uploadOrderPreview(
  orderId: string,
  lineId: string,
  dataUrl: string
): Promise<string | null> {
  try {
    const supabase = getSupabase();
    if (!supabase) return null;
    const res = await fetch(dataUrl);
    const blob = await res.blob();
    const path = `orders/${orderId}/${lineId}.png`;
    const { error } = await supabase
      .storage
      .from('order-previews')
      .upload(path, blob, { upsert: true, contentType: 'image/png' });
    if (error) throw error;
    const { data } = supabase
      .storage
      .from('order-previews')
      .getPublicUrl(path);
    return data.publicUrl || null;
  } catch {
    return null;
  }
}
