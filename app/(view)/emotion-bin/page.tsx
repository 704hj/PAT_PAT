"use client";

import { useRef, useState } from "react";
import Character from "./components/character";
import DraggableLetter from "./components/draggableLetter";

export default function EmotionTrashPage() {
  const [isEating, setIsEating] = useState(false);
  const [isHover, setIsHover] = useState(false);
  const [showBubble, setShowBubble] = useState(false);

  const characterRef = useRef<HTMLDivElement>(null);

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center bg-cover bg-center bg-no-repeat text-[#cdcdcd] px-6 py-8"
      style={{
        backgroundImage: `url(/images/bg/bg1.png)`,
      }}
    >
      {/* 안내 문구 */}
      {/* <p className="mb-4 text-center text-lg font-semibold max-w-xs">
        {isEating ? "정리하는 중입니다..." : ""}
      </p> */}

      {/* 캐릭터 */}
      <div className="absolute inset-0 flex justify-center items-end bottom-1/3">
        <div className="relative mb-4 left-1/4 " ref={characterRef}>
          <img
            src="/images/icon/cat.png"
            alt="character"
            className="max-w-[70%] h-auto transition-transform duration-150  ease-out active:translate-y-1 active:scale-95 cursor-pointer"
            onClick={() => setShowBubble((prev) => !prev)}
          />

          {/* 말풍선 */}
          {showBubble && (
            <div className="absolute bottom-full left-1/4 -translate-x-1/2 w-max max-w-xs bg-white text-black text-sm px-3 py-2 rounded-lg shadow-lg border border-gray-200 text-center">
              안좋은 일 안좋은일 안좋은 일
              <div
                className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0
            border-l-4 border-l-transparent border-r-4 border-r-transparent border-t-4 border-t-white"
              ></div>
            </div>
          )}
        </div>
      </div>

      {/* 드래그 조각 영역 */}
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

      {/* 캐릭터 영역 */}
      {/* <div className="w-full max-w-xs h-48 flex items-center justify-center">
        <Character isEating={isEating} isHover={isHover} ref={characterRef} />
      </div> */}
    </div>
  );
}
