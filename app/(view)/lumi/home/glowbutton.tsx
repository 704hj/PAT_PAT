type BtnProps = {
  label: string;
  icon: string;
  onClick: () => void;
  variant?: "glass" | "milkyway";
  ariaLabel?: string;
};

export default function GlowButton({
  label,
  icon,
  onClick,
  variant = "glass",
  ariaLabel,
}: BtnProps) {
  const base =
    "relative group flex items-center justify-center gap-3 w-[280px] h-12 " +
    "rounded-2xl text-[15px] font-semibold overflow-hidden select-none " +
    "transition-transform duration-150 active:scale-[0.98]";

  const focus =
    "focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 " +
    "focus-visible:ring-indigo-300/70 focus-visible:ring-offset-transparent";

  //   const glass =
  //     "text-slate-100 bg-[#0a1330]/65 backdrop-blur border border-white/10 " +
  //     "shadow-[0_10px_30px_rgba(3,8,35,0.55)] hover:shadow-[0_14px_40px_rgba(40,70,255,0.35)] " +
  //     "hover:border-indigo-300/35";

  const glass =
    "text-slate-100 bg-[#0a1330]/65 backdrop-blur border border-white/10 " +
    "shadow-[0_10px_30px_rgba(3,8,35,0.55)] " +
    "hover:shadow-[0_18px_45px_rgba(0,200,255,0.35)] " +
    "hover:border-cyan-300/40 relative overflow-hidden";

  const milkyway =
    "text-white bg-gradient-to-r from-[#0f172a] via-[#4338ca] via-[#6d28d9] via-[#38bdf8] to-[#f0f9ff] " +
    "shadow-[0_12px_32px_rgba(56,189,248,0.45)] hover:opacity-[0.93]";

  return (
    <button
      onClick={onClick}
      className={[base, focus, variant === "glass" ? glass : milkyway].join(
        " "
      )}
      aria-label={ariaLabel ?? label}
    >
      {/* 공통: 은하수/별빛 레이어 */}
      {variant === "glass" ? (
        <>
          {/* 블랙홀 흡수 애니메이션 */}
          {/* <span
            aria-hidden
            className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 
               bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.6),transparent_70%)] 
               scale-75 group-hover:scale-100 transition-all duration-500 ease-out"
          /> */}

          {/* 별빛 흩어짐 */}
          {/* <span
            aria-hidden
            className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(255,255,255,0.25),transparent_40%),radial-gradient(circle_at_70%_60%,rgba(255,255,255,0.15),transparent_50%)] 
               motion-safe:animate-pulse blur-[1px]"
          /> */}
        </>
      ) : (
        <>
          {/* 은하수 흐름 하이라이트 */}
          {/* <span
            aria-hidden
            className="absolute inset-0 opacity-60
                       bg-[radial-gradient(120px_60px_at_15%_20%,rgba(255,255,255,0.25),transparent_60%),
                           radial-gradient(140px_80px_at_85%_80%,rgba(255,255,255,0.18),transparent_65%)]"
          /> */}
          {/* 유성 스윕 */}
          {/* <span
            aria-hidden
            className="absolute -left-1/3 top-0 h-full w-1/3 rotate-12
                       bg-gradient-to-r from-white/0 via-white/35 to-white/0
                       blur-[6px] motion-safe:animate-[sweep_2.4s_ease-in-out_infinite]"
          /> */}
        </>
      )}

      <img
        src={icon}
        alt=""
        className={
          variant === "glass"
            ? "w-5 h-5 relative z-10 filter invert-[82%] brightness-110"
            : "w-5 h-5 relative z-10"
        }
      />
      <span className="relative z-10">{label}</span>
    </button>
  );
}
