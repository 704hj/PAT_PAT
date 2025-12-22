import LockOverlay from "./lockOverlay";

export default function RitualCard({
  active,
  onClick,
  label,
  icon,
  preview,
  locked = false,
  unlocked = false, // 새로 추가
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  icon?: React.ReactNode;
  preview?: React.ReactNode;
  locked?: boolean;
  unlocked?: boolean; // 잠금 해제 상태
}) {
  return (
    <button
      type="button"
      onClick={!locked ? onClick : undefined}
      aria-pressed={active}
      aria-disabled={locked}
      className={[
        "group relative h-auto rounded-xl border px-3 py-4 text-left transition overflow-hidden flex items-center",
        active
          ? "bg-cyan-300/10 border-cyan-300/50"
          : "bg-white/6 border-white/12 hover:border-white/20",
        locked ? "cursor-not-allowed opacity-70" : "",
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

      {/* 프리뷰 */}
      <div
        key={active ? "preview-on" : "preview-off"}
        className="absolute inset-0 pointer-events-none transition-opacity duration-200 z-0 opacity-0 group-aria-pressed:opacity-100"
        aria-hidden
      >
        {preview}
      </div>

      {/* 🔒 잠금 오버레이 */}
      {locked && <LockOverlay unlocked={unlocked} />}
    </button>
  );
}
