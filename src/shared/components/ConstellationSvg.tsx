'use client';

import { Pt, samplePolyline } from '@/lib/zodiac';
import { useMemo } from 'react';

export type StarThemeType = 'default' | 'healing' | 'warm' | 'deep' | 'lumi';

type ConstellationSvgProps = {
  anchorPoints: Pt[]; // 앵커 포인트 (염소자리 등)
  daysCount: number; // 시즌 일수
  entries: Record<
    string,
    {
      content: string;
      emotion_polarity?: string;
      emotion_intensity?: number | null;
    }
  >; // 날짜별 글
  dates: string[]; // 날짜 리스트 (순서대로)
  todayDate: string; // "YYYY-MM-DD" 형식의 오늘 날짜
  onStarClick?: (date: string, index: number) => void;
  theme?: StarThemeType; // 추가된 테마 prop
};

const THEMES: Record<StarThemeType, { positive: string; negative: string }> = {
  default: { positive: '#2563EB', negative: '#DC2626' },
  healing: { positive: '#2DD4BF', negative: '#A78BFA' }, // 에메랄드 민트 & 라벤더 퍼플
  warm: { positive: '#FDE68A', negative: '#FB7185' }, // 샴페인 골드 & 소프트 로즈
  deep: { positive: '#22D3EE', negative: '#94A3B8' }, // 시안 아쿠아 & 인디고 실버
  lumi: { positive: '#A6CAF6', negative: '#E78F3D' }, // 실제 별의 온도 기반
};

function getStarColor(
  polarity: string | undefined,
  intensity: number | null | undefined,
  theme: StarThemeType
): string {
  if (!polarity || polarity === 'UNSET') return 'rgba(255,255,255,1)';

  const colors = THEMES[theme];
  const baseColor = polarity === 'POSITIVE' ? colors.positive : colors.negative;

  if (theme === 'default') {
    // 기존 로직 유지 (파랑/빨강 대비)
    if (polarity === 'POSITIVE') {
      if (intensity != null && intensity >= 4) return '#1E3A8A';
      if (intensity === 3) return '#2563EB';
      return '#93C5FD';
    }
    if (polarity === 'NEGATIVE') {
      if (intensity != null && intensity >= 4) return '#991B1B';
      if (intensity === 3) return '#DC2626';
      return '#FCA5A5';
    }
  }

  // 다른 테마들은 기본 컬러를 기준으로 투명도나 밝기만 조절하여 일관성 유지
  return baseColor;
}

// 색상별, 강도별 글로우 필터 ID 반환
function getGlowFilterId(
  polarity: string | undefined,
  intensity: number | null | undefined,
  theme: StarThemeType
): string {
  if (!polarity || polarity === 'UNSET') return 'defaultGlow';
  const intensityLevel =
    intensity != null && intensity >= 4
      ? 'strong'
      : intensity === 3
        ? 'medium'
        : 'weak';
  return `${theme}-${polarity.toLowerCase()}Glow${intensityLevel}`;
}

export default function ConstellationSvg({
  anchorPoints,
  daysCount,
  entries,
  dates,
  todayDate,
  onStarClick,
  theme = 'default',
}: ConstellationSvgProps) {
  const starPoints = useMemo(() => {
    if (!anchorPoints || anchorPoints.length === 0 || daysCount === 0)
      return [];
    return samplePolyline(anchorPoints, daysCount);
  }, [anchorPoints, daysCount]);

  const starStates = useMemo(() => {
    return dates.map((date, index) => {
      const entry = entries[date];
      const hasEntry = !!entry;
      const isToday = date === todayDate;
      const starColor = hasEntry
        ? getStarColor(entry.emotion_polarity, entry.emotion_intensity, theme)
        : 'rgba(255,255,255,1)';
      return {
        date,
        index,
        hasEntry,
        isToday,
        isActive: hasEntry || isToday,
        brightness: isToday && hasEntry ? 1.0 : hasEntry ? 0.7 : 0.3,
        starColor,
      };
    });
  }, [dates, entries, todayDate, theme]);

  // 테마별 컬러 추출
  const themeColors = THEMES[theme];

  return (
    <svg
      viewBox="0 0 100 100"
      className="w-full h-auto min-h-[300px]"
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <filter id="defaultGlow" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="1" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* 테마별 동적 필터 생성 */}
        {(['POSITIVE', 'NEGATIVE'] as const).map((pol) =>
          (['strong', 'medium', 'weak'] as const).map((lv) => {
            const color =
              pol === 'POSITIVE' ? themeColors.positive : themeColors.negative;
            const stdDev = lv === 'strong' ? 3.5 : lv === 'medium' ? 2 : 1;
            const opacity = lv === 'strong' ? 0.9 : lv === 'medium' ? 0.7 : 0.5;

            return (
              <filter
                key={`${theme}-${pol}-${lv}`}
                id={`${theme}-${pol.toLowerCase()}Glow${lv}`}
                x="-150%"
                y="-150%"
                width="400%"
                height="400%"
              >
                <feGaussianBlur stdDeviation={stdDev} result="blur" />
                <feFlood
                  floodColor={color}
                  floodOpacity={opacity}
                  result="color"
                />
                <feComposite
                  in="color"
                  in2="blur"
                  operator="in"
                  result="glow"
                />
                <feMerge>
                  <feMergeNode in="glow" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            );
          })
        )}

        {starPoints.map((_, index) => {
          const state = starStates[index];
          const entry = entries[state.date];
          const intensity = entry?.emotion_intensity;
          let op = !state.hasEntry
            ? 0.5
            : intensity != null && intensity >= 4
              ? 1
              : intensity === 3
                ? 0.8
                : 0.6;

          return (
            <radialGradient
              key={`starGrad-${index}`}
              id={`starGrad-${index}-${theme}`}
              cx="50%"
              cy="50%"
              r="50%"
            >
              <stop offset="0%" stopColor={state.starColor} stopOpacity={op} />
              <stop offset="100%" stopColor={state.starColor} stopOpacity="0" />
            </radialGradient>
          );
        })}
      </defs>

      {/* 연결선 */}
      {starPoints.slice(0, -1).map((p, i) => {
        const q = starPoints[i + 1];
        const isActive = starStates[i].isActive && starStates[i + 1].isActive;
        return (
          <line
            key={`line-${i}`}
            x1={p.x}
            y1={p.y}
            x2={q.x}
            y2={q.y}
            stroke="white"
            strokeWidth={isActive ? 0.3 : 0.1}
            strokeOpacity={isActive ? 0.6 : 0.2}
          />
        );
      })}

      {/* 별들 */}
      {starPoints.map((point, index) => {
        const state = starStates[index];
        const entry = entries[state.date];
        const glowId = state.hasEntry
          ? getGlowFilterId(
              entry.emotion_polarity,
              entry.emotion_intensity,
              theme
            )
          : 'defaultGlow';
        const r = !state.hasEntry
          ? 1.2
          : entry.emotion_intensity != null && entry.emotion_intensity >= 4
            ? 3.5
            : 2.5;

        return (
          <g
            key={`star-${index}`}
            onClick={() => onStarClick?.(state.date, index)}
            style={{ cursor: 'pointer' }}
          >
            <circle
              cx={point.x}
              cy={point.y}
              r={r}
              fill={`url(#starGrad-${index}-${theme})`}
              filter={`url(#${glowId})`}
            />
            <circle
              cx={point.x}
              cy={point.y}
              r={r * 0.2}
              fill="white"
              fillOpacity={state.hasEntry ? 1 : 0.5}
            />
          </g>
        );
      })}
    </svg>
  );
}
