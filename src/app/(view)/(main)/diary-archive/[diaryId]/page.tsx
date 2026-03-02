import DiaryDetailClient from '@/features/diary-archive/components/DiaryDetailClient';
import { diaryKeys } from '@/features/diary/queries/diaries';
import { getDiaryDetailServer } from '@/features/diary/services/diary.server';
import { getQueryClient } from '@/lib/providers/query-client';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';

export default async function DiaryDetailPage({
  params,
}: {
  params: Promise<{ diaryId: string }>;
}) {
  const { diaryId } = await params;
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: diaryKeys.detail(diaryId),
    queryFn: () => getDiaryDetailServer(diaryId),
    staleTime: 1000 * 60 * 30,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <DiaryDetailClient diaryId={diaryId} />
    </HydrationBoundary>
  );
}
