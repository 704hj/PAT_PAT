"use client";

import { useMemo } from "react";
import { JournalCard } from "./journalCard";

type Props = {
  month: string; // YYYY-MM
  journals: Journal[];
  selectedDate: string | null;
  onSelectDate: (date: string) => void;
};

export function CalendarView({
  month,
  journals,
  selectedDate,
  onSelectDate,
}: Props) {
  const [year, m] = month.split("-").map(Number);

  const daysInMonth = new Date(year, m, 0).getDate();
  const startDay = new Date(year, m - 1, 1).getDay(); // 0~6

  const journalMap = useMemo(() => {
    const map: Record<string, Journal[]> = {};
    journals.forEach((j) => {
      if (j.date.startsWith(month)) {
        (map[j.date] ||= []).push(j);
      }
    });
    return map;
  }, [journals, month]);

  const days: (string | null)[] = [];
  for (let i = 0; i < startDay; i++) days.push(null);
  for (let d = 1; d <= daysInMonth; d++) {
    const day = `${year}-${String(m).padStart(2, "0")}-${String(d).padStart(
      2,
      "0"
    )}`;
    days.push(day);
  }

  return (
    <div className="space-y-6">
      {/* 캘린더 */}
      <div className="grid grid-cols-7 gap-1 text-center">
        {["일", "월", "화", "수", "목", "금", "토"].map((d) => (
          <div key={d} className="text-[11px] text-white/45 py-1">
            {d}
          </div>
        ))}

        {days.map((day, idx) => {
          if (!day) return <div key={idx} className="h-10" />;

          const hasEntry = !!journalMap[day];
          const selected = selectedDate === day;

          return (
            <button
              key={day}
              onClick={() => onSelectDate(day)}
              className={[
                "h-10 rounded-lg relative text-[13px]",
                selected
                  ? "bg-white/15 text-white"
                  : "text-white/75 hover:bg-white/8",
              ].join(" ")}
            >
              {Number(day.slice(-2))}

              {hasEntry && (
                <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-white/70" />
              )}
            </button>
          );
        })}
      </div>

      {/* 선택한 날짜의 기록 */}
      {selectedDate && (
        <div>
          <h3 className="text-[14px] font-semibold text-white mb-2">
            {formatDate(selectedDate)}
          </h3>

          <div className="space-y-2">
            {(journalMap[selectedDate] ?? []).map((j) => (
              <JournalCard key={j.id} journal={j} />
            ))}

            {(journalMap[selectedDate]?.length ?? 0) === 0 && (
              <p className="text-[12px] text-white/50">
                이 날에는 기록이 없어요.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* utils */
function formatDate(date: string) {
  const d = new Date(date);
  return `${d.getMonth() + 1}월 ${d.getDate()}일 (${
    ["일", "월", "화", "수", "목", "금", "토"][d.getDay()]
  })`;
}
