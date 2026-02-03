import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { listGoalies, incrementGoalieStats } from '../services/goalies.firestore';

export { type Goalie } from '../services/goalies.firestore';

export function useGoalies() {
  const { data, isLoading, isFetching, error, refetch } = useQuery({
    queryKey: ['goalies'],
    queryFn: listGoalies,
  });

  return {
    goalies: data ?? [],
    isLoading,
    isFetching,
    isError: !!error,
    refetch,
  };
}

export function useIncrementGoalie() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: {
      goalie_id: string;
      gs_delta: number;
      sa_delta: number;
      sv_delta: number;
      w_delta: number;
      so_delta: number;
    }) =>
      incrementGoalieStats(payload.goalie_id, {
        gs_delta: payload.gs_delta,
        sa_delta: payload.sa_delta,
        sv_delta: payload.sv_delta,
        w_delta: payload.w_delta,
        so_delta: payload.so_delta,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goalies'] });
    },
  });
}
