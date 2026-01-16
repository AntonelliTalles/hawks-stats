import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../services/supabase';

export type Skater = {
  id: string;
  name: string;
  number: number | null;
  position: 'C' | 'LW' | 'RW' | 'D';
  goals: number;
  assists: number;
  points: number;
  is_active: boolean;
};

export function useSkaters() {
  const queryClient = useQueryClient();

  const skatersQuery = useQuery({
    queryKey: ['skaters'],
    queryFn: async (): Promise<Skater[]> => {
      const { data, error } = await supabase
        .from('skaters')
        .select('*')
        .order('points', { ascending: false });

      if (error) {
        console.error('Erro ao carregar skaters', error);
        throw error;
      }

      return (data ?? []) as Skater[];
    },
  });

  const incrementMutation = useMutation({
    mutationFn: async (payload: {
      skater_id: string;
      goals_delta: number;
      assists_delta: number;
    }) => {
      const { error } = await supabase.rpc('increment_skater_stats', payload);
      if (error) {
        console.error('Erro ao incrementar stats', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['skaters'] });
    },
  });

  return {
    skaters: skatersQuery.data ?? [],
    isLoading: skatersQuery.isLoading,
    isFetching: skatersQuery.isFetching,
    isError: skatersQuery.isError,
    error: skatersQuery.error,
    refetch: skatersQuery.refetch,

    incrementStats: incrementMutation.mutateAsync,
    isIncrementing: incrementMutation.isPending,
  };
}
