"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { JournalCard } from "./components/journalCard";
import { ViewToggle } from "./components/viewToggle";
import { MonthPicker } from "./components/monthPicker";
import { CalendarView } from "./components/calendarView";
import { DateHeader } from "./components/dateHeader";

type ViewMode = "list" | "calendar";

export default function JournalArchivePage() {
  /* ---------------- 상태 ---------------- */
  const [view, setView] = useState<ViewMode>("list");
  const [month, setMonth] = useState(getCurrentMonth());
  const [q, setQ] = useState("");
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  /* ---------------- 데이터 (더미) ---------------- */
  const journals: Journal[] = useMemo(
    () => [
      {
        id: "1",
        date: "2025-09-12",
        time: "21:40",
        text: "오늘은 생각보다 조용한 하루였다.",
        tags: ["하루"],
      },
      {
        id: "2",
        date: "2025-09-10",
        time: "22:10",
        text: "회의가 길었지만 정리는 잘 끝났다.",
        tags: ["일"],
      },
    ],
    []
  );

  /* ---------------- 필터링 ---------------- */
  const filtered = useMemo(() => {
    const byMonth = journals.filter((j) => j.date.startsWith(month));
    const byQ = q.trim()
      ? byMonth.filter((j) =>
          `${j.text} ${(j.tags ?? []).join(" ")}`
            .toLowerCase()
            .includes(q.toLowerCase())
        )
      : byMonth;

    return byQ.sort((a, b) =>
      b.date === a.date
        ? b.time.localeCompare(a.time)
        : b.date.localeCompare(a.date)
    );
  }, [journals, month, q]);

  /* ---------------- 날짜 그룹 ---------------- */
  const grouped = useMemo(() => {
    const map: Record<string, Journal[]> = {};
    for (const j of filtered) (map[j.date] ||= []).push(j);
    return Object.entries(map).sort((a, b) => b[0].localeCompare(a[0]));
  }, [filtered]);

  return (
    <main className="min-h-[100svh] bg-[#050b1c] text-white">
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
          <MonthPicker value={month} onChange={setMonth} />
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
              {grouped.length === 0 && <EmptyState />}
              {grouped.map(([date, items]) => (
                <section key={date} className="mb-6">
                  <DateHeader date={date} />
                  <ul className="mt-2 space-y-2">
                    {items.map((j) => (
                      <JournalCard key={j.id} journal={j} />
                    ))}
                  </ul>
                </section>
              ))}
            </>
          )}

          {view === "calendar" && (
            <CalendarView
              month={month}
              journals={journals}
              selectedDate={selectedDate}
              onSelectDate={setSelectedDate}
            />
          )}
        </div>
      </section>
    </main>
  );
}

/* utils */
function getCurrentMonth() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
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
