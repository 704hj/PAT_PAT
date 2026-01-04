"use client";

import { useRouter } from "next/navigation";

export default function AuthLanding() {
  const router = useRouter();

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

      {/* 카드 */}
      <section className="relative mx-auto w-full max-w-[480px] aspect-[9/16] px-5">
        <header className="pt-8 text-center">
          <h1 className="text-white text-[20px] font-semibold tracking-tight">
            별빛에 남기기
          </h1>
          <p className="mt-1 text-white/70 text-[13px]">
            지금은 가볍게, 필요할 땐 계정으로
          </p>
        </header>

        <div className="mt-6 rounded-[16px] border border-white/12 bg-white/6 backdrop-blur p-5">
          <p className="text-white/85 text-[14px]">
            게스트로 시작하면 기록은 기기에만 머물러요. 계정을 만들면 밤하늘에
            오래 담아둘 수 있어요 ✨
          </p>
          <div className="mt-5 grid gap-3">
            <button
              onClick={() => router.replace("/home")}
              className="h-12 rounded-[12px] text-[15px] font-semibold text-white bg-white/8 border border-white/12 hover:bg-white/12 transition"
            >
              게스트로 계속하기
            </button>
            <button
              onClick={() => router.push("/auth/signup")}
              className="group relative h-12 rounded-[12px] text-[15px] font-semibold text-white
                         bg-[linear-gradient(180deg,#18326f_0%,#0b1d4a_100%)] border border-white/14
                         shadow-[0_6px_16px_rgba(10,18,38,0.32)] overflow-hidden
                         hover:brightness-[1.03] active:translate-y-[1px]"
            >
              별빛 계정 만들기
              <span
                aria-hidden
                className="absolute inset-0 -translate-x-full bg-[linear-gradient(120deg,transparent,rgba(255,255,255,0.20),transparent)] animate-[shimmer_4.8s_linear_infinite]"
              />
            </button>
          </div>

          <div className="mt-4 text-center">
            <button
              onClick={() => router.push("/auth/signin")}
              className="text-white/85 text-[13px] underline underline-offset-4 hover:text-white transition"
            >
              이미 계정이 있나요? 로그인
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
