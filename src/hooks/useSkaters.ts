import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
// import type { Skater } from "../types/skater";
import { listSkaters, incrementSkaterStats } from '../services/skaters.firestore';

export function useSkaters() {
  const qc = useQueryClient();

  const query = useQuery({
    queryKey: ['skaters'],
    queryFn: listSkaters,
  });

  const incrementMutation = useMutation({
    mutationFn: async (payload: {
      skater_id: string;
      goals_delta: number;
      assists_delta: number;
    }) => incrementSkaterStats(payload.skater_id, payload.goals_delta, payload.assists_delta),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ['skaters'] });
    },
  });

  return {
    skaters: query.data ?? [],
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isError: query.isError,
    error: (query.error as Error) ?? null,
    refetch: query.refetch,
    incrementStats: incrementMutation.mutateAsync,
    isIncrementing: incrementMutation.isPending,
  };
}
