"use client";

type Props = {
  value: string; // YYYY-MM
  onChange: (next: string) => void;
};

export function MonthPicker({ value, onChange }: Props) {
  const [year, month] = value.split("-").map(Number);

  const moveMonth = (delta: number) => {
    const d = new Date(year, month - 1 + delta);
    const next = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
      2,
      "0"
    )}`;
    onChange(next);
  };

  return (
    <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-3 h-10">
      <button
        onClick={() => moveMonth(-1)}
        className="text-white/70 hover:text-white transition"
        aria-label="이전 달"
      >
        ‹
      </button>

      <span className="text-white/85 text-[13px] font-medium">
        {year}년 {month}월
      </span>

      <button
        onClick={() => moveMonth(1)}
        className="text-white/70 hover:text-white transition"
        aria-label="다음 달"
      >
        ›
      </button>
    </div>
  );
}
