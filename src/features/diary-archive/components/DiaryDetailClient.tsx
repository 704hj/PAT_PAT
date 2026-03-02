'use client';

import { useDiaryDetail } from '@/features/diary/hooks/useDiaryDetail';
import { useRouter } from 'next/navigation';

const POLARITY_STYLE: Record<string, { dot: string; label: string }> = {
  POSITIVE: { dot: 'bg-sky-400',    label: '긍정' },
  NEGATIVE: { dot: 'bg-violet-400', label: '부정' },
  UNSET:    { dot: 'bg-white/30',   label: '중립' },
};

function formatEntryDate(date: string) {
  const d = new Date(date);
  const days = ['일', '월', '화', '수', '목', '금', '토'];
  return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일 (${days[d.getDay()]})`;
}

export default function DiaryDetailClient({ diaryId }: { diaryId: string }) {
  const router = useRouter();
  const { data: diary, isLoading, isError } = useDiaryDetail(diaryId);

  const polarity = diary
    ? (POLARITY_STYLE[diary.emotion_polarity] ?? POLARITY_STYLE.UNSET)
    : null;

  return (
    <main className="relative min-h-[100svh] text-white">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(180deg,#07102a_0%,#050b1c_100%)]" />

      <section className="mx-auto max-w-[480px] px-5 pb-16">
        {/* 헤더 */}
        <header className="pt-6 pb-4 flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="h-9 w-9 rounded-lg bg-white/6 border border-white/10 text-white/80 flex items-center justify-center shrink-0"
          >
            ←
          </button>
          <h1 className="text-[17px] font-semibold text-white/90">일기</h1>
        </header>

        {/* 로딩 */}
        {isLoading && (
          <div className="mt-10 space-y-3 animate-pulse">
            <div className="h-4 w-32 rounded-full bg-white/10" />
            <div className="h-40 rounded-2xl bg-white/5" />
          </div>
        )}

        {/* 에러 */}
        {isError && (
          <div className="mt-10 rounded-2xl border border-white/10 bg-white/5 px-5 py-10 text-center">
            <p className="text-[14px] text-white/60">기록을 불러오지 못했어요.</p>
            <button
              onClick={() => router.back()}
              className="mt-4 text-[13px] text-white/40 underline underline-offset-4"
            >
              돌아가기
            </button>
          </div>
        )}

        {/* 본문 */}
        {diary && polarity && (
          <>
            {/* 날짜 + 감정 */}
            <div className="flex items-center gap-2 mb-4">
              <span className={['w-2 h-2 rounded-full shrink-0', polarity.dot].join(' ')} />
              <span className="text-[15px] font-semibold text-white">
                {formatEntryDate(diary.entry_date)}
              </span>
              <span className="ml-auto text-[12px] text-white/35">{polarity.label}</span>
            </div>

            {/* 내용 카드 */}
            <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-5">
              <p className="text-[14px] leading-relaxed whitespace-pre-wrap text-white/85">
                {diary.content}
              </p>

              {diary.tags && diary.tags.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {diary.tags.map((t) => (
                    <span
                      key={t.tag_id}
                      className="text-[11px] px-2.5 py-1 rounded-full bg-white/8 text-white/60"
                    >
                      #{t.tag_name}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* 수정 버튼 */}
            <button
              onClick={() => router.push(`/diary/editor?diaryId=${diary.diary_id}`)}
              className="mt-4 w-full h-12 rounded-2xl bg-[linear-gradient(180deg,var(--cta-from)_0%,var(--cta-to)_100%)] border border-white/14 text-[14px] font-semibold text-white"
            >
              수정하기
            </button>
          </>
        )}
      </section>
    </main>
  );
}
