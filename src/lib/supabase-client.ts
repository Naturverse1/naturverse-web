import { getBrowserClient, supabase } from './supabaseClient';

export { getBrowserClient, supabase };
export const createClient = () => getBrowserClient();
