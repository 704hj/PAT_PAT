'use client';

import { Pt, samplePolyline } from '@/lib/zodiac';
import { useMemo } from 'react';

export type StarThemeType = 'default' | 'healing' | 'warm' | 'deep' | 'lumi';

type ConstellationSvgProps = {
  anchorPoints?: Pt[];
  starPoints?: Pt[];   // DB에서 가져온 좌표 (있으면 anchorPoints 대신 사용)
  daysCount?: number;
  entries: Record<
    string,
    {
      content: string;
      emotion_polarity?: string;
      emotion_intensity?: number | null;
      star_color_hex?: string;
    }
  >;
  dates: string[];
  todayDate: string;
  onStarClick?: (date: string, index: number) => void;
  theme?: StarThemeType;
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
  theme: StarThemeType,
  starColorHex?: string,
): string {
  if (starColorHex) return starColorHex;
  if (!polarity || polarity === 'UNSET') return 'rgba(255,255,255,1)';

  const colors = THEMES[theme];
  const baseColor = polarity === 'POSITIVE' ? colors.positive : colors.negative;

  if (theme === 'default') {
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

  return baseColor;
}

function getGlowFilterId(
  polarity: string | undefined,
  intensity: number | null | undefined,
  theme: StarThemeType,
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
  starPoints: starPointsProp,
  daysCount,
  entries,
  dates,
  todayDate,
  onStarClick,
  theme = 'default',
}: ConstellationSvgProps) {
  const starPoints = useMemo(() => {
    if (starPointsProp && starPointsProp.length > 0) return starPointsProp;
    if (!anchorPoints || anchorPoints.length === 0 || !daysCount) return [];
    return samplePolyline(anchorPoints, daysCount);
  }, [starPointsProp, anchorPoints, daysCount]);

  const starStates = useMemo(() => {
    return dates.map((date, index) => {
      const entry = entries[date];
      const hasEntry = !!entry;
      const isToday = date === todayDate;
      const starColor = hasEntry
        ? getStarColor(entry.emotion_polarity, entry.emotion_intensity, theme, entry.star_color_hex)
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
                <feFlood floodColor={color} floodOpacity={opacity} result="color" />
                <feComposite in="color" in2="blur" operator="in" result="glow" />
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
          // 기록 있는 별: 흰 코어 → 감정색 → 투명 (실제 별의 코로나 효과)
          // 기록 없는 별: 흰색 → 옅은 흰색 → 투명
          const colorStop = state.hasEntry ? state.starColor : 'rgba(200,230,255,1)';
          // 강도에 비례한 외곽 opacity (강할수록 색상이 더 진하게 퍼짐)
          const outerOp = !state.hasEntry
            ? 0.0
            : intensity != null && intensity >= 4
              ? 0.5
              : intensity === 3
                ? 0.35
                : 0.2;

          return (
            <radialGradient
              key={`starGrad-${index}`}
              id={`starGrad-${index}-${theme}`}
              cx="50%"
              cy="50%"
              r="50%"
            >
              {/* 코어: 항상 흰색 → 실제 별처럼 중심이 밝음 */}
              <stop offset="0%"   stopColor="white"     stopOpacity="1" />
              <stop offset="20%"  stopColor="white"     stopOpacity="0.9" />
              {/* 외곽: 감정 색상으로 자연스럽게 퍼짐 */}
              <stop offset="60%"  stopColor={colorStop} stopOpacity={outerOp} />
              <stop offset="100%" stopColor={colorStop} stopOpacity="0" />
            </radialGradient>
          );
        })}
      </defs>

      {/* 연결선: 글로우 + 코어 */}
      {starPoints.slice(0, -1).map((p, i) => {
        const q = starPoints[i + 1];
        const isActive = starStates[i].isActive && starStates[i + 1].isActive;
        return (
          <g key={`line-${i}`}>
            {/* 글로우 레이어 */}
            <line
              x1={p.x} y1={p.y} x2={q.x} y2={q.y}
              stroke="white"
              strokeWidth={isActive ? 1.2 : 0.4}
              strokeOpacity={isActive ? 0.12 : 0.05}
              filter="url(#defaultGlow)"
            />
            {/* 코어 레이어 */}
            <line
              x1={p.x} y1={p.y} x2={q.x} y2={q.y}
              stroke="white"
              strokeWidth={isActive ? 0.3 : 0.1}
              strokeOpacity={isActive ? 0.6 : 0.2}
            />
          </g>
        );
      })}

      {/* 별들 */}
      {starPoints.map((point, index) => {
        const state = starStates[index];
        const entry = entries[state.date];
        const glowId = state.hasEntry
          ? getGlowFilterId(entry.emotion_polarity, entry.emotion_intensity, theme)
          : 'defaultGlow';
        // 감정 강도에 비례한 크기
        const r = !state.hasEntry
          ? 1.2
          : entry.emotion_intensity != null && entry.emotion_intensity >= 4
            ? 3.5
            : entry.emotion_intensity === 3
              ? 2.5
              : 1.8;

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
