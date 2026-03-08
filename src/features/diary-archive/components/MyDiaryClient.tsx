'use client';

import { CalendarView } from '@/features/diary-archive/components/calendarView';
import { DateHeader } from '@/features/diary-archive/components/dateHeader';
import { JournalCard } from '@/features/diary-archive/components/journalCard';
import { MonthPicker } from '@/features/diary-archive/components/monthPicker';
import { ViewToggle } from '@/features/diary-archive/components/viewToggle';
import ErrorModal from '@/features/common/ErrorModal';
import { useDiaryList } from '@/features/diary/hooks/useDiaryList';
import { useRouter } from 'next/navigation';
import { DiaryCollectionPageSkeleton } from './skeleton/skeleton';

export default function MyDiaryClient() {
  const router = useRouter();
  const {
    // state
    selectedDate,
    setSelectedDate,
    selectedMonth,
    setSelectedMonth,

    // month
    diaryMonthData,
    diaryMonthLoading,

    q,
    setQ,
    view,
    setView,
    isError,
    error,
  } = useDiaryList();

  const items = diaryMonthData?.items ?? [];
  const isEmpty = !diaryMonthLoading && items.length === 0;
  return (
    <main className="min-h-[100svh]  text-white">
      <section className="mx-auto max-w-[480px] px-5 pb-24">
        {/* 헤더 */}
        <header className="pt-6 pb-4 flex items-center justify-between">
          <h1 className="text-[20px] font-semibold">기록</h1>
          {/* <Link href="/stats" className="text-[13px] text-white/70 underline">
            통계
          </Link> */}
        </header>
        {/* 보기 전환 */}
        <ViewToggle value={view} onChange={setView} />
        {/* 컨트롤 */}
        <div className="mt-3 space-y-2">
          <MonthPicker value={selectedMonth} onChange={setSelectedMonth} />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="기록 검색"
            className="w-full h-10 rounded-xl bg-white/5 border border-white/10 px-3 text-[13px]"
          />
        </div>
        <div className="mt-5">
          {diaryMonthLoading ? (
            <DiaryCollectionPageSkeleton view={view} />
          ) : (
            <>
              {view === 'list' && (
                <>
                  {isEmpty && <EmptyState />}
                  {items.map((diary) => (
                    <section key={diary.diary_id} className="mb-6">
                      <DateHeader date={diary.entry_date} />
                      <ul className="mt-2">
                        <JournalCard diary={diary} />
                      </ul>
                    </section>
                  ))}
                </>
              )}

              {view === 'calendar' && (
                <CalendarView
                  month={selectedMonth}
                  diaryList={items}
                  selectedDate={selectedDate}
                  onSelectDate={setSelectedDate}
                />
              )}
            </>
          )}
        </div>
      </section>
      <ErrorModal
        open={isError}
        title="기록을 불러오지 못했어요"
        description={error?.message ?? '잠시 후 다시 시도해 주세요.'}
        onClose={() => router.push('/diary-archive')}
      />
    </main>
  );
}

function EmptyState() {
  return (
    <div className="rounded-2xl border border-dashed border-white/12 bg-white/4 px-5 py-10 text-center">
      <p className="text-[14px] text-white/85">아직 남겨진 기록이 없어요.</p>
      <p className="mt-1 text-[12.5px] text-white/55">
        오늘을 정리하면 이곳에 기록이 쌓여요.
      </p>
    </div>
  );
}
