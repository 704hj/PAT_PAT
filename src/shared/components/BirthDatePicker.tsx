'use client';

import Calendar from 'react-calendar';
import { useState } from 'react';
import 'react-calendar/dist/Calendar.css';
import './calendarVIew.css';

type Props = {
  value: string; // "YYYY-MM-DD" 또는 ""
  onChange: (value: string) => void;
  error?: string;
  placeholder?: string;
};

function fmtKR(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}.${m}.${day}`;
}

function toLocalDateString(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function parseValue(v: string): Date | null {
  if (!v || !/^\d{4}-\d{2}-\d{2}$/.test(v)) return null;
  const [y, m, d] = v.split('-').map(Number);
  const dt = new Date(y, m - 1, d);
  return Number.isNaN(dt.getTime()) ? null : dt;
}

export default function BirthDatePicker({
  value,
  onChange,
  error,
  placeholder = '생일 선택',
}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const minDate = new Date(1900, 0, 1);
  const maxDate = new Date();
  const selected = parseValue(value);

  const handleChange = (next: any) => {
    const d = Array.isArray(next) ? next[0] : next;
    if (d instanceof Date && !Number.isNaN(d.getTime())) {
      onChange(toLocalDateString(d));
      setIsOpen(false);
    }
  };

  const close = () => setIsOpen(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className={[
          'w-full flex items-center justify-between rounded-2xl border bg-white/[0.035] px-4 py-3 text-[15px] transition outline-none',
          error
            ? 'border-rose-400/75'
            : 'border-white/8 hover:bg-white/[0.06] focus:bg-white/[0.06] focus:border-sky-300/70',
          selected ? 'text-white/90' : 'text-white/35',
        ].join(' ')}
      >
        <span>{selected ? fmtKR(selected) : placeholder}</span>
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden
        >
          <rect
            x="3.5"
            y="5"
            width="17"
            height="15"
            rx="2.5"
            stroke="rgba(255,255,255,0.55)"
            strokeWidth="1.6"
          />
          <path
            d="M3.5 9.5h17"
            stroke="rgba(255,255,255,0.55)"
            strokeWidth="1.6"
          />
          <path
            d="M8 3v3M16 3v3"
            stroke="rgba(255,255,255,0.55)"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black/55 backdrop-blur-[2px]"
            onClick={close}
          />

          <div className="absolute left-1/2 -translate-x-1/2 bottom-0 w-full max-w-[420px] px-4 pb-5">
            <div className="rounded-3xl border border-white/10 bg-[#0a1330]/85 backdrop-blur-xl shadow-[0_30px_90px_rgba(0,0,0,0.45)] overflow-hidden">
              {/* header */}
              <div className="px-4 pt-4 pb-3 flex items-center justify-between border-b border-white/8">
                <div className="flex flex-col">
                  <div className="text-[15px] font-semibold text-white/90">
                    생일 선택
                  </div>
                  <div className="text-[12px] text-white/55">
                    당신의 별자리를 알아볼게요
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
                  value={selected}
                  defaultView="decade"
                  minDetail="decade"
                  maxDetail="month"
                  defaultActiveStartDate={
                    selected ?? new Date(2000, 0, 1)
                  }
                  minDate={minDate}
                  maxDate={maxDate}
                  calendarType="gregory"
                  prev2Label={null}
                  next2Label={null}
                  showNeighboringMonth={false}
                  className="pp-calendar pp-birth-calendar"
                  tileClassName="pp-tile"
                />
              </div>

              {/* footer */}
              <div className="px-4 pb-4 pt-2 flex gap-2">
                {value && (
                  <button
                    type="button"
                    onClick={() => {
                      onChange('');
                      close();
                    }}
                    className="flex-1 h-11 rounded-2xl bg-white/5 border border-white/10 text-white/70 hover:bg-white/8 transition"
                  >
                    지우기
                  </button>
                )}
                <button
                  type="button"
                  onClick={close}
                  className="flex-1 h-11 rounded-2xl bg-white/10 border border-white/12 text-white/90 hover:bg-white/14 transition"
                >
                  닫기
                </button>
              </div>
            </div>

            <div className="h-[env(safe-area-inset-bottom)]" />
          </div>
        </div>
      )}
    </>
  );
}
