// Cliente Supabase — se habilita SOLO si las env vars están definidas.
// En modo demo (sin env vars), `supabase` es null y la app cae al fallback con localStorage.
//
// Setup:
//   1) Crear proyecto en https://supabase.com
//   2) Project Settings → API → copiar `URL` y `anon public key`
//   3) Crear archivo .env en la raíz con:
//        VITE_SUPABASE_URL=https://xxx.supabase.co
//        VITE_SUPABASE_ANON_KEY=eyJhbGciOi...
//   4) Ejecutar las migraciones de supabase/schema.sql en el SQL Editor del dashboard
//   5) (Opcional) supabase/seed.sql para datos de prueba
//   6) Configurar Authentication → Providers → Email → activar "Confirm email" y
//      añadir el dominio @uta.edu.ec a "Allowed email domains" (o usar el trigger en schema.sql)
//
// Cualquier query a Supabase debe respetar las RLS policies definidas en schema.sql.

import { createClient } from '@supabase/supabase-js';

const URL = import.meta.env.VITE_SUPABASE_URL;
const KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseEnabled = Boolean(URL && KEY);

export const supabase = isSupabaseEnabled
  ? createClient(URL, KEY, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true, // necesario para magic-link callback
        flowType: 'pkce',
      },
      global: { headers: { 'x-application-name': 'osyane' } },
    })
  : null;

// Helper: log seguro (no fallar si el cliente está deshabilitado).
export function requireSupabase() {
  if (!supabase) throw new Error('Supabase no está configurado. Define VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY.');
  return supabase;
}
