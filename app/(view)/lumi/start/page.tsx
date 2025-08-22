"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function EmotionTrashPage() {
  const [darkOverlay, setDarkOverlay] = useState(true);
  const [textIndex, setTextIndex] = useState(0);

  const characterRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // 튜토리얼 문구 배열
  const tutorialTexts = [
    "안녕하세요!",
    "저는 루미에요 🐾",
    "마음을 정리해 드릴게요.",
    "start 버튼울 눌러 보세요!",
  ];

  useEffect(() => {
    const timer = setTimeout(() => setDarkOverlay(false), 500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // 0.5초마다 텍스트 변경
    const interval = setInterval(() => {
      setTextIndex((prev) => (prev + 1) % tutorialTexts.length);
    }, 2000);

    return () => clearInterval(interval);
  }, [tutorialTexts.length]);

  return (
    <div className="relative min-h-[100svh] overflow-x-hidden bg-white">
      <section className="relative mx-auto w-full max-w-[480px] aspect-[9/16]">
        {/* 고양이 */}
        <div
          ref={characterRef}
          className="absolute z-30 flex justify-center items-end bottom-[10%] inset-x-0"
        >
          <div className="relative mb-4 flex flex-col items-center gap-6">
            {/* 설명 텍스트 (고양이 위에 표시) */}
            <span className="absolute bottom-full mb-6 px-3 py-2 bg-white text-black text-sm rounded-lg shadow-lg border border-gray-200">
              {tutorialTexts[textIndex]}
            </span>

            {/* 캐릭터 이미지 */}
            <img
              src="/images/icon/3d.png"
              alt="character"
              className="mx-auto w-[250px] h-auto"
            />

            {/* Start 버튼 */}
            <button
              onClick={() => router.replace("/lumi/home")} // 👉 여기서 원하는 동작 실행
              className="px-6 py-2 bg-blue-900 text-white text-lg rounded-full shadow-md hover:bg-blue-600 active:scale-95 transition"
            >
              Start
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
