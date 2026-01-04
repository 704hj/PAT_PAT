"use client";

import { Pt, samplePolyline } from "@/lib/zodiac";
import { useMemo } from "react";

type ConstellationSvgProps = {
  anchorPoints: Pt[]; // 앵커 포인트 (염소자리 등)
  daysCount: number; // 시즌 일수
  entries: Record<string, { content: string }>; // 날짜별 글
  dates: string[]; // 날짜 리스트 (순서대로)
  todayDate: string; // "YYYY-MM-DD" 형식의 오늘 날짜
  onStarClick?: (date: string, index: number) => void;
};

export default function ConstellationSvg({
  anchorPoints,
  daysCount,
  entries,
  dates,
  todayDate,
  onStarClick,
}: ConstellationSvgProps) {
  // 앵커 포인트를 시즌 일수만큼 샘플링
  const starPoints = useMemo(() => {
    if (!anchorPoints || anchorPoints.length === 0 || daysCount === 0) {
      console.warn("[ConstellationSvg] Invalid anchorPoints or daysCount:", {
        anchorPointsLength: anchorPoints?.length,
        daysCount,
      });
      return [];
    }
    const points = samplePolyline(anchorPoints, daysCount);
    console.log("[ConstellationSvg] Generated star points:", points.length);
    return points;
  }, [anchorPoints, daysCount]);

  // 각 별의 상태 계산
  const starStates = useMemo(() => {
    return dates.map((date, index) => {
      const hasEntry = !!entries[date];
      const isToday = date === todayDate;
      return {
        date,
        index,
        hasEntry,
        isToday,
        isActive: hasEntry || isToday,
        brightness: isToday && hasEntry ? 1.0 : hasEntry ? 0.7 : 0.3,
      };
    });
  }, [dates, entries, todayDate]);

  if (starPoints.length === 0) {
    return (
      <div className="text-white/60 text-sm text-center py-8">
        별자리 데이터가 없습니다.
      </div>
    );
  }

  return (
    <svg
      viewBox="0 0 100 100"
      className="w-full h-auto min-h-[300px]"
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label="별자리"
    >
      <defs>
        {/* 글로우 필터 */}
        <filter id="starGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="1" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* 오늘 별 글로우 (더 강함) */}
        <filter id="todayGlow" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="2" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* 연결선 그라디언트 */}
        <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.4)" />
          <stop offset="50%" stopColor="rgba(255,255,255,0.6)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0.4)" />
        </linearGradient>
      </defs>

      {/* 연결선 */}
      {starPoints.slice(0, -1).map((p, i) => {
        const q = starPoints[i + 1];
        const state1 = starStates[i];
        const state2 = starStates[i + 1];
        const isActive = state1.isActive && state2.isActive;

        return (
          <line
            key={`line-${i}`}
            x1={p.x}
            y1={p.y}
            x2={q.x}
            y2={q.y}
            stroke="rgba(255,255,255,0.4)"
            strokeWidth={isActive ? 0.3 : 0.15}
            strokeOpacity={isActive ? 0.8 : 0.3}
            strokeLinecap="round"
          />
        );
      })}

      {/* 별들 */}
      {starPoints.map((point, index) => {
        const state = starStates[index];
        const hasEntry = state.hasEntry;
        const isToday = state.isToday;
        const brightness = state.brightness;

        return (
          <g key={`star-${index}`}>
            {/* 글로우 레이어 (오늘 + 글 있음) */}
            {isToday && hasEntry && (
              <circle
                cx={point.x}
                cy={point.y}
                r={3}
                fill="rgba(255,255,255,0.3)"
                filter="url(#todayGlow)"
                style={{ pointerEvents: "none" }}
              />
            )}

            {/* 별 원 */}
            <circle
              cx={point.x}
              cy={point.y}
              r={hasEntry ? (isToday ? 2.5 : 2) : 1.5}
              fill="rgba(255,255,255,1)"
              fillOpacity={brightness}
              filter={isToday && hasEntry ? "url(#starGlow)" : undefined}
              style={{ cursor: "pointer", transition: "all 0.3s ease" }}
              onClick={() => onStarClick?.(state.date, index)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onStarClick?.(state.date, index);
                }
              }}
              tabIndex={0}
              role="button"
              aria-label={`${state.date} ${hasEntry ? "글 있음" : "글 없음"}`}
            />

            {/* 내부 점 (더 밝게) */}
            {hasEntry && (
              <circle
                cx={point.x}
                cy={point.y}
                r={isToday ? 1.2 : 1}
                fill="rgba(255,255,255,1)"
                style={{ pointerEvents: "none" }}
              />
            )}
          </g>
        );
      })}
    </svg>
  );
}
