import { useEffect, useState } from "react";

export default function IntroHeader({ messages }: { messages: string[] }) {
  const [msgIdx, setMsgIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [phase, setPhase] = useState<"typing" | "hold" | "next">("typing");

  // 타이핑 속도/홀드 시간
  const TYPE_MS = 48;
  const HOLD_MS = 900;

  useEffect(() => {
    if (phase === "typing") {
      if (charIdx < messages[msgIdx].length) {
        const t = setTimeout(() => setCharIdx((c) => c + 1), TYPE_MS);
        return () => clearTimeout(t);
      }
      // 문장 끝 → 홀드
      const h = setTimeout(() => setPhase("next"), HOLD_MS);
      return () => clearTimeout(h);
    }
    if (phase === "next") {
      setMsgIdx((i) => (i + 1) % messages.length);
      setCharIdx(0);
      setPhase("typing");
    }
  }, [charIdx, msgIdx, phase, messages]);

  const typed = messages[msgIdx].slice(0, charIdx);

  return (
    <div
      className="relative mx-auto rounded-2xl px-5 py-4 text-center text-white
                   bg-white/10 backdrop-blur border border-white/15
                   shadow-[0_10px_30px_rgba(6,19,42,0.45)]"
    >
      {/* Badge */}
      <div className="mb-2 flex justify-center">
        <span
          className="px-2.5 py-1 rounded-full text-[11px] tracking-wide
                           bg-white/15 text-white/90 border border-white/20"
        >
          루미 안내
        </span>
      </div>

      {/* 헤드라인 */}
      <h1
        className="mb-1 text-xl sm:text-2xl font-semibold
                     bg-clip-text text-transparent
                     bg-gradient-to-r from-[#e9f2ff] via-white to-[#ffeec7]"
      >
        밤하늘에 기분을 기록해요
      </h1>

      {/* 타입라이터 라인 */}
      <p className="mx-auto max-w-[300px] text-base sm:text-lg text-white/90">
        <span>{typed}</span>
        <span
          aria-hidden
          className="ml-0.5 inline-block w-[10px] h-[1.2em] translate-y-[2px]
                       bg-white/85 align-middle animate-cursor"
        />
      </p>
    </div>
  );
}
