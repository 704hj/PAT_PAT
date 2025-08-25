"use client";

import useSending from "@/app/hooks/useSending";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

type Ritual = "wind" | "wave" | "star";

// const SFX: Record<Ritual, string> = {
//   wind: "/sounds/wind.mp3",
//   wave: "/sounds/wave.mp3",
//   star: "/sounds/star.mp3",
// };

export default function ReleaseSending() {
  const router = useRouter();

  const { kind, line } = useSending();

  // ---- 오디오 ----
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [soundOn, setSoundOn] = useState(false);
  const [blocked, setBlocked] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => router.replace("/lumi/home"), 2500);
    return () => clearTimeout(t);
  }, [router]);

  // useEffect(() => {
  //   const audio = new Audio(SFX[kind]);
  //   audioRef.current = audio;
  //   audio.preload = "auto";
  //   audio.volume = 0.7;
  //   audio.muted = true;
  //   audio.play().catch(() => setBlocked(true));
  //   return () => {
  //     try {
  //       audio.pause();
  //     } catch {}
  //     audioRef.current = null;
  //   };
  // }, [kind]);

  const handleEnableSound = async () => {
    const a = audioRef.current;
    if (!a) return;
    try {
      a.currentTime = 0;
      a.muted = false;
      await a.play();
      setSoundOn(true);
      setBlocked(false);
    } catch {
      setBlocked(true);
    }
  };

  const Title = useMemo(
    () =>
      kind === "wind"
        ? "바람에 띄우는 중"
        : kind === "wave"
        ? "물결에 흘려보내는 중"
        : "별에 맡기는 중",
    [kind]
  );

  return (
    <main className="relative min-h-[100svh] overflow-hidden">
      {/* 배경 */}
      <div
        aria-hidden
        className="absolute inset-0 -z-20 bg-[radial-gradient(100%_70%_at_50%_100%,#0b1d4a_0%,#091430_48%,#070f24_100%)]"
      />
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_center,transparent_60%,rgba(0,0,0,0.28))]"
      />

      {/* 상단 타이틀(가시) */}
      <h2
        className="absolute left-1/2 -translate-x-1/2 z-20 top-[8%] px-3 py-1.5 rounded-full
                     text-white/90 text-[13px] font-medium tracking-[-0.01em]
                     bg-white/8 border border-white/12 backdrop-blur"
      >
        {Title}
      </h2>

      {/* 센터 스테이지 */}
      <section className="absolute inset-0 flex items-center justify-center">
        <div className="relative w-[240px] h-[240px]">
          {/* 후광 */}
          <span
            aria-hidden
            className="absolute inset-0 rounded-full bg-[radial-gradient(circle,rgba(79,140,255,0.16),transparent_60%)] blur-md"
          />

          {/* 텍스트 카드 (텍스트가 잉크 디졸브로 사라짐) */}
          <div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
                       w-[200px] min-h-[96px] rounded-[12px]
                       bg-white/8 border border-white/14 backdrop-blur-[2px]
                       shadow-[0_6px_16px_rgba(10,18,38,0.32)] overflow-hidden"
          >
            <div className="h-[6px] bg-white/6" />
            <div className="relative z-10 p-3">
              <p className="ink-dissolve text-[14px] leading-snug text-white/90 line-clamp-3 break-keep">
                {line}
              </p>
            </div>
          </div>

          {/* 의식별 배경 파티클 */}
          {kind === "wind" && <WindSend />}
          {kind === "wave" && <WaveSend />}
          {kind === "star" && <StarSend />}
        </div>
      </section>

      {/* 사운드 토글 */}
      <button
        onClick={handleEnableSound}
        className={[
          "absolute left-1/2 -translate-x-1/2 px-3 h-8 rounded-full text-[12px] font-medium",
          "text-white/85 bg-white/6 border border-white/12 backdrop-blur",
          "hover:bg-white/10 transition",
          soundOn ? "opacity-0 pointer-events-none" : "opacity-100",
        ].join(" ")}
        style={{ bottom: "max(14px, env(safe-area-inset-bottom))" }}
        aria-live="polite"
      >
        {blocked ? "탭해서 사운드 켜기" : "사운드 켜기"}
      </button>

      {/* SR 전용(접근성) */}
      <p className="sr-only">{Title}</p>
    </main>
  );
}

/* ===== 배경 파티클 ===== */
function WindSend() {
  return (
    <>
      <i className="wind-dot" style={{ left: "18%", top: "62%" }} />
      <i className="wind-dot wind-d2" style={{ left: "58%", top: "66%" }} />
      <i className="wind-dot wind-d3" style={{ left: "42%", top: "70%" }} />
    </>
  );
}
function WaveSend() {
  return (
    <>
      <div className="wave-line" />
      <div className="wave-line wave-d2" />
    </>
  );
}
function StarSend() {
  return (
    <>
      <i className="star-dot" style={{ left: "38%", top: "64%" }} />
      <i className="star-dot star-d2" style={{ left: "60%", top: "60%" }} />
      <i className="star-dot star-d3" style={{ left: "48%", top: "68%" }} />
    </>
  );
}
