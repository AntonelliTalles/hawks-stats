import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
// import type { Goalie } from "../types/goalie";
import { listGoalies, incrementGoalieStats } from '../services/goalies.firestore';

export function useGoalies() {
  const qc = useQueryClient();

  const query = useQuery({
    queryKey: ['goalies'],
    queryFn: listGoalies,
  });

  const incrementMutation = useMutation({
    mutationFn: async (payload: {
      goalie_id: string;
      gs_delta: number;
      sa_delta: number;
      sv_delta: number;
      w_delta: number;
      so_delta: number;
    }) =>
      incrementGoalieStats(payload.goalie_id, {
        gs: payload.gs_delta,
        sa: payload.sa_delta,
        sv: payload.sv_delta,
        w: payload.w_delta,
        so: payload.so_delta,
      }),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ['goalies'] });
    },
  });

  return {
    goalies: query.data ?? [],
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isError: query.isError,
    error: (query.error as Error) ?? null,
    refetch: query.refetch,
    incrementStats: incrementMutation.mutateAsync,
    isIncrementing: incrementMutation.isPending,
  };
}
