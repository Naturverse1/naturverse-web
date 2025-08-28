import { useMemo } from 'react';
import { getSupabase } from './supabase-client';

export function useSupabase() {
  return useMemo(() => getSupabase(), []);
}
