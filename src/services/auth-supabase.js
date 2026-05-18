// Magic link auth con Supabase — alternativa al login local.
//
// Flujo:
//   1) Usuario escribe correo @uta.edu.ec
//   2) sendMagicLink() envía un email con un enlace único
//   3) Usuario hace clic en el enlace → vuelve a la app con un token
//   4) detectSessionInUrl: true (en supabase.js) consume el token y crea sesión
//   5) onAuthStateChange dispara el cambio en el store
//
// Validación de dominio: el cliente valida @uta.edu.ec antes de enviar.
// Para seguridad de verdad, hay que configurar también una policy en Supabase:
//   - Auth → Policies → Email Templates → restringir el `signup` a `@uta.edu.ec`
//     o usar el trigger `enforce_uta_email()` definido en supabase/schema.sql

import { requireSupabase, isSupabaseEnabled } from './supabase.js';

const ALLOWED_DOMAIN = '@uta.edu.ec';

export function validateInstitutionalEmail(email) {
  if (!email || typeof email !== 'string') return false;
  return email.trim().toLowerCase().endsWith(ALLOWED_DOMAIN);
}

export async function sendMagicLink(email) {
  if (!isSupabaseEnabled) {
    throw new Error('Magic link no disponible en modo demo. Configura Supabase primero.');
  }
  const addr = email.trim().toLowerCase();
  if (!validateInstitutionalEmail(addr)) {
    throw new Error(`Solo correos ${ALLOWED_DOMAIN} están permitidos.`);
  }
  const sb = requireSupabase();
  const { error } = await sb.auth.signInWithOtp({
    email: addr,
    options: {
      emailRedirectTo: window.location.origin,
      shouldCreateUser: true, // crea perfil automáticamente si es primera vez
    },
  });
  if (error) throw error;
  return { ok: true };
}

export async function signOut() {
  if (!isSupabaseEnabled) return;
  const sb = requireSupabase();
  await sb.auth.signOut();
}

export async function getSession() {
  if (!isSupabaseEnabled) return null;
  const sb = requireSupabase();
  const { data } = await sb.auth.getSession();
  return data.session;
}

// Suscribirse a cambios de sesión (login, logout, refresh).
// Devuelve una función para desuscribirse.
export function onAuthChange(callback) {
  if (!isSupabaseEnabled) return () => {};
  const sb = requireSupabase();
  const { data: { subscription } } = sb.auth.onAuthStateChange((event, session) => {
    callback({ event, session, user: session?.user || null });
  });
  return () => subscription.unsubscribe();
}

// Obtener perfil ampliado (xp, racha, insignias) desde la tabla `profiles`.
export async function fetchMyProfile() {
  if (!isSupabaseEnabled) return null;
  const sb = requireSupabase();
  const { data: { user } } = await sb.auth.getUser();
  if (!user) return null;
  const { data, error } = await sb
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();
  if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows
  return data;
}
