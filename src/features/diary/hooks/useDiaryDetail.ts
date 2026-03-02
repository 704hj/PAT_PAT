'use client';

import { getDiaryDetailAction } from '@/features/diary/actions/diary.actions';
import { diaryKeys } from '../queries/diaries';
import { useQuery } from '@tanstack/react-query';

export function useDiaryDetail(diaryId?: string) {
  return useQuery({
    queryKey: diaryKeys.detail(diaryId ?? ''),
    queryFn: async () => {
      const res = await getDiaryDetailAction(diaryId!);
      if (!res.ok) throw new Error(res.message);
      return res.data;
    },
    enabled: !!diaryId,
    staleTime: 1000 * 60 * 30,
    gcTime: 1000 * 60 * 60 * 6,
    refetchOnWindowFocus: false,
    retry: 1,
  });
}
