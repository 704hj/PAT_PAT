"use client";

import { useRouter } from "next/navigation";
import MinimalIntro from "./miniIntro";

const CAT_SRC = "/images/icon/3d.png";

export default function Onboarding() {
  const router = useRouter();

  return (
    <main className="relative min-h-[100svh] overflow-hidden">
      {/* 배경 그라데이션(네이비) */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_center,transparent_66%,rgba(9,20,48,0.34))]"
      />

      {/* 9:16 세이프 */}
      <section className="relative mx-auto w-full max-w-[480px] aspect-[9/16]">
        {/* 상단 인트로 */}
        <div className="absolute top-[10%] left-1/2 -translate-x-1/2 w-[88%] max-w-[360px]">
          <MinimalIntro
            title="오늘의 감정, 별빛에 담아요"
            messages={[
              "오늘 하루, 감정을 남겨보세요.",
              "좋은 건 기록하고, 힘든 건 흘려보내요.",
              "가볍게 시작해도 괜찮아요.",
            ]}
          />
        </div>

        {/* 캐릭터 영역 */}
        <div className="absolute top-[25%] left-1/2 -translate-x-1/2">
          <div className="relative">
            <span
              aria-hidden
              className="absolute -top-5 left-1/2 -translate-x-1/2 w-56 h-56 rounded-full
                         bg-[radial-gradient(circle,rgba(79,140,255,0.14),transparent_60%)] blur-md"
            />
            <span
              aria-hidden
              className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 w-28 h-[10px] rounded-full
                         bg-black/35 blur-[10px]"
            />
            <img
              src={CAT_SRC}
              alt="루미(감정 정리 동반자)"
              className="relative mx-auto w-[240px] h-auto
             motion-safe:animate-[float_4s_ease-in-out_infinite]
             motion-reduce:animate-none"
            />
          </div>
        </div>

        {/* 하단 글래스 시트 */}
        <div
          className="absolute left-1/2 -translate-x-1/2 w-[92%] max-w-[420px]"
          style={{
            bottom: "max(12px, calc(env(safe-area-inset-bottom) + 10px))",
          }}
        >
          <div
            className="
      rounded-[18px] border border-white/12 bg-white/7 backdrop-blur-[8px]
      shadow-[0_12px_36px_rgba(7,17,40,0.35)]
      px-4 pt-3 pb-3
      /* 핵심: 시트 자체의 최대 높이와 내부 스크롤 허용 */
      max-h-[38vh] overflow-auto
    "
          >
            {/* 버튼들 */}
            <div className="mt-4 grid gap-2">
              <button
                onClick={() => router.replace("/lumi/home")}
                className="h-12 rounded-[12px] text-[15px] font-medium
                   text-white/92 bg-white/8 border border-white/12
                   hover:bg-white/12 transition"
              >
                게스트로 계속하기
              </button>

              <button
                onClick={() => router.push("/lumi/auth/signup")}
                className="group relative h-12 rounded-[12px] text-[15px] font-semibold text-white
                   bg-[linear-gradient(180deg,#18326f_0%,#0b1d4a_100%)] border border-white/14
                   shadow-[0_6px_16px_rgba(10,18,38,0.32)] overflow-hidden
                   hover:brightness-[1.03] active:translate-y-[1px]
                   focus:outline-none focus-visible:ring-2 focus-visible:ring-white/28"
              >
                <span className="relative z-10 inline-flex items-center justify-center gap-2">
                  별빛 계정 만들기
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    className="opacity-90"
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
                  className="pointer-events-none absolute inset-0 -translate-x-full
                     bg-[linear-gradient(120deg,transparent,rgba(255,255,255,0.16),transparent)]
                     animate-[shimmer_5.2s_linear_infinite]"
                />
              </button>
            </div>

            <div className="mt-3 text-center">
              <button
                onClick={() => router.push("/lumi/auth/signin")}
                className="text-white/80 text-[13px] underline underline-offset-4 hover:text-white transition"
              >
                이미 계정이 있나요? 로그인
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
