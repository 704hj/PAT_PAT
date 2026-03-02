'use client';

import { getHomeSummaryAction } from '../actions/home.actions';
import { homeKeys } from '../queries/summary';
import { useQuery } from '@tanstack/react-query';

export function useHomeSummary() {
  return useQuery({
    queryKey: homeKeys.summary(),
    queryFn: async () => {
      const res = await getHomeSummaryAction();
      if (!res.ok) throw new Error(res.message);
      return res.data;
    },
    staleTime: 1000 * 60 * 30,
    gcTime: 1000 * 60 * 60 * 6,
    refetchOnWindowFocus: false,
    retry: 1,
  });
}
