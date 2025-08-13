"use client";
import React, { useEffect, useRef, useState } from "react";

type Props = {
  show: boolean; // true면 애니메이션 시작
  text?: string; // 제거 대상 텍스트
  durationMs?: number; // 전체 길이(ms)
  onFinished?: () => void;
};

export default function BlackHolePurge({
  show,
  text = "그날의 좋지 않았던 기억...",
  durationMs = 1600,
  onFinished,
}: Props) {
  const [running, setRunning] = useState(false);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (!show) return;
    setRunning(true);
    timerRef.current = window.setTimeout(() => {
      setRunning(false);
      onFinished?.();
    }, durationMs) as unknown as number;

    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, [show, durationMs, onFinished]);

  return (
    <div className="relative w-full h-[60vh] sm:h-[70vh] md:h-[80vh] overflow-hidden bg-[#0f1324] rounded-2xl flex items-center justify-center">
      {/* 회전 디스크 */}
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-60 motion-safe:animate-[spin_6s_linear_infinite]"
        style={{
          background: `
            conic-gradient(from 0deg, rgba(255,255,255,0.06), rgba(255,255,255,0) 25% 75%, rgba(255,255,255,0.06)),
            radial-gradient(circle at center, rgba(255,255,255,0.06), transparent 60%)
          `,
        }}
      />
      {/* 블랙홀 코어 */}
      <div
        aria-hidden="true"
        className="absolute rounded-full"
        style={{
          width: "26vmin",
          height: "26vmin",
          background:
            "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.06) 18%, rgba(0,0,0,0.9) 45%, rgba(0,0,0,1) 62%, rgba(0,0,0,1) 100%)",
          filter: "blur(1px)",
        }}
      />
      {/* 빨려 들어가는 카드 */}
      <div
        className="relative z-10 max-w-[80%] sm:max-w-[70%] md:max-w-[640px] rounded-xl bg-white/10 backdrop-blur text-white p-4 sm:p-6 text-sm sm:text-base leading-relaxed shadow-lg"
        style={
          running
            ? {
                animation: `suck ${durationMs}ms cubic-bezier(.2,.7,.2,1) forwards`,
              }
            : undefined
        }
      >
        {text}
      </div>
      {/* 비네트 */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at center, rgba(0,0,0,0) 55%, rgba(0,0,0,0.35) 80%, rgba(0,0,0,0.6) 100%)",
        }}
      />
      {/* keyframes */}
      {/* <style jsx>{`
        @keyframes suck {
          0% {
            transform: translate3d(0, 0, 0) scale(1) rotate(0deg);
            opacity: 1;
            filter: none;
          }
          40% {
            transform: translate3d(0, 0, 0) scale(0.9) rotate(3deg);
            filter: contrast(110%) saturate(110%);
          }
          70% {
            transform: translate3d(0, -2vmin, 0) scale(0.55) rotate(8deg);
            filter: blur(1px) brightness(1.1);
          }
          100% {
            transform: translate3d(0, 0, 0) scale(0.02) rotate(18deg);
            opacity: 0;
            filter: blur(2px) brightness(1.2);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          :global(.motion-safe\\:animate-[spin_6s_linear_infinite]) {
            animation: none !important;
          }
        }
      `}</style> */}
    </div>
  );
}
