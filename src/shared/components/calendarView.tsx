"use client";

import React, { useMemo, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

function fmtKR(d: Date) {
  return d.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function CalendarView({
  onSelectDate,
  value: externalValue,
}: {
  onSelectDate: (date: Date) => void;
  value?: Date; // ✅ 부모가 현재 선택 날짜를 내려줄 수 있게 (선택)
}) {
  const [value, setValue] = useState<Value>(externalValue ?? new Date());
  const [isOpen, setIsOpen] = useState(false);

  const selectedDate = useMemo(() => {
    const v = Array.isArray(value) ? value[0] : value;
    return (v ?? new Date()) as Date;
  }, [value]);

  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);

  const handleChange = (next: any) => {
    setValue(next);
    const d = Array.isArray(next) ? next[0] : next;
    if (d instanceof Date && !Number.isNaN(d.getTime())) {
      onSelectDate(d);
    }
    close();
  };

  return (
    <div>
      {/* 트리거 row */}
      <button
        type="button"
        onClick={open}
        className="w-full flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3 hover:bg-white/7 transition"
      >
        <div className="flex flex-col items-start gap-1">
          <span className="text-[13px] text-white/80 font-semibold">
            날짜 선택
          </span>
          <span className="text-[12px] text-white/55">
            {fmtKR(selectedDate)}
          </span>
        </div>

        <span className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-[12px] bg-white/6 border border-white/10 text-white/75">
          캘린더
          <span aria-hidden className="text-white/55">
            ▾
          </span>
        </span>
      </button>

      {/* 바텀시트 */}
      {isOpen && (
        <div className="fixed inset-0 z-50">
          {/* backdrop */}
          <div
            className="absolute inset-0 bg-black/55 backdrop-blur-[2px]"
            onClick={close}
          />

          {/* sheet */}
          <div className="absolute left-1/2 -translate-x-1/2 bottom-0 w-full max-w-[420px] px-4 pb-5">
            <div className="rounded-3xl border border-white/10 bg-[#0a1330]/80 backdrop-blur-xl shadow-[0_30px_90px_rgba(0,0,0,0.45)] overflow-hidden">
              {/* header */}
              <div className="px-4 pt-4 pb-3 flex items-center justify-between border-b border-white/8">
                <div className="flex flex-col">
                  <div className="text-[15px] font-semibold text-white/90">
                    날짜 선택
                  </div>
                  <div className="text-[12px] text-white/55">
                    별을 밝힐 날을 골라요
                  </div>
                </div>

                <button
                  type="button"
                  onClick={close}
                  className="h-9 w-9 rounded-xl bg-white/5 border border-white/10 hover:bg-white/8 transition text-white/80"
                  aria-label="닫기"
                >
                  ✕
                </button>
              </div>

              <div className="p-3">
                <Calendar
                  onChange={handleChange}
                  value={value}
                  calendarType="gregory"
                  minDetail="year"
                  prev2Label={null}
                  next2Label={null}
                  showNeighboringMonth={false}
                  className="pp-calendar"
                  tileClassName={({ date }) => {
                    // 오늘/선택 느낌은 css에서 처리
                    return "pp-tile";
                  }}
                />
              </div>

              {/* footer */}
              <div className="px-4 pb-4 pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => handleChange(new Date())}
                  className="flex-1 h-11 rounded-2xl bg-white/5 border border-white/10 text-white/80 hover:bg-white/8 transition"
                >
                  오늘
                </button>
                <button
                  type="button"
                  onClick={close}
                  className="flex-1 h-11 rounded-2xl bg-white/10 border border-white/12 text-white/90 hover:bg-white/14 transition"
                >
                  닫기
                </button>
              </div>
            </div>

            {/* iOS safe area */}
            <div className="h-[env(safe-area-inset-bottom)]" />
          </div>
        </div>
      )}
    </div>
  );
}
