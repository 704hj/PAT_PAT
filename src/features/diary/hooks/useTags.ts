'use client';

import { getTagsAction } from '@/features/diary/actions/diary.actions';
import { tagsKeys } from '@/features/diary/queries/tags';
import { useQuery } from '@tanstack/react-query';

export function useTags() {
  return useQuery({
    queryKey: tagsKeys.list(),
    queryFn: async () => {
      const res = await getTagsAction();
      if (!res.ok) throw new Error(res.message);
      return res.data;
    },
    staleTime: 1000 * 60 * 30,
    gcTime: 1000 * 60 * 60 * 6,
    refetchOnWindowFocus: false,
    retry: 1,
  });
}
