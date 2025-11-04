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
              alt="루미"
              className="relative mx-auto w-[240px] h-auto
             motion-safe:animate-[float_4s_ease-in-out_infinite]
             motion-reduce:animate-none"
            />
          </div>
        </div>

        {/* 하단 글래스 시트 */}
        {/* 하단 글래스 시트 */}
        <div
          className="absolute left-1/2 -translate-x-1/2 w-[92%] max-w-[420px]
           "
          style={{
            bottom: "max(12px, calc(env(safe-area-inset-bottom) + 60px))",
          }}
        >
          <div
            className="rounded-[18px] border border-white/12 bg-white/8 backdrop-blur-md
               shadow-[0_12px_36px_rgba(7,17,40,0.35)]
               px-6 pt-5 pb-5 text-center"
          >
            {/* 버튼 그룹 */}
            <div className="flex flex-col gap-3">
              <button
                onClick={() => router.push("/lumi/auth/signup")}
                className="relative h-12 rounded-[12px] font-semibold text-[15px] text-white
                   bg-[linear-gradient(180deg,#18326f_0%,#0b1d4a_100%)]
                   border border-white/14 shadow-[0_6px_16px_rgba(10,18,38,0.32)]
                   overflow-hidden transition-all
                   hover:brightness-105 active:translate-y-[1px]
                   focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
              >
                <span className="relative z-10 inline-flex items-center justify-center gap-2">
                  별빛 계정 만들기
                </span>
              </button>

              <button
                onClick={() => router.push("/lumi/auth/signin")}
                className="text-[13px] text-white/80 underline underline-offset-4
                   hover:text-white transition"
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
