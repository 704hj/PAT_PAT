"use client";

import { useRef, useState } from "react";
import DraggableLetter from "./draggableLetter";

export default function DiaryTestPage() {
  const [isEating, setIsEating] = useState(false);
  const [isHover, setIsHover] = useState(false);

  const characterRef = useRef<HTMLDivElement>(null);

  return (
    <div className="relative min-h-screen bg-cover bg-center bg-no-repeat bg-gray-100">
      {/* <img
        src="/images/icon/cloud_white.png"
        alt="cloud"
        className="absolute top-15 left-1/2 transform -translate-x-1/2 max-w-[30%] h-auto transition-transform duration-150 ease-out active:translate-y-2 active:scale-95"
      /> */}

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
      <div ref={characterRef}>
        <img
          src="/images/icon/trash2.png"
          alt="trash can"
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2 max-w-[40%] h-auto transition-transform duration-150 ease-out active:translate-y-2 active:scale-95 "
        />
      </div>
    </div>
  );
}
