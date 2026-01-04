"use client";

type ViewMode = "list" | "calendar";

type Props = {
  value: ViewMode;
  onChange: (v: ViewMode) => void;
};

export function ViewToggle({ value, onChange }: Props) {
  return (
    <div className="grid grid-cols-2 rounded-xl border border-white/10 bg-white/5 p-1">
      {[
        { key: "list", label: "리스트" },
        { key: "calendar", label: "캘린더" },
      ].map((item) => {
        const active = value === item.key;
        return (
          <button
            key={item.key}
            onClick={() => onChange(item.key as ViewMode)}
            className={[
              "h-8 rounded-lg text-[13px] transition",
              active
                ? "bg-white/15 text-white"
                : "text-white/60 hover:text-white/85",
            ].join(" ")}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}
