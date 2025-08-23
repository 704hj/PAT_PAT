"use client";
import Memo from "@/app/components/memoModal";
import React, { useRef, useState } from "react";
import RandomStar from "./components/randomStar";
import { TPositionProps } from "@/app/types/memory/star";

export default function page() {
  const [showMemo, setShowMemo] = useState<boolean>(false);

  // RandomStar에 넘길 값
  const baseSize = 300;
  const xLimit = 1920;
  const yLimit = 1080;

  // 아이콘들이 자리 잡을 때 겹침 방지 등에 쓰는 저장소 (필요 시)
  const positionsRef = useRef<TPositionProps[]>([]);

  return (
    // <div className="relative min-h-screen">
    <div>
      {/* <img
        src="/images/bg/long.png"
        alt="background"
        className="w-auto h-auto min-h-screen object-cover"
      /> */}
      {/* 랜덤 아이콘 하나 띄우고 클릭 시 모달 오픈 */}
      <RandomStar
        id="star-1"
        baseSize={baseSize}
        xLimit={xLimit}
        yLimit={yLimit}
        onClick={() => setShowMemo(true)}
        positions={positionsRef.current}
      />
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
