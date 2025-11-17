import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../services/supabase';

export function useSkaters() {
  return useQuery({
    queryKey: ['skaters'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('skaters')
        .select('*')
        .eq('is_active', true)
        .order('points', { ascending: false })
        .order('goals', { ascending: false });
      if (error) throw error;
      return data;
    },
  });
}

export function useIncrementSkater() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: { skater_id: string; goals_delta: number; assists_delta: number }) => {
      const { error } = await supabase.rpc('increment_skater_stats', input);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['skaters'] }),
  });
}
