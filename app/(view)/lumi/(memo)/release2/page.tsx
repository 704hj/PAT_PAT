"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

type Ritual = "wind" | "wave" | "star";

export default function ReleasePage() {
  const router = useRouter();

  const [ritual, setRitual] = useState<Ritual>("wind");
  const [text, setText] = useState("");
  const [intensity, setIntensity] = useState(3);
  const canSubmit = useMemo(() => text.trim().length > 0, [text]);

  const submit = async () => {
    if (!canSubmit) return;
    // TODO: 서버 전송 로직
    playReleaseEffect(ritual); // 의식별 애니 트리거
    setTimeout(() => router.replace("/lumi/home"), 900); // 0.9s 뒤 라우팅
  };

  return (
    <div className="relative min-h-[100svh] overflow-hidden">
      {/* 9:16 안전영역 */}
      <section className="relative mx-auto w-full max-w-[480px] aspect-[9/16] px-5">
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

        {/* 안내 카드 */}
        <div className="mt-4 rounded-[12px] p-3 bg-white/6 border border-white/12">
          <p className="text-white/85 text-[14px] leading-snug">
            한 줄이면 충분해요. 적고, 선택한 방식으로 가볍게 흘려보내요.
          </p>
        </div>

        {/* 텍스트 입력 */}
        <div className="mt-4 rounded-[12px] p-3 bg-white/6 border border-white/12">
          <label htmlFor="release-note" className="sr-only">
            걱정 적기
          </label>
          <textarea
            id="release-note"
            value={text}
            onChange={(e) => setText(e.target.value)}
            maxLength={180}
            placeholder="무엇이 가장 마음을 무겁게 하나요? (최대 180자)"
            className="w-full h-32 resize-none rounded-xl bg-transparent outline-none text-[15px] text-white/90 placeholder:text-white/45"
          />
          <div className="mt-2 flex items-center justify-between">
            <span className="text-white/60 text-[12px]">
              저장 없이도 흘려보낼 수 있어요
            </span>
            <span className="text-white/60 text-[12px]">{text.length}/180</span>
          </div>
        </div>

        {/* 강도 슬라이더 (옵션) */}
        <div className="mt-4 rounded-[12px] p-4 bg-white/6 border border-white/12">
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
              icon={
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  className="text-white/90"
                >
                  <path
                    d="M3 9h9c2 0 2-3 0-3M3 15h12c3 0 3-4 0-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                  />
                </svg>
              }
            />
            <RitualCard
              active={ritual === "wave"}
              onClick={() => setRitual("wave")}
              label="물결에 흘리기"
              desc="잔물결에 실어"
              preview={<WavePreview />}
              icon={
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  className="text-white/90"
                >
                  <path
                    d="M3 12c2 2 4 2 6 0s4-2 6 0 4 2 6 0"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                  />
                </svg>
              }
            />
            <RitualCard
              active={ritual === "star"}
              onClick={() => setRitual("star")}
              label="별에 맡기기"
              desc="빛으로 녹이기"
              preview={<StarPreview />}
              icon={
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  className="text-white/90"
                >
                  <path
                    d="M12 3.6l2 4.1 4.5.6-3.3 3.1.8 4.5-4-2.1-4 2.1.8-4.5L5.5 8.3l4.5-.6 2-4.1z"
                    fill="currentColor"
                  />
                </svg>
              }
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
              {/* 얕은 shimmer */}
              <span
                aria-hidden
                className="absolute inset-0 -translate-x-full bg-[linear-gradient(120deg,transparent,rgba(255,255,255,0.20),transparent)] animate-[shimmer_4.8s_linear_infinite]"
              />
            </button>
          </div>
        </div>
      </section>

      {/* 의식별 릴리즈 베일(페이지 전환 연출) */}
      <div
        id="release-veil"
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300"
        aria-hidden
      >
        <div className="release-layer absolute inset-0" />
      </div>
    </div>
  );
}

function RitualCard({
  active,
  onClick,
  label,
  desc,
  icon,
  preview,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  desc: string;
  icon: React.ReactNode;
  preview: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={[
        "group relative h-20 rounded-xl border px-3 text-left transition overflow-hidden",
        active
          ? "bg-cyan-300/10 border-cyan-300/50"
          : "bg-white/6 border-white/12 hover:border-white/20",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-white/28",
      ].join(" ")}
    >
      <div className="flex items-center gap-2">
        <span className="shrink-0 h-9 w-9 inline-flex items-center justify-center rounded-lg bg-white/8 border border-white/10">
          {icon}
        </span>
        <div className="min-w-0">
          <div className="text-white text-[13.5px] font-medium truncate">
            {label}
          </div>
          <div className="text-white/65 text-[12px] truncate">{desc}</div>
        </div>
      </div>

      {/* 미니 프리뷰: hover/active 시만 노출 */}
      <div
        className={[
          "absolute inset-0 pointer-events-none transition-opacity duration-200",
          active ? "opacity-100" : "opacity-0 group-hover:opacity-100",
        ].join(" ")}
        aria-hidden
      >
        {preview}
      </div>
    </button>
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

/* ----- 제출 시 베일 트리거 ----- */
function playReleaseEffect(kind: Ritual) {
  const veil = document.getElementById("release-veil");
  if (!veil) return;
  veil.setAttribute("data-kind", kind);
  veil.classList.remove("opacity-0");
  veil.classList.add("opacity-100");
  // 다음 틱에 애니 시작 클래스 추가
  requestAnimationFrame(() => veil.classList.add("animate"));
}
