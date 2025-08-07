"use client";

import { useRef, useState } from "react";
import DraggableLetter from "./components/draggableLetter";
import Character from "./components/character";

export default function EmotionTrashPage() {
  const [isEating, setIsEating] = useState(false);
  const characterRef = useRef<HTMLDivElement>(null);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8 bg-[#fefefe] text-[#333] relative">
      {/* 편지 위치 확보 및 절대 위치 편지 */}
      <div className="relative w-full h-40 mb-8">
        {" "}
        {/* 높이 160px 확보 + 아래 여백 */}
        <DraggableLetter
          onDrop={(letterRect) => {
            const charRect = characterRef.current?.getBoundingClientRect();
            if (charRect && letterRect) {
              const isIntersecting =
                letterRect.bottom > charRect.top &&
                letterRect.top < charRect.bottom &&
                letterRect.right > charRect.left &&
                letterRect.left < charRect.right;

              setIsEating(isIntersecting);
            }
          }}
        />
      </div>

      {/* 안내 문구 */}
      <p className="mb-6 z-10 relative text-center text-lg font-medium">
        편지를 드래그 해보세요
      </p>

      {/* 캐릭터 */}
      <Character isEating={isEating} ref={characterRef} />
    </div>
  );
}
