"use client";

type Props = {
  date: string; // YYYY-MM-DD
};

export function DateHeader({ date }: Props) {
  const d = new Date(date);

  const label = `${d.getMonth() + 1}.${String(d.getDate()).padStart(2, "0")} (${
    ["일", "월", "화", "수", "목", "금", "토"][d.getDay()]
  })`;

  return (
    <div
      data-date-header="1"
      data-label={label}
      className="
        flex items-center
        py-1
      "
    >
      <h3
        className="
          text-white/85
          text-[14px]
          font-semibold
          tracking-[-0.01em]
        "
      >
        {label}
      </h3>
    </div>
  );
}
