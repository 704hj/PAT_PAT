"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import GlassCard from "../../(main)/home/component/glassCard";

const CATEGORIES = ["일", "관계", "건강", "금전", "자존감", "미래"] as const;
type Category = (typeof CATEGORIES)[number];

export default function ReleasePage() {
  const router = useRouter();

  // state
  const [category, setCategory] = useState<Category | null>(null);
  const [intensity, setIntensity] = useState(3);
  const [text, setText] = useState("");
  const [ritual, setRitual] = useState<
    "별에 맡기기" | "바람에 띄우기" | "물결에 흘리기"
  >("별에 맡기기");
  const limit = 180;

  const canSubmit = useMemo(() => text.trim().length > 0, [text]);

  const submit = async () => {
    if (!canSubmit) return;
    // TODO: 서버 전송/로그 (원하면 익명 저장 or 미저장 선택 넣기)
    // 부드러운 릴리즈 애니메이션 트리거
    const v = document.getElementById("release-veil");
    if (v) {
      v.classList.remove("opacity-0");
      v.classList.add("opacity-100");
    }
    setTimeout(() => {
      router.replace("/lumi/home");
    }, 900);
  };

  return (
    <div className="relative min-h-[100svh] overflow-hidden">
      {/* 9:16 안전영역 */}
      <section className="relative mx-auto w-full max-w-[480px] px-5 pb-[96px]">
        {/* 헤더 */}
        <header className="pt-6 flex items-center justify-between">
          <button
            onClick={() => router.back()}
            aria-label="뒤로"
            className="rounded-lg px-3 h-9 text-white/85 bg-white/6 border border-white/12 hover:bg-white/10 transition"
          >
            ←
          </button>
          <h1 className="text-white text-[18px] font-semibold tracking-[-0.01em]">
            걱정 내려놓기
          </h1>
          <span className="w-9" />
        </header>

        {/* 안내 카드 (짧고 담백) */}
        <div className="mt-4">
          <GlassCard className="p-3">
            <p className="text-white/85 text-[14px] leading-snug">
              한 줄이면 충분해요. 걱정을 적고, 살짝 숨을 내쉰 뒤 흘려보내요.
            </p>
          </GlassCard>
        </div>

        {/* 카테고리 + 강도 */}
        <div className="mt-4 grid grid-cols-1 gap-4">
          {/* 카테고리 */}
          <GlassCard className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-white/85 text-[14px]">걱정 종류</span>
              <span className="text-white/60 text-[13px]">선택(선택사항)</span>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {CATEGORIES.map((c) => (
                <button
                  key={c}
                  onClick={() => setCategory((prev) => (prev === c ? null : c))}
                  aria-pressed={category === c}
                  className={[
                    "px-3 h-9 rounded-full text-[13px] border transition",
                    category === c
                      ? "bg-cyan-300/15 border-cyan-300/50 text-white"
                      : "bg-white/6 border-white/12 text-white/80 hover:border-white/20",
                  ].join(" ")}
                >
                  #{c}
                </button>
              ))}
            </div>
          </GlassCard>

          {/* 강도 슬라이더 */}
          <GlassCard className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-white/85 text-[14px]">현재 강도</span>
              <span className="text-white/70 text-[13px]">{intensity}/5</span>
            </div>
            <div className="mt-3 px-1">
              <input
                type="range"
                min={1}
                max={5}
                value={intensity}
                onChange={(e) => setIntensity(Number(e.target.value))}
                className="w-full accent-cyan-300"
                aria-label="걱정 강도"
              />
              <div className="mt-1 flex justify-between text-white/50 text-[12px]">
                <span>낮음</span>
                <span>보통</span>
                <span>높음</span>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* 텍스트 입력 */}
        <div className="mt-4">
          <GlassCard className="p-3">
            <label htmlFor="release-note" className="sr-only">
              걱정 적기
            </label>
            <textarea
              id="release-note"
              maxLength={limit}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="무엇이 가장 마음을 무겁게 하나요? (최대 180자)"
              className="
                w-full h-32 resize-none rounded-xl
                bg-transparent outline-none
                text-[15px] text-white/90 placeholder:text-white/45
              "
            />
            <div className="mt-2 flex items-center justify-between">
              <div className="text-white/60 text-[12px]">
                저장 없이 흘려보낼 수 있어요
              </div>
              <div className="text-white/60 text-[12px]">
                {text.length}/{limit}
              </div>
            </div>
          </GlassCard>
        </div>

        {/* 의식(ritual) 선택 – 세계관 연결 */}
        <div className="mt-4">
          <GlassCard className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-white/85 text-[14px]">
                어떻게 흘려보낼까요?
              </span>
              <span className="text-white/60 text-[12px]">하나 선택</span>
            </div>
            <div className="mt-3 grid grid-cols-3 gap-2">
              {(["별에 맡기기", "바람에 띄우기", "물결에 흘리기"] as const).map(
                (opt) => (
                  <button
                    key={opt}
                    onClick={() => setRitual(opt)}
                    aria-pressed={ritual === opt}
                    className={[
                      "h-10 rounded-xl border text-[13px] transition",
                      ritual === opt
                        ? "bg-cyan-300/15 border-cyan-300/50 text-white"
                        : "bg-white/6 border-white/12 text-white/80 hover:border-white/20",
                    ].join(" ")}
                  >
                    {opt}
                  </button>
                )
              )}
            </div>
            {/* 호흡 가이드 (짧게, 선택) */}
            <div className="mt-3 rounded-lg bg-white/4 border border-white/8 p-3">
              <div className="flex items-center gap-3">
                <span
                  aria-hidden
                  className="inline-block h-6 w-6 rounded-full bg-white/30 animate-[breath_4s_ease-in-out_infinite]"
                />
                <p className="text-white/80 text-[13px]">
                  3번만, 천천히 숨을 내쉬어요.
                </p>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* 하단 CTA */}
        <div
          className="absolute left-1/2 -translate-x-1/2 w-[92%] max-w-[420px]"
          style={{
            bottom: "max(calc(env(safe-area-inset-bottom) + 8px), 20px)",
          }}
        >
          <div className="grid grid-cols-2 gap-8">
            <button
              onClick={() => router.replace("/lumi/home")}
              className="h-12 rounded-[12px] text-[14px] font-medium text-white/85
                         bg-white/6 border border-white/12 hover:bg-white/10 transition"
            >
              취소
            </button>

            <button
              disabled={!canSubmit}
              onClick={submit}
              className={[
                "group relative h-12 rounded-[12px] text-[15px] font-semibold text-white",
                "bg-[linear-gradient(180deg,#18326f_0%,#0b1d4a_100%)] border border-white/14",
                "shadow-[0_6px_16px_rgba(10,18,38,0.32)] overflow-hidden",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-white/28",
                canSubmit
                  ? "hover:brightness-[1.03] active:translate-y-[1px]"
                  : "opacity-50 cursor-not-allowed",
              ].join(" ")}
              aria-disabled={!canSubmit}
            >
              <span className="relative z-10 inline-flex items-center justify-center gap-2">
                흘려보내기
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  className="opacity-90 transition-transform group-hover:translate-x-[2px]"
                  aria-hidden
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

              {/* 아주 얕은 shimmer */}
              <span
                aria-hidden
                className="absolute inset-0 -translate-x-full
                           bg-[linear-gradient(120deg,transparent,rgba(255,255,255,0.20),transparent)]
                           animate-[shimmer_4.8s_linear_infinite]"
              />
            </button>
          </div>
        </div>
      </section>

      {/* 릴리즈 애니메이션 베일(상단으로 사라지는 입자감) */}
      <div
        id="release-veil"
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-700"
        aria-hidden
      >
        <div className="absolute inset-0 bg-[radial-gradient(80%_40%_at_50%_110%,rgba(79,140,255,0.22),transparent)] animate-[lift_0.9s_ease-out_forwards]" />
      </div>
    </div>
  );
}
