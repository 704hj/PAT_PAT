"use client";

import GlassCard from "@/app/components/glassCard";
import { useRouter } from "next/navigation";
import StepPill from "./StepPill";
import {
  useStarWrite,
  MOODS,
  LIMIT,
  MAX_TAGS,
  intensityLabel,
  type MoodKey,
} from "@/app/hooks/useStarWrite";

type Props = {
  tags: {
    tag_id: string;
    tag_name: string;
  }[];
  editDate?: string; // 수정 모드일 때 날짜 (YYYY-MM-DD)
};

export default function StarWrite({ tags, editDate }: Props) {
  const router = useRouter();
  const {
    mood,
    intensity,
    text,
    tagOpen,
    selectedTags,
    isSubmitting,
    loading,
    selectedMood,
    canSubmit,
    setMood,
    setIntensity,
    setText,
    setTagOpen,
    toggleTag,
    submit,
  } = useStarWrite({ editDate });

  return (
    <div className="relative min-h-[100svh] overflow-y-auto">
      {/* 배경(페이지에 이미 있다면 제거) */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(1200px_800px_at_50%_-10%,rgba(70,120,255,0.22),transparent_60%),radial-gradient(900px_600px_at_80%_40%,rgba(130,70,255,0.14),transparent_60%),linear-gradient(180deg,#07102a_0%,#050b1c_100%)]" />

      <section className="relative mx-auto w-full max-w-[480px] px-5 pb-[120px]">
        {/* 로딩 오버레이 */}
        {loading && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="text-white text-sm">기존 글을 불러오는 중...</div>
          </div>
        )}

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
            {editDate ? "별 수정하기" : "오늘의 별 만들기"}
          </h1>
          <span className="w-9" />
        </header>

        {/* 안내 */}
        <div className="mt-4">
          <GlassCard className="p-3">
            <div className="flex items-center gap-3">
              <img
                src="/images/icon/lumi/lumi_main.svg"
                alt="루미"
                className="w-10 h-10 object-contain"
              />
              <p className="text-white/85 text-[14px] leading-snug">
                오늘 하루를 짧게 기록해보세요.
              </p>
            </div>
          </GlassCard>
        </div>

        {/* STEP 1: 감정 선택 */}
        <div className="mt-4">
          <GlassCard className="p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2">
                <StepPill>STEP 1</StepPill>
                <span className="text-white/90 text-[15px] font-semibold">
                  오늘 하루를 어떻게 정리하고 싶나요?
                </span>
              </div>

              <span className="text-white/60 text-[13px] pt-[2px]">
                {selectedMood ? selectedMood.label : "선택"}
              </span>
            </div>

            <div className="mt-3 grid grid-cols-4 gap-2">
              {MOODS.map((m) => {
                const selected = mood === m.key;
                return (
                  <button
                    key={m.key}
                    type="button"
                    onClick={() => setMood(mood === m.key ? null : m.key)}
                    aria-pressed={selected}
                    aria-label={m.label}
                    className={[
                      "group relative rounded-xl border transition focus:outline-none",
                      "px-2 py-2",
                      selected
                        ? "border-cyan-300/70 bg-cyan-300/18 shadow-[0_0_0_4px_rgba(34,211,238,0.10)]"
                        : "border-white/10 bg-white/6 hover:border-white/20",
                    ].join(" ")}
                  >
                    <img
                      src={m.img}
                      alt=""
                      loading="lazy"
                      className="mx-auto h-14 w-14 object-contain select-none pointer-events-none"
                      draggable={false}
                    />
                    <div className="mt-1 text-center text-[12px] text-white/85">
                      {m.label}
                    </div>

                    {selected && (
                      <span
                        aria-hidden
                        className="pointer-events-none absolute inset-0 rounded-xl
                        bg-[radial-gradient(60%_50%_at_50%_45%,rgba(56,189,248,0.18),transparent_70%)]"
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </GlassCard>
        </div>

        {/* STEP 2: 강도 */}
        <div className="mt-4">
          <GlassCard className="p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2">
                <StepPill>STEP 2</StepPill>
                <span className="text-white/90 text-[15px] font-semibold">
                  오늘이 얼마나 남았나요?
                </span>
              </div>
              <span className="text-white/70 text-[13px] pt-[2px]">
                {intensity}/5 · {intensityLabel(intensity)}
              </span>
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

        {/* STEP 3: 한 줄 기록 */}
        <div className="mt-4">
          <GlassCard className="p-4">
            <div className="flex items-center gap-2">
              <StepPill>STEP 3</StepPill>
              <span className="text-white/90 text-[15px] font-semibold">
                오늘 기억하고 싶은 순간은?
              </span>
            </div>

            <div className="mt-3">
              <label htmlFor="note" className="sr-only">
                오늘 기록
              </label>
              <textarea
                id="note"
                maxLength={LIMIT}
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="한 줄이면 충분해요"
                className={[
                  "w-full h-32 resize-none rounded-xl p-3",
                  "bg-white/4 border border-white/10",
                  "outline-none",
                  "text-[15px] text-white/90 placeholder:text-white/45",
                  "focus:border-white/18 focus:bg-white/6 transition",
                ].join(" ")}
              />

              <div className="mt-2 flex items-center justify-between">
                <div className="text-white/55 text-[12px]">
                  이 순간은 하나의 별이 됩니다 ✨
                </div>
                <div className="text-white/60 text-[12px]">
                  {text.length}/{LIMIT}
                </div>
              </div>
            </div>

            {/* 태그 (선택) - 접힘 */}
            <div className="mt-4">
              <button
                type="button"
                onClick={() => setTagOpen(!tagOpen)}
                className="w-full flex items-center justify-between rounded-xl border border-white/10 bg-white/4 px-3 py-2 hover:bg-white/6 transition"
                aria-expanded={tagOpen}
              >
                <span className="text-white/75 text-[13px]">
                  분류하고 싶다면 (선택) · 최대 {MAX_TAGS}개
                </span>
                <span className="text-white/65 text-[14px]">
                  {tagOpen ? "▴" : "▾"}
                </span>
              </button>

              {tagOpen && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {tags.map((tag) => {
                    const selected = selectedTags.includes(tag.tag_id);
                    return (
                      <button
                        key={tag.tag_id}
                        type="button"
                        onClick={() => toggleTag(tag.tag_id)}
                        className={[
                          "px-2.5 py-1 rounded-full text-[12px] border transition",
                          selected
                            ? "bg-cyan-300/15 border-cyan-300/50 text-white"
                            : "bg-white/6 border-white/10 text-white/80 hover:border-white/20",
                        ].join(" ")}
                        aria-pressed={selected}
                      >
                        #{tag.tag_name}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </GlassCard>
        </div>

        {/* 하단 CTA */}
        <div
          className="fixed left-1/2 -translate-x-1/2 w-[92%] max-w-[420px]"
          style={{
            bottom: "max(calc(env(safe-area-inset-bottom) + 10px), 18px)",
          }}
        >
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => router.back()}
              className="h-12 rounded-[12px] text-[14px] font-medium text-white/85
                         bg-white/6 border border-white/12 hover:bg-white/10 transition"
            >
              취소
            </button>

            <button
              disabled={!canSubmit || loading}
              onClick={submit}
              className={[
                "group relative h-12 rounded-[12px] text-[15px] font-semibold text-white",
                "bg-[linear-gradient(180deg,#18326f_0%,#0b1d4a_100%)] border border-white/14",
                "shadow-[0_6px_16px_rgba(10,18,38,0.32)] overflow-hidden",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-white/28",
                canSubmit && !loading
                  ? "hover:brightness-[1.03] active:translate-y-[1px]"
                  : "opacity-50 cursor-not-allowed",
              ].join(" ")}
              aria-disabled={!canSubmit || loading}
            >
              <span className="relative z-10 inline-flex items-center justify-center gap-2">
                {loading ? "로딩 중..." : editDate ? "수정하기" : "오늘 정리하기"}
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
