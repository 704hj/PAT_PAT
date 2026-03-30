'use client';

import { useDiaryDetail } from '@/features/diary/hooks/useDiaryDetail';
import BackButton from '@/shared/components/BackButton';
import { useRouter } from 'next/navigation';

const POLARITY: Record<string, { color: string; label: string }> = {
  POSITIVE: { color: '#93c5fd', label: '긍정의 별' },
  NEGATIVE: { color: '#c4b5fd', label: '부정의 별' },
  UNSET:    { color: 'rgba(255,255,255,0.35)', label: '기억의 별' },
};

function formatEntryDate(date: string) {
  const d = new Date(date);
  const days = ['일', '월', '화', '수', '목', '금', '토'];
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')} (${days[d.getDay()]})`;
}

export default function DiaryDetailClient({ diaryId }: { diaryId: string }) {
  const router = useRouter();
  const { data: diary, isLoading, isError } = useDiaryDetail(diaryId);

  const polarity = diary
    ? (POLARITY[diary.emotion_polarity] ?? POLARITY.UNSET)
    : null;

  return (
    <main className="relative min-h-[100svh] text-white">
      {/* 배경 */}
      <div className="pointer-events-none absolute inset-0 -z-10"
        style={{ background: 'linear-gradient(180deg, #07102a 0%, #040918 100%)' }}
      />
      {/* 배경 성운 */}
      <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-96 h-64 -z-10 rounded-full blur-[100px] opacity-15"
        style={{ background: 'radial-gradient(ellipse, #4f6fff 0%, #2040c0 50%, transparent 100%)' }}
      />

      <section className="mx-auto max-w-[480px] px-5 pb-20">
        {/* 헤더 */}
        <header className="pt-6 pb-6 flex items-center gap-3">
          <BackButton />
          <div className="flex items-center gap-1.5">
            <svg width="10" height="10" viewBox="0 0 10 10" fill="rgba(150,180,255,0.5)">
              <polygon points="5,0.5 6.2,3.8 9.5,3.8 6.9,5.9 7.9,9.2 5,7.1 2.1,9.2 3.1,5.9 0.5,3.8 3.8,3.8" />
            </svg>
            <h1 className="text-[13px] tracking-[0.15em] text-white/35 uppercase">Star Record</h1>
          </div>
        </header>

        {/* 로딩 */}
        {isLoading && (
          <div className="mt-6 space-y-3 animate-pulse">
            <div className="h-3 w-24 rounded-full bg-white/10" />
            <div className="h-5 w-40 rounded-full bg-white/8" />
            <div className="h-48 mt-6 rounded-3xl bg-white/5" />
          </div>
        )}

        {/* 에러 */}
        {isError && (
          <div className="mt-10 rounded-3xl border border-white/8 bg-white/3 px-5 py-10 text-center">
            <p className="text-[14px] text-white/40">기록을 불러오지 못했어요.</p>
            <button
              onClick={() => router.back()}
              className="mt-4 text-[12px] text-white/30 underline underline-offset-4"
            >
              돌아가기
            </button>
          </div>
        )}

        {/* 본문 */}
        {diary && polarity && (
          <div className="space-y-4">
            {/* 날짜 + 감정 */}
            <div>
              <p className="text-[11px] tracking-[0.18em] uppercase mb-2"
                style={{ color: `${polarity.color}80` }}>
                {polarity.label}
              </p>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: polarity.color, boxShadow: `0 0 6px ${polarity.color}` }}
                />
                <h2 className="text-[16px] font-light text-white/85 tracking-wide">
                  {formatEntryDate(diary.entry_date)}
                </h2>
              </div>
            </div>

            {/* 내용 카드 */}
            <div
              className="rounded-3xl overflow-hidden"
              style={{
                background: 'linear-gradient(155deg, rgba(14,22,58,0.9) 0%, rgba(7,11,32,0.95) 100%)',
                boxShadow: '0 0 0 1px rgba(90,130,255,0.1), 0 16px 40px rgba(0,0,20,0.5)',
              }}
            >
              {/* 상단 shimmer */}
              <div className="h-px" style={{
                background: `linear-gradient(90deg, transparent, ${polarity.color}60 50%, transparent)`
              }} />

              <div className="px-5 py-5">
                <p className="text-[14px] leading-[1.85] whitespace-pre-wrap break-all text-white/75 font-light">
                  {diary.content}
                </p>

                {diary.tags && diary.tags.length > 0 && (
                  <div className="mt-5 pt-4 flex flex-wrap gap-1.5"
                    style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                    {diary.tags.map((t) => (
                      <span
                        key={t.tag_id}
                        className="text-[11px] px-2.5 py-1 rounded-full text-white/45"
                        style={{
                          background: 'rgba(255,255,255,0.05)',
                          border: '1px solid rgba(255,255,255,0.08)',
                        }}
                      >
                        #{t.tag_name}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* 수정 버튼 */}
            <button
              onClick={() => router.push(`/diary/editor?diaryId=${diary.diary_id}`)}
              className="w-full h-12 rounded-2xl text-[14px] font-medium text-white/70 transition-all active:scale-[0.98]"
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(120,160,255,0.2)',
              }}
            >
              수정하기
            </button>
          </div>
        )}
      </section>
    </main>
  );
}
