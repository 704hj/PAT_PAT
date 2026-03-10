'use client';

import ErrorModal from '@/features/common/ErrorModal';
import { CalendarView } from '@/features/diary-archive/components/calendarView';
import { ConstellationView } from '@/features/diary-archive/components/ConstellationView';
import { MonthPicker } from '@/features/diary-archive/components/monthPicker';
import { ViewToggle } from '@/features/diary-archive/components/viewToggle';
import { useDiaryList } from '@/features/diary/hooks/useDiaryList';
import { useRouter } from 'next/navigation';
import { DiaryCollectionPageSkeleton } from './skeleton/skeleton';

export default function MyDiaryClient() {
  const router = useRouter();
  const {
    selectedDate,
    setSelectedDate,
    selectedMonth,
    setSelectedMonth,
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

  return (
    <main className="min-h-[100svh] text-white">
      <section className="mx-auto max-w-[480px] px-5 pb-24">
        <header className="pt-6 pb-4 flex items-center justify-between">
          <h1 className="text-[20px] font-semibold">기록</h1>
        </header>

        <ViewToggle value={view} onChange={setView} />

        {/* 캘린더 뷰일 때만 월 선택 + 검색 표시 */}
        {view === 'calendar' && (
          <div className="mt-3 space-y-2">
            <MonthPicker value={selectedMonth} onChange={setSelectedMonth} />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="기록 검색"
              className="w-full h-10 rounded-xl bg-white/5 border border-white/10 px-3 text-[13px]"
            />
          </div>
        )}

        <div className="mt-5">
          {view === 'list' && <ConstellationView />}

          {view === 'calendar' && (
            diaryMonthLoading ? (
              <DiaryCollectionPageSkeleton view={view} />
            ) : (
              <CalendarView
                month={selectedMonth}
                diaryList={items}
                selectedDate={selectedDate}
                onSelectDate={setSelectedDate}
              />
            )
          )}
        </div>
      </section>

      <ErrorModal
        open={isError && view === 'calendar'}
        title="기록을 불러오지 못했어요"
        description={error?.message ?? '잠시 후 다시 시도해 주세요.'}
        onClose={() => router.push('/diary-archive')}
      />
    </main>
  );
}
