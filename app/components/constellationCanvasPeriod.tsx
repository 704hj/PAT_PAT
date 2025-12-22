"use client";

import { useEffect, useMemo, useState } from "react";

type Row = { day_index: number; x: number; y: number };
type Pt = { x: number; y: number };

function Defs() {
  return (
    <defs>
      <filter id="glow" x="-60%" y="-60%" width="220%" height="220%">
        <feGaussianBlur stdDeviation="1.1" result="b" />
        <feColorMatrix
          in="b"
          type="matrix"
          values="
            1 0 0 0 0
            0 1 0 0 0
            0 0 1 0 0
            0 0 0 2.6 0"
          result="g"
        />
        <feMerge>
          <feMergeNode in="g" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>

      <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="rgba(120,200,255,0.9)" />
        <stop offset="50%" stopColor="rgba(170,120,255,0.85)" />
        <stop offset="100%" stopColor="rgba(120,200,255,0.9)" />
      </linearGradient>

      <radialGradient id="starGlow" cx="50%" cy="50%" r="60%">
        <stop offset="0%" stopColor="rgba(255,255,255,1)" />
        <stop offset="35%" stopColor="rgba(190,240,255,0.95)" />
        <stop offset="100%" stopColor="rgba(120,200,255,0)" />
      </radialGradient>
    </defs>
  );
}

export default function ConstellationCanvasPeriod({
  periodId,
}: {
  periodId: number;
}) {
  const [nodes, setNodes] = useState<Pt[]>([]);
  const [revealedCount, setRevealedCount] = useState(0);

  // 1) 좌표 로드
  useEffect(() => {
    if (!periodId) return;

    (async () => {
      const res = await fetch(`/api/constellation/period/${periodId}/points`, {
        cache: "no-store",
      });
      const json = await res.json();

      if (!json.ok) {
        setNodes([]);
        return;
      }

      const rows: Row[] = json.data ?? [];
      // 이상값 필터링 (혹시라도 0,0이 섞이면 모양이 깨져서 제거)
      const pts = rows
        .filter((r) => Number.isFinite(r.x) && Number.isFinite(r.y))
        .map((r) => ({ x: r.x, y: r.y }));

      setNodes(pts);
    })();
  }, [periodId]);

  // 2) 진행도 로드(entry_count)
  useEffect(() => {
    if (!periodId) return;

    (async () => {
      const res = await fetch(
        `/api/constellation/period/${periodId}/progress`,
        {
          cache: "no-store",
        }
      );
      const json = await res.json();
      if (!json.ok) return setRevealedCount(0);
      setRevealedCount(Number(json.entry_count ?? 0));
    })();
  }, [periodId]);

  const activeSet = useMemo(() => {
    const n = Math.min(nodes.length, Math.max(0, revealedCount));
    return new Set(Array.from({ length: n }, (_, i) => i));
  }, [nodes.length, revealedCount]);

  if (nodes.length < 2) {
    return (
      <svg viewBox="0 0 100 100" className="w-full h-auto">
        <Defs />
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 100 100"
      className="w-full h-auto"
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label="constellation"
    >
      <Defs />

      {/* 선: 연속 연결 */}
      {nodes.slice(0, -1).map((p, i) => {
        const q = nodes[i + 1];
        const active = activeSet.has(i) && activeSet.has(i + 1);

        return (
          <g key={`e-${i}`} opacity={active ? 1 : 0.22} filter="url(#glow)">
            {/* glow layer */}
            <line
              x1={p.x}
              y1={p.y}
              x2={q.x}
              y2={q.y}
              stroke="url(#lineGrad)"
              strokeWidth={1.8}
              strokeLinecap="round"
              opacity={0.18}
            />
            {/* core layer */}
            <line
              x1={p.x}
              y1={p.y}
              x2={q.x}
              y2={q.y}
              stroke="rgba(235,250,255,0.9)"
              strokeWidth={0.6}
              strokeLinecap="round"
              opacity={0.9}
            />
          </g>
        );
      })}

      {/* 점 */}
      {nodes.map((p, i) => {
        const active = activeSet.has(i);

        return (
          <g key={`n-${i}`} filter="url(#glow)" opacity={active ? 1 : 0.35}>
            <circle
              cx={p.x}
              cy={p.y}
              r={active ? 3.4 : 2.4}
              fill="url(#starGlow)"
              opacity={active ? 0.95 : 0.25}
            />
            <circle
              cx={p.x}
              cy={p.y}
              r={active ? 1.25 : 0.95}
              fill={active ? "rgba(255,255,255,1)" : "rgba(255,255,255,0.65)"}
            />
          </g>
        );
      })}
    </svg>
  );
}
