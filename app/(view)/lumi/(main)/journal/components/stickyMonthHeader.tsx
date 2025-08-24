"use client";

export function StickyMonthHeader({
  month,
  label,
}: {
  month: string;
  label: string;
}) {
  const prettyMonth = `${month.slice(0, 4)}.${month.slice(5, 7)}`;
  return (
    <div className="sticky top-0 z-20">
      <div className="backdrop-blur bg-[rgba(6,14,30,0.35)] border-b border-   /10">
        <div className="px-5 h-9 flex items-center justify-between">
          <span className="text-white/85 text-[13px]">{prettyMonth}</span>
          <span className="text-white/60 text-[12px]">{label}</span>
        </div>
      </div>
    </div>
  );
}
