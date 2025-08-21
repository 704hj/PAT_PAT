"use client";

import Memo from "@/app/components/memoModal";
import { useState } from "react";

export default function HomePage() {
  const [showMemo, setShowMemo] = useState(false);

  return (
    // 페이지는 스크롤 가능
    <div className="relative min-h-[100svh] overflow-x-hidden">
      {/*배경 : 9:16 비율 고정 */}
      <section
        className="
          relative mx-auto w-full max-w-[480px] aspect-[9/16]
           bg-no-repeat bg-contain bg-center
        "
      >
        {/* 캐릭터는 '같은 배경'의 absolute 자식 */}
        {/* 고양이 */}
        <button
          type="button"
          className="
            absolute z-30 flex justify-center items-end
            top-[70%] left-[50%] -translate-x-[10%] -translate-y-[47%]
          "
          onClick={() => setShowMemo(true)}
        >
          <img
            src="/images/icon/cat.png"
            alt="cat"
            className="max-w-[50%] h-auto transition-transform duration-150 ease-out active:translate-y-1 active:scale-95"
            draggable={false}
          />
        </button>

        {/* 사람 */}
        <button
          type="button"
          className="
            absolute z-30 flex justify-center items-end
            top-[67%] left-[40%] -translate-x-[50%] -translate-y-[47%]
          "
          onClick={() => setShowMemo(true)}
        >
          <img
            src="/images/icon/girl2.png"
            alt="girl"
            className="max-w-[80%] h-auto transition-transform duration-150 ease-out active:translate-y-1 active:scale-95"
            draggable={false}
          />
        </button>
      </section>

      {showMemo && <Memo onClick={() => setShowMemo((prev) => !prev)} />}
    </div>
  );
}
