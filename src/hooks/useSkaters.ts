import { useQuery } from '@tanstack/react-query';
import { listSkaters } from '../services/skaters.firestore';
import type { Skater } from '../types/skater';

export function useSkaters() {
  const { data, isLoading, isError, error, isFetching, refetch } = useQuery<Skater[]>({
    queryKey: ['skaters'],
    queryFn: listSkaters,
  });

  return {
    skaters: data ?? [],
    isLoading,
    isError,
    error,
    isFetching,
    refetch,
  };
}
