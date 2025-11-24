"use client";

import { useRef, useState } from "react";

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

  const TRACK_WIDTH = 120;
  const THUMB_WIDTH = 40;

  const [selected, setSelected] = useState("그리워");
  const [thumbX, setThumbX] = useState(0);
  const [dragging, setDragging] = useState(false);

  const scrollRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);

  /** 리스트 스크롤 → thumb 이동 */
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const maxScroll = el.scrollWidth - el.clientWidth;
    if (maxScroll <= 0) return;

    const progress = el.scrollLeft / maxScroll;
    setThumbX((TRACK_WIDTH - THUMB_WIDTH) * progress);
  };

  /** PC 드래그 */
  const handleTrackMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!dragging || !scrollRef.current || !trackRef.current) return;

    const rect = trackRef.current.getBoundingClientRect();
    let x = e.clientX - rect.left - THUMB_WIDTH / 2;

    const maxThumb = TRACK_WIDTH - THUMB_WIDTH;
    if (x < 0) x = 0;
    if (x > maxThumb) x = maxThumb;

    setThumbX(x);

    const el = scrollRef.current;
    const maxScroll = el.scrollWidth - el.clientWidth;

    const progress = x / maxThumb;
    el.scrollLeft = maxScroll * progress;
  };

  /** 모바일 드래그 */
  const handleTrackTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!dragging || !scrollRef.current || !trackRef.current) return;

    const touch = e.touches[0];
    const rect = trackRef.current.getBoundingClientRect();
    let x = touch.clientX - rect.left - THUMB_WIDTH / 2;

    const maxThumb = TRACK_WIDTH - THUMB_WIDTH;
    if (x < 0) x = 0;
    if (x > maxThumb) x = maxThumb;

    setThumbX(x);

    const el = scrollRef.current;
    const maxScroll = el.scrollWidth - el.clientWidth;

    const progress = x / maxThumb;
    el.scrollLeft = maxScroll * progress;
  };

  return (
    <div className="w-full py-6">
      <span className="text-white text-[16px] font-bold ">
        오늘의 Mood 확인하기
      </span>

      {/* 실제 스크롤 영역 */}
      <div
        className="w-full overflow-x-auto mt-2.5 scroll-hide pb-5 relative"
        ref={scrollRef}
        onScroll={handleScroll}
      >
        <div
          className="
            grid
            grid-rows-2
            grid-flow-col
            auto-cols-max
            gap-x-4 gap-y-3
          "
        >
          {moods.map((mood, idx) => (
            <button
              key={mood + idx}
              onClick={() => setSelected(mood)}
              className={`
                px-3 py-1 rounded-4xl text-[12px] whitespace-nowrap transition-all
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
      </div>

      {/* 커스텀 스크롤바 */}
      <div
        className="mt-2 h-1 w-[160px] bg-[#6D95FF]/30 rounded-full mx-auto relative touch-none"
        ref={trackRef}
        onMouseMove={handleTrackMove}
        onMouseUp={() => setDragging(false)}
        onMouseLeave={() => setDragging(false)}
        onMouseDown={(e) => {
          setDragging(true);
          handleTrackMove(e);
        }}
        onTouchStart={() => setDragging(true)}
        onTouchMove={handleTrackTouchMove}
        onTouchEnd={() => setDragging(false)}
      >
        <div
          className="absolute top-0 h-1 w-[60px] bg-white rounded-full transition-transform"
          style={{ transform: `translateX(${thumbX}px)` }}
        />
      </div>
    </div>
  );
}
