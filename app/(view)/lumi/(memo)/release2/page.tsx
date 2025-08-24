"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import GlassCard from "../../components/glassCard";
import RitualCard from "../../components/ritualCard";

type Ritual = "wind" | "wave" | "star";
const CATEGORIES = ["일", "관계", "건강", "금전", "자존감", "미래"] as const;
type Category = (typeof CATEGORIES)[number];

export default function ReleasePage() {
  const router = useRouter();

  const [category, setCategory] = useState<Category | null>(null);
  const [intensity, setIntensity] = useState(3);
  const [text, setText] = useState("");
  const [ritual, setRitual] = useState<Ritual>("wind");

  const limit = 180;
  const canSubmit = useMemo(() => text.trim().length > 0, [text]);

  const submit = async () => {
    if (!canSubmit) return;
    const preview = text.trim().split("\n")[0].slice(0, 60);
    router.push(
      `/lumi/release/sending?kind=${ritual}&t=${encodeURIComponent(preview)}`
    );
  };

  return (
    <div className="relative min-h-[100svh] overflow-hidden">
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

        {/* 안내 */}
        <div className="mt-4">
          <GlassCard className="p-3">
            <p className="text-white/85 text-[14px] leading-snug">
              한 줄이면 충분해요. 적고, 살짝 숨을 내쉰 뒤 흘려보내요.
            </p>
          </GlassCard>
        </div>

        {/* 카테고리 & 강도 */}
        <div className="mt-4 grid grid-cols-1 gap-4">
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

        {/* 텍스트 입력 (디졸브용: 텍스트 자체가 주인공) */}
        <div className="mt-4">
          <GlassCard className="p-0 overflow-hidden">
            <div className="relative">
              <textarea
                id="release-note"
                maxLength={limit}
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="가장 무거운 생각 한 줄 (최대 180자)"
                className="w-full h-32 bg-transparent px-3.5 py-3.5 outline-none text-[15px] text-white/90 placeholder:text-white/45"
              />
              {/* 포커스 시 은은한 별빛 */}
              <span
                aria-hidden
                className="pointer-events-none absolute inset-0 opacity-0 focus-within:opacity-100 transition-opacity
                           bg-[radial-gradient(80%_50%_at_50%_40%,rgba(79,140,255,0.10),transparent_60%)]"
              />
            </div>
            <div className="flex items-center justify-between border-t border-white/10 px-3.5 py-2.5">
              <span className="text-white/60 text-[12px]">
                저장하지 않아도 괜찮아요
              </span>
              <span className="text-white/60 text-[12px]">
                {text.length}/{limit}
              </span>
            </div>
          </GlassCard>
        </div>

        {/* 의식 선택 (간략: 아이콘/프리뷰는 기존 RitualCard 사용) */}
        <div className="mt-4 rounded-[12px] p-4 bg-white/6 border border-white/12">
          <div className="flex items-center justify-between">
            <span className="text-white/85 text-[14px]">흘려 보내는 방법</span>
            <span className="text-white/60 text-[12px]">하나 선택</span>
          </div>
          <div className="mt-3 grid grid-cols-3 gap-2">
            <RitualCard
              active={ritual === "wave"}
              onClick={() => setRitual("wave")}
              label="물결"
              desc="잔잔히"
            />
            <RitualCard
              active={ritual === "star"}
              onClick={() => setRitual("star")}
              label="별빛"
              desc="맡기기"
            />
          </div>
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
              className="h-12 rounded-[12px] text-[14px] font-medium text-white/85 bg-white/6 border border-white/12 hover:bg-white/10 transition"
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
              흘려보내기
              <span
                aria-hidden
                className="absolute inset-0 -translate-x-full bg-[linear-gradient(120deg,transparent,rgba(255,255,255,0.20),transparent)]
                           animate-[shimmer_4.8s_linear_infinite]"
              />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
