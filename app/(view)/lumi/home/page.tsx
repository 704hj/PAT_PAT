"use client";

import { useRef } from "react";
import GlowButton from "./glowbutton";

export default function EmotionTrashPage() {
  const characterRef = useRef<HTMLDivElement>(null);

  return (
    <div className="relative min-h-[100svh] overflow-x-hidden bg-white">
      {/* 배경: 심도 있는 밤하늘 + 비네팅 + 별 */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10
                   bg-[radial-gradient(1200px_700px_at_50%_20%,#10204f,transparent_65%)]
                   pointer-events-none"
      />
      <div
        aria-hidden
        className="absolute inset-0 -z-10
                   bg-[linear-gradient(180deg,#060b1a_0%,#0a1430_30%,#0b1636_60%,#0a1430_100%)]"
      />
      <div
        aria-hidden
        className="absolute inset-0 -z-10
                   bg-[radial-gradient(circle_at_15%_25%,rgba(255,255,255,0.5)_1px,transparent_1px),
                       radial-gradient(circle_at_80%_60%,rgba(255,255,255,0.35)_1px,transparent_1px)]
                   bg-[length:2px_2px,2px_2px] opacity-40"
      />
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_center,transparent_60%,rgba(0,0,0,0.35))]"
      />

      <section className="relative mx-auto w-full max-w-[480px] aspect-[9/16]">
        {/* 캐릭터 + 버튼 */}
        <div
          ref={characterRef}
          className="absolute z-30 flex flex-col items-center gap-7
                     top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        >
          {/* 고양이 */}
          <div className="relative">
            {/* 살짝 떠있는 그림자 */}
            <span
              aria-hidden
              className="absolute -bottom-2 left-1/2 -translate-x-1/2 h-3 w-32
                         bg-black/40 blur-[10px] rounded-full"
            />
            <img
              src="/images/icon/3d.png"
              alt="루미 캐릭터"
              className="mx-auto w-[250px] h-auto motion-safe:animate-[float_4s_ease-in-out_infinite]"
            />
          </div>

          {/* 버튼 스택 */}
          <div className="flex flex-col items-center gap-4">
            <GlowButton
              label="마음 정리하기"
              icon="/images/icon/trash_bin.png"
              variant="glass"
              onClick={() => alert("나쁜 감정 버리기!")}
              ariaLabel="나쁜 감정 버리기"
            />
            <GlowButton
              label="행복 기록하기"
              icon="/images/icon/star.png"
              variant="milkyway"
              onClick={() => alert("좋은 감정 기록하기!")}
              ariaLabel="좋은 감정 기록하기"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
