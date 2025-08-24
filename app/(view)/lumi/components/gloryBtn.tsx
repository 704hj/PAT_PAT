export default function GloryBtn({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className="
    group relative w-full h-14 rounded-[12px]
    text-[16px] font-semibold tracking-[-0.01em] text-white
    bg-[linear-gradient(180deg,#18326f_0%,#0b1d4a_100%)]
    border border-white/14
    shadow-[0_6px_16px_rgba(10,18,38,0.32)]
    overflow-hidden transition
    hover:brightness-[1.03] hover:scale-[1.005]
    active:translate-y-[1px]
    focus:outline-none focus-visible:ring-2 focus-visible:ring-white/28
  "
    >
      <span className="relative z-10 inline-flex items-center justify-center gap-2 translate-y-[0.5px]">
        <span>{label}</span>
      </span>

      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 -translate-x-full
               bg-[linear-gradient(120deg,transparent,rgba(255,255,255,0.20),transparent)]
               animate-[shimmer_4.8s_linear_infinite]"
      />

      <span aria-hidden className="pointer-events-none absolute inset-0">
        <span className="absolute left-[26%] top-[42%] w-[3px] h-[3px] rounded-full bg-white/75 opacity-0 animate-[twinkle_3.2s_ease-in-out_infinite]" />
        <span className="absolute left-[68%] top-[58%] w-[4px] h-[4px] rounded-full bg-white/70 opacity-0 animate-[twinkle_3.6s_ease-in-out_infinite_700ms]" />
      </span>
    </button>
  );
}
