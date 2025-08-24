"use client";

import Link from "next/link";
import { memo, useRef, useState } from "react";
import { Journal } from "../page";

const moodIcon: Record<string, string> = {
  contentment: "/images/icon/emotion/pos/contentment.png",
  excited: "/images/icon/emotion/pos/exited.png",
  happy: "/images/icon/emotion/pos/happy.png",
  joy: "/images/icon/emotion/pos/joy.png",
  love: "/images/icon/emotion/pos/love.png",
  anger: "/images/icon/emotion/neg/anger.png",
  sad: "/images/icon/emotion/neg/sad.png",
  anxious: "/images/icon/emotion/neg/anxious.png",
};

export const JournalCard = memo(function JournalCard({
  e,
  onPin,
  onDelete,
  onShare,
}: {
  e: Journal;
  onPin: () => void;
  onDelete: () => void;
  onShare: () => void;
}) {
  const [dx, setDx] = useState(0);
  const startX = useRef(0);
  const dragging = useRef(false);
  const [pinned, setPinned] = useState<boolean>(!!e.pinned);

  const onPointerDown = (ev: React.PointerEvent) => {
    dragging.current = true;
    startX.current = ev.clientX;
    (ev.target as HTMLElement).setPointerCapture?.(ev.pointerId);
  };
  const onPointerMove = (ev: React.PointerEvent) => {
    if (!dragging.current) return;
    const delta = ev.clientX - startX.current;
    setDx(Math.max(Math.min(delta, 88), -88)); // -88~88 : 액션 영역 폭과 일치
  };
  const onPointerUp = () => {
    dragging.current = false;
    if (Math.abs(dx) > 60) setDx(dx > 0 ? 88 : -88);
    else setDx(0);
  };

  return (
    <div className="relative mb-2.5">
      {" "}
      {/* 리스트 간격 규격화 */}
      {/* 배경 액션 */}
      <div className="absolute inset-0 rounded-[14px] overflow-hidden select-none pointer-events-none">
        {/* 왼쪽: Pin / Share */}
        {/* 왼쪽: Pin / Share */}
        <div className="absolute inset-y-0 left-0 w-[72px] flex items-center gap-2 pl-2">
          {/* 고정 */}
          <button
            onClick={onPin}
            aria-label={pinned ? "고정 해제" : "상단 고정"}
            className="h-9 w-9 rounded-lg flex items-center justify-center
               bg-white/6 border border-white/12 text-white/70
               hover:text-yellow-300 hover:border-yellow-300/40
               transition active:scale-95"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="1.6"
              fill="none"
            >
              <path d="M14 3l-2 2 5 5-2 2-5-5-2 2" />
              <path d="M12 14l-7 7" />
            </svg>
          </button>

          {/* 공유 */}
          <button
            onClick={onShare}
            aria-label="공유"
            className="h-9 w-9 rounded-lg flex items-center justify-center
               bg-white/6 border border-white/12 text-white/70
               hover:text-cyan-300 hover:border-cyan-400/40
               transition active:scale-95"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="1.6"
              fill="none"
            >
              <path d="M18 8a3 3 0 1 0-2.83-4" />
              <path d="M6 14a3 3 0 1 0 2.83 4" />
              <path d="M8 14l8-4M8 10l8 4" />
            </svg>
          </button>
        </div>

        {/* 오른쪽: Delete */}
        <div className="absolute inset-y-0 right-0 w-[72px] flex items-center justify-end pr-2">
          <button
            onClick={onDelete}
            aria-label="삭제"
            className="h-9 w-9 rounded-lg flex items-center justify-center
               bg-white/6 border border-white/12 text-white/70
               hover:text-red-400 hover:border-red-400/40
               transition active:scale-95"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="1.6"
              fill="none"
            >
              <path d="M3 6h18M8 6V4h8v2" />
              <path d="M9 6v14a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2V6" />
            </svg>
          </button>
        </div>
      </div>
      {/* 포그라운드 카드 (스와이프) */}
      <div
        className="
          rounded-[14px] border border-white/12 bg-white/6 backdrop-blur
          px-4 py-3.5
          transition-[transform] will-change-transform touch-pan-y
          shadow-[0_4px_12px_rgba(7,17,40,0.18)]
        "
        style={{ transform: `translateX(${dx}px)` }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        <Link href={`/lumi/journal/${e.id}`} className="block">
          <div className="flex items-start gap-3.5">
            {/* 무드 아이콘 */}
            <div className="shrink-0 mt-0.5">
              <div className="relative w-9 h-9 rounded-xl bg-white/8 border border-white/12 flex items-center justify-center overflow-hidden">
                {e.mood ? (
                  <img
                    src={moodIcon[e.mood]}
                    alt={e.mood}
                    className="w-[20px] h-[20px] object-contain"
                  />
                ) : (
                  <span className="text-white/60 text-[11px]">-</span>
                )}
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(255,255,255,0.12),transparent_60%)]"
                />
              </div>
            </div>

            {/* 본문 */}
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span
                  className={[
                    "inline-flex items-center gap-1 px-2 h-6 rounded-full text-[11px] border",
                    e.type === "star"
                      ? "border-cyan-300/40 text-cyan-100 bg-cyan-300/10"
                      : "border-white/18 text-white/80 bg-white/6",
                  ].join(" ")}
                >
                  {e.type === "star" ? "오늘의 별" : "걱정 내려놓기"}
                </span>
                {pinned && (
                  <span className="text-[11px] text-yellow-300/90">고정됨</span>
                )}
                <span className="text-white/55 text-[12px]">{e.time}</span>
              </div>

              <p className="mt-1 text-white/90 text-[14px] leading-[1.45] line-clamp-2 break-keep">
                {e.text}
              </p>

              {e.tags && e.tags.length > 0 && (
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  {e.tags.map((t) => (
                    <span
                      key={t}
                      className="px-2 h-6 rounded-full text-[11px] bg-white/6 text-white/75 border border-white/10"
                    >
                      #{t}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* 화살표 */}
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              className="text-white/70 shrink-0 mt-1"
            >
              <path
                d="M9 5l7 7-7 7"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                fill="none"
              />
            </svg>
          </div>
        </Link>
      </div>
    </div>
  );
});
