import { useEffect } from "react";

export default function RitualCard({
  active,
  onClick,
  label,
  desc,
  icon,
  preview,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  desc: string;
  icon?: React.ReactNode;
  preview: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={[
        "group relative h-auto rounded-xl border px-3 py-4 text-left transition overflow-hidden flex items-center",
        active
          ? "bg-cyan-300/10 border-cyan-300/50"
          : "bg-white/6 border-white/12 hover:border-white/20",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-white/28",
      ].join(" ")}
    >
      <div className="relative z-10 flex items-center gap-2 w-full justify-center">
        {icon && (
          <span className="shrink-0 h-9 w-9 inline-flex items-center justify-center rounded-lg bg-white/8 border border-white/10">
            {icon}
          </span>
        )}
        <div className="flex flex-col justify-center items-center min-w-0">
          <div className="text-white text-[12px] font-medium truncate text-center">
            {label}
          </div>
        </div>
      </div>

      {/* 프리뷰 레이어 */}
      <div
        key={active ? "preview-on" : "preview-off"} // 리마운트로 애니메이션 재시작
        className={[
          "absolute inset-0 pointer-events-none transition-opacity duration-200 z-0",
          // hover 대신 aria-pressed 상태로 제어 (모바일 대응)
          "opacity-0 group-aria-pressed:opacity-100",
        ].join(" ")}
        aria-hidden
      >
        {preview}
      </div>
    </button>
  );
}
