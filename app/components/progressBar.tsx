import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

export default function SmoothProgress() {
  const router = useRouter();
  const [progress, setProgress] = useState(0);
  const rafRef = useRef<number | null>(null);

  // 더 완만한 easing
  const easeInOutSine = (t: number) => -(Math.cos(Math.PI * t) - 1) / 2;

  useEffect(() => {
    const DURATION = 5000;
    const start = performance.now();

    const loop = (now: number) => {
      const elapsed = now - start;
      const t = Math.min(elapsed / DURATION, 1);
      const eased = easeInOutSine(t);
      const percent = eased * 100;

      setProgress(percent);

      if (t < 1) {
        setTimeout(() => requestAnimationFrame(loop), 16);
      } else {
        setProgress(100); // 깔끔하게 마무리

        setTimeout(() => {
          router.replace("/lumi/start");
        }, 500);
      }
    };

    rafRef.current = requestAnimationFrame(loop);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [router]);

  return (
    <div className="relative w-[260px]">
      <div className="relative h-0.5 bg-white/10 rounded-full overflow-visible">
        <div
          className="h-full bg-gradient-to-r from-indigo-300/80 to-white transition-[width] duration-200 ease-in-out"
          style={{ width: `${progress}%` }}
        />
        <img
          src="/images/icon/star.svg"
          alt="star"
          className="absolute -top-6 select-none pointer-events-none transition-[left] duration-200 ease-in-out"
          style={{
            width: 30,
            height: 30,
            left: `${progress}%`,
            transform: "translateX(-50%)",
            filter: "drop-shadow(0 2px 6px rgba(255,255,200,.35))",
          }}
        />
      </div>
    </div>
  );
}
