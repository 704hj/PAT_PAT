"use client";

import { useEffect, useRef, useState } from "react";
import DraggableLetter from "./components/draggableLetter";

export default function EmotionTrashPage() {
  const [isEating, setIsEating] = useState(false);
  const [isHover, setIsHover] = useState(false);
  const [darkOverlay, setDarkOverlay] = useState(true);

  const characterRef = useRef<HTMLDivElement>(null);

  // 화면 진입 후 1.5초 동안 어둡게
  useEffect(() => {
    const timer = setTimeout(() => setDarkOverlay(false), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center ">
      {/* 어두운 오버레이 */}
      {darkOverlay && (
        <div className="absolute inset-0 bg-black opacity-50 z-20 transition-opacity duration-500" />
      )}

      {/* 캐릭터 */}
      <div className="absolute inset-0 flex justify-center items-end bottom-1/3 z-30">
        <div className="relative mb-4 left-1/4" ref={characterRef}>
          <img
            src="/images/icon/cat.png"
            alt="character"
            className="max-w-[60%] h-auto transition-transform duration-150 ease-out active:translate-y-1 active:scale-95 cursor-pointer"
            style={{
              top: "25%",
              left: "60%",
              transform: "translate(-10%, -55%)",
            }}
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

      {/* 사람 캐릭터 */}
      <div className="absolute inset-0 flex justify-center items-end  z-30">
        <div className="relative mb-4 left-0 ">
          <img
            src="/images/icon/girl2.png"
            alt="character"
            className="h-auto max-w-[50%] transition-transform duration-150 ease-out active:translate-y-1 active:scale-95 cursor-pointer "
            style={{
              top: "20%",
              left: "30%",
              transform: "translate(35%, -175%)",
            }}
          />
        </div>
      </div>

      {/* 드래그 조각 영역 */}
      <div className="relative w-full h-[300px] z-20 flex justify-center items-center">
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
    </div>
  );
}
