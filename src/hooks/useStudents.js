// Hook de TanStack Query para la lista de perfiles (estudiantes + docentes).
// Solo activo cuando Supabase está configurado.
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { isSupabaseEnabled, supabase } from '../services/supabase.js';
import {
  fetchProfiles, awardXp as apiAwardXp, awardBadge as apiAwardBadge,
  subscribeToTable,
} from '../services/api-supabase.js';
import { useEffect } from 'react';

export const PROFILES_KEY = ['profiles'];

export function useStudents() {
  const qc = useQueryClient();

  // Realtime: invalidar cache cuando otro usuario actualice perfiles.
  useEffect(() => {
    if (!isSupabaseEnabled) return undefined;
    return subscribeToTable('profiles', () => {
      qc.invalidateQueries({ queryKey: PROFILES_KEY });
    });
  }, [qc]);

  return useQuery({
    queryKey: PROFILES_KEY,
    queryFn: fetchProfiles,
    enabled: isSupabaseEnabled,
  });
}

export function useAwardXp() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: apiAwardXp,
    onSuccess: () => qc.invalidateQueries({ queryKey: PROFILES_KEY }),
  });
}

export function useAwardBadge() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: apiAwardBadge,
    onSuccess: () => qc.invalidateQueries({ queryKey: PROFILES_KEY }),
  });
}
