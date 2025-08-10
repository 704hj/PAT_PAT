"use client";

import { useRef, useState } from "react";
import Character from "./components/character";
import DraggableLetter from "./components/draggableLetter";

export default function EmotionTrashPage() {
  const [isEating, setIsEating] = useState(false);
  const [isHover, setIsHover] = useState(false);

  const characterRef = useRef<HTMLDivElement>(null);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#212121] text-[#cdcdcd] px-6 py-8">
      {/* 안내 문구 */}
      <p className="mb-4 text-center text-lg font-semibold max-w-xs">
        {isEating
          ? "천천히 감정을 삼키는 중입니다."
          : "기억 조각을 움직여 보세요"}
      </p>

      {/* 드래그 조각 영역 */}
      <div className="w-full max-w-xs h-32 mb-6 relative">
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

      {/* 캐릭터 영역 */}
      <div className="w-full max-w-xs h-48 flex items-center justify-center">
        <Character isEating={isEating} isHover={isHover} ref={characterRef} />
      </div>
    </div>
  );
}
