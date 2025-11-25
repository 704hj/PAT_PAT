import { useState } from "react";

export default function MoodSelector() {
  const moods = [
    "행복해",
    "즐거워",
    "짜증나",
    "따분해",
    "그리워",
    "화가나",
    "우울해",
    "슬퍼",
    "따뜻해",
    "분노",
    "행복해",
    "즐거워",
    "짜증나",
    "따분해",
  ];

  const [selected, setSelected] = useState("그리워");

  return (
    <div className="w-full py-6">
      <span className="text-white text-[16px] font-bold ">
        오늘의 Mood 확인하기
      </span>

      <div className="w-full overflow-x-auto mt-2.5 scroll-color pb-6">
        <div
          className="
      grid
      grid-rows-2
      grid-flow-col
      auto-cols-max       /* 각 컬럼 폭 = 내용 크기만큼 */
      gap-x-4 gap-y-3

    "
        >
          {moods.map((mood, idx) => (
            <button
              key={mood + idx}
              onClick={() => setSelected(mood)}
              className={`
          px-3 py-1 rounded-4xl text-[12px]
          whitespace-nowrap          
          transition-all
          ${
            selected === mood
              ? "bg-gradient-to-b from-[#6F8CE0] to-[#526AC1] text-white shadow-lg"
              : "bg-white/10 backdrop-blur-md text-white/60"
          }
        `}
            >
              {mood}
            </button>
          ))}
        </div>
        {/* 왼쪽 페이드 */}
        <div
          className="pointer-events-none absolute left-0 top-0 h-full w-6 
                  bg-gradient-to-r from-[#0B183D] to-transparent"
        />

        {/* 오른쪽 페이드 */}
        <div
          className="pointer-events-none absolute right-0 top-0 h-full w-6 
                  bg-gradient-to-l from-[#0B183D] to-transparent"
        />
      </div>
    </div>
  );
}
