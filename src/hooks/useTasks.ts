import { useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { isSupabaseEnabled } from '../services/supabase.js';
import {
  fetchTasks, createTask, deleteTask,
  fetchSubmissions, submitTask, reviewSubmission,
  subscribeToTable,
} from '../services/api-supabase.js';

export const TASKS_KEY = ['tasks'] as const;
export const SUBMISSIONS_KEY = ['submissions'] as const;

export function useTasks() {
  const qc = useQueryClient();
  useEffect(() => {
    if (!isSupabaseEnabled) return undefined;
    return subscribeToTable('tasks', () => qc.invalidateQueries({ queryKey: TASKS_KEY }));
  }, [qc]);

  return useQuery({
    queryKey: TASKS_KEY,
    queryFn: fetchTasks,
    enabled: isSupabaseEnabled,
  });
}

export function useCreateTask() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createTask,
    onSuccess: () => qc.invalidateQueries({ queryKey: TASKS_KEY }),
  });
}

export function useDeleteTask() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteTask,
    onSuccess: () => qc.invalidateQueries({ queryKey: TASKS_KEY }),
  });
}

export function useSubmissions() {
  const qc = useQueryClient();
  useEffect(() => {
    if (!isSupabaseEnabled) return undefined;
    return subscribeToTable('submissions', () => qc.invalidateQueries({ queryKey: SUBMISSIONS_KEY }));
  }, [qc]);

  return useQuery({
    queryKey: SUBMISSIONS_KEY,
    queryFn: fetchSubmissions,
    enabled: isSupabaseEnabled,
  });
}

export function useSubmitTask() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: submitTask,
    onSuccess: () => qc.invalidateQueries({ queryKey: SUBMISSIONS_KEY }),
  });
}

export function useReviewSubmission() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: reviewSubmission,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: SUBMISSIONS_KEY });
      qc.invalidateQueries({ queryKey: ['profiles'] });
    },
  });
}
