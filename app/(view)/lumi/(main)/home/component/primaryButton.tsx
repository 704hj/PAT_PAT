export default function PrimaryButton({
  children,
  onClick,
  disabled,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={[
        "group relative w-full h-12 rounded-[14px] text-[15px] font-semibold text-white",
        "bg-[linear-gradient(180deg,#18326f_0%,#0b1d4a_100%)] border border-white/14",
        "shadow-[0_6px_16px_rgba(10,18,38,0.32)] overflow-hidden",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-white/28",
        disabled
          ? "opacity-50 cursor-not-allowed"
          : "hover:brightness-[1.03] active:translate-y-[1px]",
      ].join(" ")}
      aria-disabled={disabled}
    >
      <span className="relative z-10 inline-flex items-center justify-center gap-2">
        {children}
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          className="opacity-90 transition-transform group-hover:translate-x-[2px]"
          aria-hidden
        >
          <path
            d="M9 5l7 7-7 7"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </svg>
      </span>

      <span
        aria-hidden
        className="absolute inset-0 -translate-x-full
          bg-[linear-gradient(120deg,transparent,rgba(255,255,255,0.20),transparent)]
"
      />
    </button>
  );
}
