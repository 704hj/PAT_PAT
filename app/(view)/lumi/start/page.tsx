"use client";

import { useRouter } from "next/navigation";
import MinimalIntro from "./miniIntro";

const CAT_SRC = "/images/icon/3d.png"; // ← 루미 캐릭터(지금 올린 3D)

export default function Onboarding() {
  const router = useRouter();

  return (
    <div className="relative min-h-[100svh] overflow-hidden">
      <div
        aria-hidden
        className="absolute inset-0 -z-10
             bg-[radial-gradient(circle_at_center,transparent_66%,rgba(9,20,48,0.34))]" // 검정보다 네이비톤
      />

      {/* 9:16 안전영역 */}
      <section className="relative mx-auto w-full max-w-[480px] aspect-[9/16]">
        <div className="absolute top-[10%] left-1/2 -translate-x-1/2 w-[88%] max-w-[360px]">
          <MinimalIntro
            title={"오늘의 감정, 별빛에 담아요"}
            messages={[
              "오늘 하루, 감정을 남겨보세요.",
              "좋은 건 기록하고, 힘든 건 흘려보내요.",
              "루미가 곁에서 함께할게요.",
            ]}
          />
        </div>
        {/* 중단: 루미 + 발 그림자 + 후광 */}
        <div className="absolute top-[34%] left-1/2 -translate-x-1/2">
          {" "}
          {/* 31% → 34% */}
          <div className="relative">
            {/* 후광: 골드 → 청록 계열, 강도 낮춤 */}
            <span
              aria-hidden
              className="absolute -top-5 left-1/2 -translate-x-1/2 w-56 h-56 rounded-full
             bg-[radial-gradient(circle,rgba(79,140,255,0.14),transparent_60%)] blur-md"
            />

            {/* 발 그림자 */}
            <span
              aria-hidden
              className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 w-28 h-[10px] rounded-full
                 bg-black/35 blur-[10px]"
            />
            <img
              src={CAT_SRC}
              alt="루미"
              className="relative mx-auto w-[240px] h-auto motion-safe:animate-[float_4s_ease-in-out_infinite]"
            />
          </div>
        </div>

        {/* 하단: 액션 2단 */}
        <div
          className="absolute left-1/2 -translate-x-1/2 w-[86%] max-w-[360px]"
          style={{ bottom: "max(20px, env(safe-area-inset-bottom))" }}
        >
          <button
            onClick={() => router.replace("/lumi/home")}
            aria-label="지금 시작하기"
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
            {/* 콘텐츠 */}
            <span className="relative z-10 inline-flex items-center justify-center gap-2 translate-y-[0.5px]">
              <span>지금 시작하기</span>
            </span>

            {/* 1) 매우 은은한 대각 Shimmer 라인 */}
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0 -translate-x-full
               bg-[linear-gradient(120deg,transparent,rgba(255,255,255,0.20),transparent)]
               animate-[shimmer_4.8s_linear_infinite]"
            />

            {/* 2) 드문 별빛 펄스 2개 (랜덤처럼 보이는 타이밍) */}
            <span aria-hidden className="pointer-events-none absolute inset-0">
              <span className="absolute left-[26%] top-[42%] w-[3px] h-[3px] rounded-full bg-white/75 opacity-0 animate-[twinkle_3.2s_ease-in-out_infinite]" />
              <span className="absolute left-[68%] top-[58%] w-[4px] h-[4px] rounded-full bg-white/70 opacity-0 animate-[twinkle_3.6s_ease-in-out_infinite_700ms]" />
            </span>
          </button>
        </div>
      </section>
    </div>
  );
}
