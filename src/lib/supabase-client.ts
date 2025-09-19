import { supabase } from './supabaseClient';

export { supabase };
export const createClient = () => supabase;
