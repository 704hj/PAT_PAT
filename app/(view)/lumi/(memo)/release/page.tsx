"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import GlassCard from "../../components/glassCard";
import RitualCard from "../../components/ritualCard";

type Ritual = "wind" | "wave" | "star" | "fire";
const CATEGORIES = ["일", "관계", "건강", "금전", "자존감", "미래"];
type Category = (typeof CATEGORIES)[number];

export default function ReleasePage() {
  const router = useRouter();

  // state
  const [category, setCategory] = useState<Category | null>(null);
  const [intensity, setIntensity] = useState(3);
  const [text, setText] = useState("");
  const [ritual, setRitual] = useState<Ritual>("wind");

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
      router.push(`/lumi/release/sending?kind=${ritual}`); // ← 전용 전환 페이지로
    }, 900);
  };

  useEffect(() => {
    console.log("ritual ", ritual);
  }, [ritual]);

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
              <span className="text-white/85 text-[14px]">감정 강도</span>
              <span className="text-white/70 text-[13px]">{intensity}/5</span>
            </div>
            <div className="mt-3 px-1">
              <input
                type="range"
                min={1}
                max={5}
                value={intensity}
                onChange={(e) => setIntensity(Number(e.target.value))}
                className="w-full slider-star"
                aria-label="감정 강도"
              />
              <div className="mt-2 flex justify-between text-white/50 text-[12px]">
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

        {/* 의식 선택 (라디오형 카드 + 미니 프리뷰) */}
        <div className="mt-4 rounded-[12px] p-4 bg-white/6 border border-white/12">
          <div className="flex items-center justify-between">
            <span className="text-white/85 text-[14px]">흘려 보내는 방법</span>
            <span className="text-white/60 text-[12px]">하나 선택</span>
          </div>

          <div className="mt-3 grid grid-cols-3 gap-2">
            <RitualCard
              active={ritual === "wind"}
              onClick={() => setRitual("wind")}
              label="바람에 띄우기"
              desc="가볍게 위로"
              preview={<WindPreview />}
            />
            <RitualCard
              active={ritual === "wave"}
              onClick={() => setRitual("wave")}
              label="물결에 흘리기"
              desc="잔물결에 실어"
              preview={<WavePreview />}
            />
            <RitualCard
              active={ritual === "fire"}
              onClick={() => setRitual("fire")}
              label="불에 태우기"
              desc="불로 처리하기"
              preview={<EmberSend />}
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

function WindPreview() {
  return (
    <div className="absolute inset-0">
      <i className="wind-dot" style={{ left: "20%", bottom: "20%" }} />
      <i className="wind-dot wind-d2" style={{ left: "60%", bottom: "15%" }} />
      <i className="wind-dot wind-d3" style={{ left: "40%", bottom: "10%" }} />
    </div>
  );
}

function WavePreview() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="wave-line" />
      <div className="wave-line wave-d2" />
    </div>
  );
}

function StarPreview() {
  return (
    <div className="absolute inset-0">
      <i className="star-dot" style={{ left: "30%", top: "55%" }} />
      <i className="star-dot star-d2" style={{ left: "70%", top: "60%" }} />
    </div>
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
