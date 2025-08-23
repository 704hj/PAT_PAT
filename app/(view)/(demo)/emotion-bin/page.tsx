"use client";

import { useEffect, useRef, useState } from "react";
import DraggableLetter from "./components/draggableLetter";

export default function EmotionTrashPage() {
  const [isEating, setIsEating] = useState(false);
  const [isHover, setIsHover] = useState(false);
  const [darkOverlay, setDarkOverlay] = useState(true);

  const characterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => setDarkOverlay(false), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    // 페이지 스크롤 허용
    <div className="relative min-h-[100svh] overflow-x-hidden">
      {/* 스테이지: 모바일 세로 규격 고정(9:16).  */}
      <section className="relative mx-auto w-full max-w-[480px] aspect-[9/16]">
        {/* 어두운 오버레이 */}
        {darkOverlay && (
          <div className="absolute inset-0 bg-black/50 z-20 transition-opacity duration-500 pointer-events-none" />
        )}

        {/* 고양이 */}
        <div
          ref={characterRef}
          className="absolute z-30 flex justify-center items-end
                     top-[70%] left-[50%] -translate-x-[-15%] -translate-y-[41%]"
        >
          <div className="relative mb-4">
            <img
              src="/images/icon/cat.png"
              alt="character"
              className="max-w-[50%] h-auto transition-transform duration-150 ease-out active:translate-y-1 active:scale-95 cursor-pointer"
            />
            {/* 말풍선 */}
            {isEating && (
              <div className="absolute bottom-full left-1/4 -translate-x-1/2 w-max max-w-xs bg-white text-black text-sm px-3 py-2 rounded-lg shadow-lg border border-gray-200 text-center">
                처리 완료 🐾
                <div
                  className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0
              border-l-4 border-l-transparent border-r-4 border-r-transparent border-t-4 border-t-white"
                />
              </div>
            )}
          </div>
        </div>

        {/* 사람 */}
        <div
          className="absolute z-30 flex justify-center items-end
                    top-[67%] left-[40%] -translate-x-[50%] -translate-y-[47%]"
        >
          <img
            src="/images/icon/girl2.png"
            alt="girl"
            className="max-w-[80%] h-auto transition-transform duration-150 ease-out active:translate-y-1 active:scale-95 cursor-pointer"
            draggable={false}
          />
        </div>

        {/* 드래그 조각 영역 */}
        <div className="relative w-full h-[300px] z-40 flex justify-center items-center">
          <DraggableLetter
            onDrag={(letterRect) => {
              const charRect = characterRef.current?.getBoundingClientRect();
              if (charRect && letterRect) {
                const isIntersecting =
                  letterRect.bottom > charRect.top &&
                  letterRect.top < charRect.bottom &&
                  letterRect.right > charRect.left &&
                  letterRect.left < charRect.right;

                setIsHover(isIntersecting);
              }
            }}
            onDragEnd={(letterRect) => {
              const charRect = characterRef.current?.getBoundingClientRect();
              if (charRect && letterRect) {
                const isIntersecting =
                  letterRect.bottom > charRect.top &&
                  letterRect.top < charRect.bottom &&
                  letterRect.right > charRect.left &&
                  letterRect.left < charRect.right;

                setIsEating(isIntersecting);
                setIsHover(false);
              }
            }}
            isEating={isEating}
          />
        </div>
      </section>
    </div>
  );
}
