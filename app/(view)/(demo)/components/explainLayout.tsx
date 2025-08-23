"use client";
import { useState } from "react";
interface ExplainProps {
  onClick: () => void;
}
export default function ExplainLayout({ onClick }: ExplainProps) {
  const [show, setShow] = useState(true);

  return (
    <div className="absolute inset-0 z-50 pointer-events-auto">
      {/* 배경 */}
      {show && (
        <img
          src="/images/icon/line.png"
          className="absolute inset-0 w-auto h-auto z-50"
          alt=""
        />
      )}
      <button
        type="button"
        onClick={onClick}
        className="absolute top-4 right-4 z-[9999] px-3 py-1.5 rounded-xl
                   bg-black/60 text-white backdrop-blur-sm
                   hover:bg-black/70 transition"
      >
        X
      </button>
      {/* 사람 라벨 */}
      {/* {show && (
        <div className="absolute top-[66%] left-[30%] -translate-x-[0%] -translate-y-[0%]">
          <Callout stroke="lilac">
            사람을 클릭하면 메뉴가 열립니다. 행복 저장 또는 감정 쓰레기통을
            선택할 수 있습니다.
          </Callout>
        </div>
      )} */}

      {/* 고양이 라벨 */}
      {/* {show && (
        <div className="absolute top-[62%] left-[68%]">
          <Callout stroke="cream">
            고양이는 감정 쓰레기통에 버린 감정을 없애 주고, 짧은 위로를
            전합니다.
          </Callout>
        </div>
      )} */}
      {/* 모달 닫기 */}
    </div>

    // </div>
  );
}

function Callout({
  children,
  stroke = "mint",
}: {
  children: React.ReactNode;
  stroke?: "mint" | "lilac" | "cream";
}) {
  const strokeMap = {
    mint: "ring-[1.5px] ring-[#C9F0D1]",
    lilac: "ring-[1.5px] ring-[#DCD2F6]",
    cream: "ring-[1.5px] ring-[#FCEFC1]",
  } as const;

  return (
    <div
      className={[
        "text-[14px] leading-[1.4] rounded-xl px-3 py-2 max-w-[220px]",
        "bg-white/12 backdrop-blur-md shadow-[0_8px_24px_rgba(0,0,0,0.25)]",
        strokeMap[stroke],
      ].join(" ")}
    >
      {children}
    </div>
  );
}
