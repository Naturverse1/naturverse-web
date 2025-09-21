import { getBrowserClient } from './supabaseClient';

export const supabase = getBrowserClient();
export { getBrowserClient };
export const createClient = () => getBrowserClient();
