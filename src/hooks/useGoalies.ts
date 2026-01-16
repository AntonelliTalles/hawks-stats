import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../services/supabase';

export type Goalie = {
  id: string;
  name: string;
  games_started: number;
  shots_against: number;
  number?: number;
  position?: string;
  saves: number;
  wins: number;
  shutouts: number;
  save_pct: number | null;
  is_active: boolean;
};

export function useGoalies() {
  const queryClient = useQueryClient();

  const goaliesQuery = useQuery({
    queryKey: ['goalies'],
    queryFn: async (): Promise<Goalie[]> => {
      const { data, error } = await supabase
        .from('goalies')
        .select('*')
        .order('wins', { ascending: false });

      if (error) {
        console.error('Erro ao carregar goalies', error);
        throw error;
      }

      return (data ?? []) as Goalie[];
    },
  });

  const incrementMutation = useMutation({
    mutationFn: async (payload: {
      goalie_id: string;
      gs_delta: number;
      sa_delta: number;
      sv_delta: number;
      w_delta: number;
      so_delta: number;
    }) => {
      const { error } = await supabase.rpc('increment_goalie_stats', payload);
      if (error) {
        console.error('Erro ao incrementar stats de goalie', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goalies'] });
    },
  });

  return {
    goalies: goaliesQuery.data ?? [],
    isLoading: goaliesQuery.isLoading,
    isFetching: goaliesQuery.isFetching,
    isError: goaliesQuery.isError,
    error: goaliesQuery.error,
    refetch: goaliesQuery.refetch,

    incrementStats: incrementMutation.mutateAsync,
    isIncrementing: incrementMutation.isPending,
  };
}
