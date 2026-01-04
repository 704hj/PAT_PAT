"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { JournalCard } from "./components/journalCard";
import { ViewToggle } from "./components/viewToggle";
import { MonthPicker } from "./components/monthPicker";
import { CalendarView } from "./components/calendarView";
import { DateHeader } from "./components/dateHeader";
import { useDiaryList } from "@/app/hooks/diary/useDiaryList";

type ViewMode = "list" | "calendar";

export default function JournalArchivePage() {
  const {
    // state
    selectedDate,
    setSelectedDate,
    selectedMonth,
    setSelectedMonth,

    // month
    diaryMonthData,
    diaryMonthLoading,
  } = useDiaryList();
  /* ---------------- 상태 ---------------- */
  const [view, setView] = useState<ViewMode>("list");
  const [q, setQ] = useState("");

  return (
    <main className="min-h-[100svh]  text-white">
      <section className="mx-auto max-w-[480px] px-5 pb-24">
        {/* 헤더 */}
        <header className="pt-6 pb-4 flex items-center justify-between">
          <h1 className="text-[20px] font-semibold">기록</h1>
          <Link
            href="/lumi/stats"
            className="text-[13px] text-white/70 underline"
          >
            통계
          </Link>
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

        {/* 콘텐츠 */}
        <div className="mt-5">
          {view === "list" && (
            <>
              {(diaryMonthData?.data?.items ?? [])?.length === 0 && (
                <EmptyState />
              )}
              {(diaryMonthData?.data?.items ?? [])?.map((diary: TDiaryItem) => (
                <section key={diary.diary_id} className="mb-6">
                  <DateHeader date={diary.entry_date} />
                  <ul className="mt-2 space-y-2">
                    <JournalCard key={diary.diary_id} diary={diary} />
                  </ul>
                </section>
              ))}
            </>
          )}

          {view === "calendar" && (
            <CalendarView
              month={selectedMonth}
              diaryList={diaryMonthData?.data?.items ?? []}
              selectedDate={selectedDate}
              onSelectDate={setSelectedDate}
            />
          )}
        </div>
      </section>
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
