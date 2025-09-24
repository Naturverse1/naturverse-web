import { supabase } from '@/lib/supabaseClient';

export type EventName =
  | 'avatar.created'
  | 'avatar.saved'
  | 'marketplace.add_to_cart'
  | 'order.demo_created';

type EventMeta = Record<string, unknown> | undefined | null;

export async function logEvent(type: EventName, meta?: EventMeta) {
  try {
    const { data, error: authError } = await supabase.auth.getUser();
    if (authError) throw authError;
    const userId = data.user?.id ?? null;
    if (!userId) return;

    const payload: Record<string, unknown> = {
      type,
      meta: meta ?? null,
      user_id: userId,
    };

    const { error } = await supabase.from('events').insert(payload);
    if (error) throw error;
  } catch (error) {
    if (import.meta.env.DEV) {
      console.warn('[events]', type, error);
    }
  }
}
