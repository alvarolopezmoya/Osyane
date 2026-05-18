import { useEffect, useState } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { isSupabaseEnabled } from '../services/supabase.js';
import { getSession, onAuthChange } from '../services/auth-supabase.js';
import { setUser as sentrySetUser } from '../services/sentry.js';

interface SessionState {
  user: User | null;
  session: Session | null;
  loading: boolean;
}

export function useSession(): SessionState {
  const [state, setState] = useState<SessionState>({
    user: null,
    session: null,
    loading: isSupabaseEnabled,
  });

  useEffect(() => {
    if (!isSupabaseEnabled) return undefined;
    let mounted = true;

    getSession().then((session) => {
      if (!mounted) return;
      const user = session?.user ?? null;
      sentrySetUser(user ? { id: user.id, email: user.email } : null);
      setState({ user, session, loading: false });
    });

    const unsub = onAuthChange(({ session, user }) => {
      if (!mounted) return;
      sentrySetUser(user ? { id: user.id, email: user.email ?? undefined } : null);
      setState({ user, session, loading: false });
    });

    return () => { mounted = false; unsub(); };
  }, []);

  return state;
}
