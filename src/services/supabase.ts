// Cliente Supabase. Ver supabase/README.md para el setup.
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const URL = import.meta.env.VITE_SUPABASE_URL;
const KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseEnabled: boolean = Boolean(URL && KEY);

export const supabase: SupabaseClient | null = isSupabaseEnabled
  ? createClient(URL!, KEY!, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        flowType: 'pkce',
      },
      global: { headers: { 'x-application-name': 'osyane' } },
    })
  : null;

export function requireSupabase(): SupabaseClient {
  if (!supabase) throw new Error('Supabase no está configurado. Define VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY.');
  return supabase;
}
