"use client";

import Memo from "@/app/components/memoModal";
import { useState } from "react";

export default function HomePage() {
  const [showMemo, setShowMemo] = useState<boolean>(false);

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center">
      {/* 고양이 캐릭터 */}
      <div className="grid-cols-2">
        <div
          className="absolute inset-0 flex justify-center items-end z-30"
          style={{
            top: "20%",
            left: "60%",
            transform: "translate(-20%, -50%)",
          }}
        >
          <div className="relative mb-4">
            <img
              src="/images/icon/cat.png"
              alt="character"
              className="max-w-[50%] h-auto transition-transform duration-150 ease-out active:translate-y-1 active:scale-95 cursor-pointer"
              onClick={() => setShowMemo(true)}
            />
          </div>
        </div>

        {/* 사람 캐릭터 */}
        <div
          className="absolute inset-0 flex justify-center items-end  z-30"
          style={{
            top: "65%",
            left: "20%",
            transform: "translate(-20%, -50%)",
          }}
        >
          <div className="relative mb-4 ">
            <img
              src="/images/icon/girl2.png"
              alt="character"
              className="h-auto transition-transform duration-150 ease-out active:translate-y-1 active:scale-95 cursor-pointer"
              onClick={() => setShowMemo(true)}
            />
          </div>
        </div>
      </div>
      {/* 모달 */}
      {showMemo && (
        <Memo
          onClick={() => {
            setShowMemo((prev) => !prev);
          }}
        />
      )}
    </div>
  );
}
