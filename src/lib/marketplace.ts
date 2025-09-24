import { supabase } from '@/lib/supabaseClient';

export type DemoLineItem = {
  id: string;
  name: string;
  price: number;
  qty: number;
};

export async function saveDemoOrder(items: DemoLineItem[]) {
  const { data } = await supabase.auth.getUser();
  const userId = data.user?.id ?? null;

  const resp = await fetch('/api/marketplace/demo-order', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ lineItems: items, userId }),
  });

  if (!resp.ok) {
    const err = await resp.json().catch(() => null);
    const message = typeof err?.error === 'string' ? err.error : 'Unable to save demo order';
    throw new Error(message);
  }

  return resp.json() as Promise<{ ok: boolean; order?: { id: string } }>;
}

