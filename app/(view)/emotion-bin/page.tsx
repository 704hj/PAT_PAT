"use client";

import { useEffect, useRef, useState } from "react";
import DraggableLetter from "./components/draggableLetter";

export default function EmotionTrashPage() {
  const [isEating, setIsEating] = useState(false);
  const [darkOverlay, setDarkOverlay] = useState(true);

  const characterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => setDarkOverlay(false), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    // 페이지 스크롤 허용
    <div className="relative min-h-[100svh] overflow-x-hidden">
      {/* 스테이지: 모바일 세로 규격 고정(9:16). 필요시 max-w 조정 */}
      <section className="relative mx-auto w-full max-w-[480px] aspect-[9/16]">
        {/* 배경을 이미지로 쓰려면 아래 주석 해제 (9:16 권장) */}
        {/* <img
          src="/images/bg/room-9x16.png"
          alt=""
          className="absolute inset-0 w-full h-full object-contain pointer-events-none select-none"
          draggable={false}
        /> */}

        {/* 어두운 오버레이 */}
        {darkOverlay && (
          <div className="absolute inset-0 bg-black/50 z-20 transition-opacity duration-500 pointer-events-none" />
        )}

        {/* 고양이 */}
        <div
          ref={characterRef}
          className="absolute z-30 flex justify-center items-end
                     top-[70%] left-[50%] -translate-x-[10%] -translate-y-[47%]"
        >
          <img
            src="/images/icon/cat.png"
            alt="cat"
            className="max-w-[50%] h-auto transition-transform duration-150 ease-out active:translate-y-1 active:scale-95 cursor-pointer"
            draggable={false}
          />
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

        {/* 드래그 조각: 스테이지 안에 포함(같은 좌표계) */}
        <div className="absolute inset-0 z-40">
          <DraggableLetter
            onDrag={(letterRect) => {
              const charRect = characterRef.current?.getBoundingClientRect();
              if (!charRect || !letterRect) return;

              const isIntersecting =
                letterRect.bottom > charRect.top &&
                letterRect.top < charRect.bottom &&
                letterRect.right > charRect.left &&
                letterRect.left < charRect.right;

              // 필요시 호버 상태가 있으면 여기서 처리
              // setIsHover(isIntersecting);
            }}
            onDragEnd={(letterRect) => {
              const charRect = characterRef.current?.getBoundingClientRect();
              if (!charRect || !letterRect) return;

              const isIntersecting =
                letterRect.bottom > charRect.top &&
                letterRect.top < charRect.bottom &&
                letterRect.right > charRect.left &&
                letterRect.left < charRect.right;

              setIsEating(isIntersecting);
              // setIsHover(false);
            }}
            isEating={isEating}
          />
        </div>
      </section>

      {/* 아래에 다른 콘텐츠 섹션이 와도 정상 스크롤됩니다 */}
      {/* <section className="mx-auto max-w-[480px] px-4 py-16">...</section> */}
    </div>
  );
}
