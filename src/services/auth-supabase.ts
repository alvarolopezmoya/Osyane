// Magic link auth con Supabase. Cliente cargado lazy desde services/supabase.
import type { Session, User, AuthChangeEvent } from '@supabase/supabase-js';
import { requireSupabase, isSupabaseEnabled } from './supabase.js';

const ALLOWED_DOMAIN = '@uta.edu.ec';

export function validateInstitutionalEmail(email: string | null | undefined): boolean {
  if (!email || typeof email !== 'string') return false;
  return email.trim().toLowerCase().endsWith(ALLOWED_DOMAIN);
}

export async function sendMagicLink(email: string): Promise<{ ok: true }> {
  if (!isSupabaseEnabled) {
    throw new Error('Magic link no disponible en modo demo. Configura Supabase primero.');
  }
  const addr = email.trim().toLowerCase();
  if (!validateInstitutionalEmail(addr)) {
    throw new Error(`Solo correos ${ALLOWED_DOMAIN} están permitidos.`);
  }
  const sb = await requireSupabase();
  const { error } = await sb.auth.signInWithOtp({
    email: addr,
    options: {
      emailRedirectTo: window.location.origin,
      shouldCreateUser: true,
    },
  });
  if (error) throw error;
  return { ok: true };
}

export async function signOut(): Promise<void> {
  if (!isSupabaseEnabled) return;
  const sb = await requireSupabase();
  await sb.auth.signOut();
}

export async function getSession(): Promise<Session | null> {
  if (!isSupabaseEnabled) return null;
  const sb = await requireSupabase();
  const { data } = await sb.auth.getSession();
  return data.session;
}

export type AuthChangePayload = {
  event: AuthChangeEvent;
  session: Session | null;
  user: User | null;
};

// Devuelve unsubscribe SÍNCRONO desde el caller (importante para useEffect cleanup).
// Internamente espera a que el cliente cargue y entonces se suscribe; si el
// componente se desmonta antes, el flag `cancelled` aborta el setup.
export function onAuthChange(callback: (payload: AuthChangePayload) => void): () => void {
  if (!isSupabaseEnabled) return () => undefined;

  let cancelled = false;
  let sub: { unsubscribe: () => void } | null = null;

  requireSupabase().then((sb) => {
    if (cancelled) return;
    const { data } = sb.auth.onAuthStateChange((event, session) => {
      callback({ event, session, user: session?.user ?? null });
    });
    sub = data.subscription;
  }).catch(() => { /* silent if client failed to init */ });

  return () => {
    cancelled = true;
    sub?.unsubscribe();
  };
}

export interface ProfileRow {
  id: string;
  email: string;
  name: string;
  initials: string;
  role: string;
  xp: number;
  streak: number;
  earned_badges: string[];
}

export async function fetchMyProfile(): Promise<ProfileRow | null> {
  if (!isSupabaseEnabled) return null;
  const sb = await requireSupabase();
  const { data: { user } } = await sb.auth.getUser();
  if (!user) return null;
  const { data, error } = await sb
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();
  if (error && error.code !== 'PGRST116') throw error;
  return data as ProfileRow | null;
}
