'use client';

import { Pt } from '@/lib/zodiac';

type ZodiacBadgeProps = {
  nameKo: string;
  points: Pt[];
  edges?: [number, number][];
  className?: string;
};

export default function ZodiacBadge({
  nameKo,
  points,
  edges,
  className = '',
}: ZodiacBadgeProps) {
  if (!points.length) return null;

  // 좌표를 0~100 범위로 정규화
  const xs = points.map((p) => p.x);
  const ys = points.map((p) => p.y);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  const rangeX = maxX - minX || 1;
  const rangeY = maxY - minY || 1;
  const pad = 12;

  const norm = points.map((p) => ({
    x: ((p.x - minX) / rangeX) * (100 - pad * 2) + pad,
    y: ((p.y - minY) / rangeY) * (100 - pad * 2) + pad,
  }));

  return (
    <div
      className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-white/6 border border-white/12 ${className}`}
    >
      <svg
        width="24"
        height="24"
        viewBox="0 0 100 100"
        className="opacity-80"
      >
        {/* 연결선 */}
        {edges?.map(([a, b], i) => (
          <line
            key={i}
            x1={norm[a]?.x}
            y1={norm[a]?.y}
            x2={norm[b]?.x}
            y2={norm[b]?.y}
            stroke="rgba(180,210,255,0.35)"
            strokeWidth="1.5"
          />
        ))}
        {/* 별 점 */}
        {norm.map((p, i) => (
          <g key={i}>
            <circle cx={p.x} cy={p.y} r={5} fill="rgba(180,210,255,0.15)" />
            <circle cx={p.x} cy={p.y} r={2.5} fill="rgba(210,230,255,0.9)" />
          </g>
        ))}
      </svg>
      <span className="text-[11px] text-white/70 whitespace-nowrap">
        {nameKo}
      </span>
    </div>
  );
}
