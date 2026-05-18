// Hook que mantiene sincronizada la sesión de Supabase con el estado de React.
// Devuelve { user, session, loading }. En modo demo devuelve { user: null, session: null, loading: false }.
import { useEffect, useState } from 'react';
import { isSupabaseEnabled } from '../services/supabase.js';
import { getSession, onAuthChange } from '../services/auth-supabase.js';
import { setUser as sentrySetUser } from '../services/sentry.js';

export function useSession() {
  const [state, setState] = useState({ user: null, session: null, loading: isSupabaseEnabled });

  useEffect(() => {
    if (!isSupabaseEnabled) return undefined;
    let mounted = true;

    getSession().then((session) => {
      if (!mounted) return;
      const user = session?.user || null;
      sentrySetUser(user ? { id: user.id, email: user.email } : null);
      setState({ user, session, loading: false });
    });

    const unsub = onAuthChange(({ session, user }) => {
      if (!mounted) return;
      sentrySetUser(user ? { id: user.id, email: user.email } : null);
      setState({ user, session, loading: false });
    });

    return () => { mounted = false; unsub(); };
  }, []);

  return state;
}
