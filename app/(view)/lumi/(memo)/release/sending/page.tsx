"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

type Ritual = "wind" | "wave" | "star" | "fire";

const SFX: Record<Ritual, string> = {
  wind: "/sounds/wind.mp3",
  wave: "/sounds/wave.mp3",
  star: "/sounds/star.mp3",
  fire: "/sounds/star.mp3",
};

export default function ReleaseSending() {
  const router = useRouter();
  const sp = useSearchParams();
  const kind = (sp.get("kind") as Ritual) || "wind";

  // ---- 오디오 관련 상태/레퍼런스 ----
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [soundOn, setSoundOn] = useState(false); // 기본 off
  const [blocked, setBlocked] = useState(false); // 브라우저 정책으로 재생 차단 여부

  // 페이지 체류 시간 (사운드는 0.6~0.9s 내 재생)
  useEffect(() => {
    const t = setTimeout(() => router.replace("/lumi/home"), 4000);
    return () => clearTimeout(t);
  }, [router]);

  // SFX 자동 시도(음소거 상태일 때 미리 play→load로 버퍼 워밍)
  useEffect(() => {
    // 오디오 엘리먼트 생성
    const audio = new Audio(SFX[kind]);
    audioRef.current = audio;
    audio.preload = "auto";
    audio.volume = 0.75; // 전체 볼륨 (0.0~1.0)
    audio.muted = true; // 기본 음소거
    audio.play().catch(() => {
      // 대부분의 브라우저에서 muted면 play 허용됨. 만약 막히면 blocked로 처리
      setBlocked(true);
    });

    return () => {
      try {
        audio.pause();
      } catch {}
      audioRef.current = null;
    };
  }, [kind]);

  // 사용자가 "사운드 켜기"를 탭하면 재생
  const handleEnableSound = async () => {
    const audio = audioRef.current;
    if (!audio) return;
    try {
      audio.currentTime = 0;
      audio.muted = false;
      await audio.play();
      setSoundOn(true);
      setBlocked(false);
    } catch {
      setBlocked(true); // 여전히 차단될 경우
    }
  };

  const Title = useMemo(() => {
    switch (kind) {
      case "wind":
        return "바람에 띄우는 중";
      case "wave":
        return "물결에 흘려보내는 중";
      case "star":
        return "별에 맡기는 중";
      default:
        return "보내는 중";
    }
  }, [kind]);

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

      {/* 센터 스테이지 */}
      <section className="absolute inset-0 flex items-center justify-center">
        <div className="relative w-[220px] h-[220px]">
          <span
            aria-hidden
            className="absolute inset-0 rounded-full bg-[radial-gradient(circle,rgba(79,140,255,0.16),transparent_60%)] blur-md"
          />
          {/* 메모 카드 */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[160px] h-[96px] rounded-[12px] bg-white/8 border border-white/14 backdrop-blur-[2px] shadow-[0_6px_16px_rgba(10,18,38,0.32)]">
            <div className="h-[60%] border-b border-white/10" />
            <div className="h-[40%] p-2 opacity-60">
              <div className="h-2 w-[70%] bg-white/30 rounded" />
              <div className="mt-2 h-2 w-[50%] bg-white/20 rounded" />
            </div>
          </div>

          {/* 의식별 애니 레이어 */}
          {kind === "wind" && <WindSend />}
          {kind === "wave" && <WaveSend />}
          {kind === "star" && <StarSend />}
          {kind === "fire" && <EmberSend />}
        </div>
      </section>

      {/* 사운드 토글 (하단, 매우 간결) */}
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

      {/* 스크린리더 텍스트 */}
      <p className="sr-only">{Title}</p>
    </main>
  );
}

/* ===== 애니 구성요소 (동일) ===== */
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

function EmberSend() {
  return (
    <>
      {/* 따뜻한 빛 퍼짐 */}
      <div
        aria-hidden
        className="absolute inset-0 rounded-full
                     bg-[radial-gradient(50%_50%_at_50%_50%,rgba(255,186,120,0.22),transparent_70%)]
                     animate-[emberGlow_1s_ease-out_forwards]"
      />
      {/* 미세 입자 2~3개 */}
      <i className="ember-dot" style={{ left: "46%", top: "62%" }} />
      <i className="ember-dot ember-d2" style={{ left: "56%", top: "66%" }} />
    </>
  );
}
