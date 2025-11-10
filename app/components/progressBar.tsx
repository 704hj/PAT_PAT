import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function SmoothProgress() {
  const router = useRouter();

  const [p, setP] = useState(0);

  const trackRef = useRef<HTMLDivElement>(null);
  const starRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    let start = performance.now();
    const D = 6500; // 전체 주기 (4초)
    let raf = 0;

    const loop = (t: number) => {
      const elapsed = (t - start) % D;
      const u = elapsed / (D / 2); // 0~2
      const tri = u <= 1 ? u : 2 - u; // 삼각파 0→1→0
      const eased = tri * tri * (3 - 2 * tri); // ease-in-out
      setP(eased * 100);
      raf = requestAnimationFrame(loop);
    };

    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    if (p > 99) {
      router.replace("/lumi/start");
    }
  }, [p]);
  return (
    <div className="relative w-[260px]">
      {/* 트랙 */}
      <div
        ref={trackRef}
        className="relative h-0.5 rounded-full bg-white/10 overflow-visible"
      >
        {/* 채움 */}
        <span
          className="relative block h-full bg-gradient-to-r from-indigo-300/80 to-white"
          style={{
            width: `${p}%`,
            transition: "width 0.03s ease-in-out", // 자연스러운 움직임
          }}
        >
          {/* 별 */}
          <img
            ref={starRef}
            src="/images/icon/star.svg"
            alt="star"
            className="absolute -top-6 right-0 select-none pointer-events-none"
            style={{
              width: 30,
              height: 30,
              filter: "drop-shadow(0 2px 6px rgba(255,255,200,.35))",
              transform: "translateX(10px)",
            }}
          />
        </span>
      </div>
    </div>
  );
}
