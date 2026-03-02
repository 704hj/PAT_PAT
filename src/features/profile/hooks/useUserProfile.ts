'use client';

import { useQuery } from '@tanstack/react-query';
import { getProfileAction } from '../actions/profile.actions';
import { profileKeys } from '../queries/profile';

export function useUserProfile() {
  return useQuery({
    queryKey: profileKeys.all,
    queryFn: async () => {
      const res = await getProfileAction();
      if (!res.ok) {
        const err = new Error(res.message);
        (err as any).code = res.code;
        throw err;
      }
      return res.data;
    },
    staleTime: 1000 * 60 * 10, // 10분
    gcTime: 1000 * 60 * 60 * 6, // 6시간
    refetchOnWindowFocus: false,
    retry: 1,
  });
}
