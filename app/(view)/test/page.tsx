"use client";

import { useRef, useState } from "react";
import DraggableLetter from "./draggableLetter";

export default function DiaryTestPage() {
  const [isEating, setIsEating] = useState(false);
  const [showBubble, setShowBubble] = useState(false);
  const characterRef = useRef<HTMLDivElement>(null);

  return (
    <div
      className="relative min-h-screen bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `url(/images/bg/space.jpeg)`,
      }}
    >
      {/* 캐릭터 */}
      <div className="absolute inset-0 flex justify-center items-end">
        <div className="relative mb-4 left-1/4 " ref={characterRef}>
          <img
            src="/images/icon/simple_cat.png"
            alt="character"
            className="max-w-[40%] h-auto transition-transform duration-150 ease-out active:translate-y-1 active:scale-95 cursor-pointer"
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

      {/* 드래그 레터 */}
      <DraggableLetter
        targetRef={characterRef}
        isEating={isEating}
        onDrag={(rect) => {
          const charRect = characterRef.current?.getBoundingClientRect();
          if (charRect && rect) {
            const intersect =
              rect.bottom > charRect.top &&
              rect.top < charRect.bottom &&
              rect.right > charRect.left &&
              rect.left < charRect.right;
            // hover 감지 등 추가 로직 가능
          }
        }}
        onDragEnd={(rect) => {
          const charRect = characterRef.current?.getBoundingClientRect();
          if (charRect && rect) {
            const intersect =
              rect.bottom > charRect.top &&
              rect.top < charRect.bottom &&
              rect.right > charRect.left &&
              rect.left < charRect.right;
            setIsEating(intersect);
          }
        }}
      />
    </div>
  );
}
