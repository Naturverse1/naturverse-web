import { supabase } from '@/lib/supabase-client';

let warned = false;

export async function upsertProfile(userId: string, email: string | null) {
  try {
    const { error } = await supabase.from('profiles').upsert(
      {
        id: userId,
        email,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'id' },
    );
    if (error) throw error;
  } catch (err: any) {
    if (!warned) {
      console.info(
        '[naturverse] optional profile upsert unavailable (ok in demo):',
        err?.message ?? err,
      );
      warned = true;
    }
  }
}
