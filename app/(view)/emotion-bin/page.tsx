"use client";

import { useRef, useState } from "react";
import DraggableLetter from "./components/draggableLetter";
import Character from "./components/character";

export default function EmotionTrashPage() {
  const [isEating, setIsEating] = useState(false);
  const [isHover, setIsHover] = useState(false);

  const characterRef = useRef<HTMLDivElement>(null);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8 bg-[#fefefe] text-[#333] relative">
      <div className="relative w-full h-40 mb-8">
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
              setIsHover(false); // 드래그 종료되면 hover 상태 초기화 가능
            }
          }}
        />
      </div>

      {/* 안내 문구 */}
      <p className="mb-6 z-10 relative text-center text-lg font-medium">
        편지를 드래그 해보세요
      </p>

      {/* 캐릭터 */}
      <Character isEating={isEating} isHover={isHover} ref={characterRef} />
    </div>
  );
}
