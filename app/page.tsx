"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Splash() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // 최소 노출시간 ~1.2s, 이미지/폰트 프리로드 여유 고려
    const t = setTimeout(() => {
      setMounted(true); // 페이드아웃 트리거
      // 페이드 이후 온보딩으로 이동
      setTimeout(() => router.replace("/lumi/start"), 420);
    }, 1200);
    return () => clearTimeout(t);
  }, [router]);

  return (
    <main
      className={[
        "relative min-h-[100svh] overflow-hidden",
        mounted ? "animate-splash-out" : "animate-none",
      ].join(" ")}
      aria-label="루미 스플래시"
    >
      {/* 배경: 네이비 그라데이션 + 은은한 비네트 */}
      <div
        aria-hidden
        className="absolute inset-0 -z-20 bg-[radial-gradient(100%_70%_at_50%_100%,#0b1d4a_0%,#091430_48%,#070f24_100%)]"
      />
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_center,transparent_60%,rgba(0,0,0,0.28))]"
      />

      {/* 아주 옅은 별빛 파티클 (3~4개만, 모션 최소) */}
      <div aria-hidden className="absolute inset-0 pointer-events-none">
        <span className="star" style={{ left: "18%", top: "28%" }} />
        <span className="star star-d2" style={{ left: "72%", top: "42%" }} />
        <span className="star star-d3" style={{ left: "58%", top: "70%" }} />
      </div>

      {/* 브랜드 마크 */}
      <section className="absolute inset-0 flex items-center justify-center">
        <div className="flex flex-col items-center">
          {/* 로고 아이콘 (예: 고양이/별 실루엣) */}
          <div className="relative">
            <div
              aria-hidden
              className="absolute -inset-6 rounded-full bg-[radial-gradient(circle,rgba(79,140,255,0.16),transparent_60%)] blur-md"
            />
            <img
              src="/images/icon/3d.png" // 로고형 아이콘으로 바꿔도 됨
              alt="Lumi"
              className="relative w-[96px] h-[96px] object-contain motion-safe:animate-float"
            />
          </div>

          {/* 워드마크/앱 이름 */}
          <h1 className="mt-4 text-white text-[22px] font-semibold tracking-[-0.01em]">
            Lumi
          </h1>
          <p className="mt-1 text-white/75 text-[13px]">
            오늘의 감정, 별빛에 담아요
          </p>

          {/* 진행 표시(세련된 라인 프로그레스) */}
          <div className="mt-6 h-1 w-[160px] rounded-full bg-white/10 overflow-hidden">
            <span className="block h-full w-1/3 bg-white/65 animate-loader" />
          </div>
        </div>
      </section>

      {/* 하단 작은 정보(선택): 버전/카피라이트 */}
      <footer
        className="absolute left-1/2 -translate-x-1/2 text-center text-white/45 text-[11px]"
        style={{ bottom: "max(12px, env(safe-area-inset-bottom))" }}
      >
        v0.1.0 · © Lumi
      </footer>
    </main>
  );
}
