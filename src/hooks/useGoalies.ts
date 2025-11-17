import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../services/supabase';

export function useGoalies() {
  return useQuery({
    queryKey: ['goalies'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('goalies')
        .select('*')
        .eq('is_active', true)
        .order('save_pct', { ascending: false })
        .order('wins', { ascending: false });
      if (error) throw error;
      return data;
    },
  });
}

export function useIncrementGoalie() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: { goalie_id: string; gs_delta: number; sa_delta: number; sv_delta: number; w_delta: number; so_delta: number }) => {
      const { error } = await supabase.rpc('increment_goalie_stats', input);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['goalies'] }),
  });
}
