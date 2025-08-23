"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import GlassCard from "../../(main)/home/component/glassCard";

type Mood = "😀" | "☺️" | "😌" | "😕" | "😢" | null;

// 백엔드에서 받아옴
const TAGS = [
  "감사",
  "성취",
  "휴식",
  "친구",
  "자연",
  "음악",
  "운동",
  "여행",
] as const;

export default function StarWritePage() {
  const router = useRouter();

  // state
  const [mood, setMood] = useState<Mood>(null);
  const [intensity, setIntensity] = useState(3);
  const [text, setText] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const limit = 200;

  const canSubmit = useMemo(
    () => !!mood && text.trim().length > 0,
    [mood, text]
  );

  const toggleTag = (t: string) => {
    setTags((prev) => {
      if (prev.includes(t)) return prev.filter((x) => x !== t);
      if (prev.length >= 3) return prev; // 최대 3개
      return [...prev, t];
    });
  };

  const submit = () => {
    if (!canSubmit) return;
    // TODO: 서버 전송
    alert("별이 저장되었어요 ✦");
    router.replace("/lumi/home");
  };

  return (
    <div className="relative min-h-[100svh] overflow-y-auto">
      <section className="relative mx-auto w-full max-w-[480px] px-5 pb-[96px]">
        {/* 헤더 */}
        <header className="pt-6 flex items-center justify-between">
          <button
            onClick={() => router.back()}
            aria-label="뒤로"
            className="rounded-lg px-3 h-9 text-white/85 bg-white/6 border border-white/10 hover:bg-white/10 transition"
          >
            ←
          </button>
          <h1 className="text-white text-[18px] font-semibold tracking-[-0.01em]">
            오늘의 별 만들기
          </h1>
          <span className="w-9" /> {/* 균형용 */}
        </header>

        {/* 캐릭터 살짝 안내 (옵션) */}
        <div className="mt-4">
          <GlassCard className="p-3">
            <div className="flex items-center gap-3">
              <img
                src="/images/icon/3d.png"
                alt="루미"
                className="w-10 h-10 object-contain"
              />
              <p className="text-white/85 text-[14px] leading-snug">
                짧게 쓰면 더 좋아요. 좋은 건 담고, 힘든 건 흘려보내요.
              </p>
            </div>
          </GlassCard>
        </div>

        {/* Mood 선택 */}
        <div className="mt-4">
          <GlassCard className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-white/85 text-[14px]">지금 감정</span>
              <span className="text-white/60 text-[13px]">하나만 선택</span>
            </div>
            <div className="mt-3 grid grid-cols-6 gap-2">
              {(["😀", "☺️", "😌", "😕", "😢", "🥳"] as Mood[]).map((m) => (
                <button
                  key={m as string}
                  onClick={() => setMood((prev) => (prev === m ? null : m))}
                  className={[
                    "h-11 rounded-xl bg-white/6 border text-[18px]",
                    mood === m
                      ? "border-cyan-300/60 text-white"
                      : "border-white/10 text-white/85 hover:border-white/20",
                  ].join(" ")}
                  aria-pressed={mood === m}
                >
                  {m}
                </button>
              ))}
            </div>
          </GlassCard>
        </div>

        {/* 강도 슬라이더 */}
        <div className="mt-4">
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
                className="w-full accent-cyan-300"
                aria-label="감정 강도"
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
            <label htmlFor="note" className="sr-only">
              메모
            </label>
            <textarea
              id="note"
              maxLength={limit}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="오늘을 한 줄로 남겨보세요 (최대 200자)"
              className="
                w-full h-32 resize-none rounded-xl
                bg-transparent outline-none
                text-[15px] text-white/90 placeholder:text-white/45
              "
            />
            <div className="mt-2 flex items-center justify-between">
              <div className="text-white/60 text-[12px]">
                #해시태그로 분류해요 (최대 3개)
              </div>
              <div className="text-white/60 text-[12px]">
                {text.length}/{limit}
              </div>
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {TAGS.map((t) => (
                <button
                  key={t}
                  onClick={() => toggleTag(t)}
                  className={[
                    "px-2.5 py-1 rounded-full text-[12px] border transition",
                    tags.includes(t)
                      ? "bg-cyan-300/15 border-cyan-300/50 text-white"
                      : "bg-white/6 border-white/10 text-white/80 hover:border-white/20",
                  ].join(" ")}
                  aria-pressed={tags.includes(t)}
                >
                  #{t}
                </button>
              ))}
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
                별 만들기
                {/* 은은한 체브론 */}
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

              {/* 미세한 shimmer 라인 (전역 CSS로 뺄 수 있음) */}
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
    </div>
  );
}
