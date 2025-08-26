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
    if (!warned && import.meta.env.DEV) {
      // eslint-disable-next-line no-console
      console.info(
        '[naturverse] optional profile upsert unavailable (ok in demo):',
        err?.message ?? err,
      );
      warned = true;
    }
    // swallow in prod
  }
}
