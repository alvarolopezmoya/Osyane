import { useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { isSupabaseEnabled } from '../services/supabase.js';
import {
  fetchProfiles, awardXp as apiAwardXp, awardBadge as apiAwardBadge,
  subscribeToTable,
} from '../services/api-supabase.js';

export const PROFILES_KEY = ['profiles'] as const;

export function useStudents() {
  const qc = useQueryClient();

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
