import { getProfileAction } from '@/features/profile/actions/profile.actions';
import ProfileClientPage from '@/features/profile/components/profileClient';
import { profileKeys } from '@/features/profile/queries/profile';
import { getQueryClient } from '@/lib/providers/query-client';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';

export default async function ProfilePage() {
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: profileKeys.all,
    queryFn: async () => {
      const res = await getProfileAction();

      if (!res.ok) {
        console.error(
          `[Prefetch Error] ID: ${res.requestId}, Code: ${res.code}`
        );
        throw new Error(res.message);
      }
      return res.data;
    },
    staleTime: 1000 * 60 * 10,
  });
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProfileClientPage />
    </HydrationBoundary>
  );
}
