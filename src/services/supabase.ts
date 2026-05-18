// Cliente Supabase lazy — el SDK (~110 KB gzip) NO entra en el bundle inicial.
// Solo se descarga la primera vez que algún hook/función llama `requireSupabase()`.
// En modo demo (sin env vars) jamás se carga.
//
// Ver supabase/README.md para el setup completo.

import type { SupabaseClient } from '@supabase/supabase-js';

const URL = import.meta.env.VITE_SUPABASE_URL;
const KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseEnabled: boolean = Boolean(URL && KEY);

let _client: SupabaseClient | null = null;
let _loading: Promise<SupabaseClient> | null = null;

export async function getSupabase(): Promise<SupabaseClient | null> {
  if (!isSupabaseEnabled) return null;
  if (_client) return _client;
  if (_loading) return _loading;

  _loading = (async () => {
    const { createClient } = await import('@supabase/supabase-js');
    _client = createClient(URL!, KEY!, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        flowType: 'pkce',
      },
      global: { headers: { 'x-application-name': 'osyane' } },
    });
    return _client;
  })();

  return _loading;
}

export async function requireSupabase(): Promise<SupabaseClient> {
  const sb = await getSupabase();
  if (!sb) throw new Error('Supabase no está configurado. Define VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY.');
  return sb;
}
