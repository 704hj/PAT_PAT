// app/(view)/lumi/components/constellationCanvas.tsx
"use client";
import { useEffect, useMemo, useState } from "react";
import {
  loadTemplates,
  resolveZodiacByDate,
  daysInMonth,
  loadMonthStarsMock,
  type ZodiacTemplate,
} from "../../../lib/zodiac";

function dayToNodeIndex(day1: number, days: number, nodeCount: number) {
  if (nodeCount <= 1 || days <= 1) return 0;
  const t = (day1 - 1) / (days - 1);
  return Math.round(t * (nodeCount - 1));
}

export default function ConstellationCanvas({
  userId = "demoUser",
  date = new Date(),
}: {
  userId?: string;
  date?: Date;
}) {
  const [z, setZ] = useState<ZodiacTemplate | null>(null);
  const [stars, setStars] = useState<ReturnType<typeof loadMonthStarsMock>>([]);

  // 항상 같은 순서/개수의 훅 호출
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const days = daysInMonth(year, month);

  // z가 없어도 빈 배열로 처리 -> 훅은 항상 호출됨
  const nodes = z?.points ?? [];
  const edges = z?.edges ?? [];

  const selectedNodes = useMemo(() => {
    const s = new Set<number>();
    for (const r of stars) {
      s.add(dayToNodeIndex(r.dayIndex + 1, days, nodes.length));
    }
    return s;
  }, [stars, days, nodes.length]);

  useEffect(() => {
    (async () => {
      const templates = await loadTemplates();
      const target = resolveZodiacByDate(date, templates);
      setZ(target);
      setStars(loadMonthStarsMock(userId, year, month));
    })();
  }, [userId, date, year, month]);

  // 렌더
  if (nodes.length === 0) {
    // hooks는 위에서 이미 다 호출됐으므로 여기서 early return 가능
    return <svg viewBox="0 0 100 100" className="w-full h-auto" />;
  }

  return (
    <svg
      viewBox="0 0 100 100"
      className="w-full h-auto"
      preserveAspectRatio="xMidYMid meet"
      role="img"
    >
      {/* 윤곽선 */}
      {edges.map(([a, b], i) => {
        const p = nodes[a],
          q = nodes[b];
        if (!p || !q) return null;
        return (
          <line
            key={`e-${i}`}
            x1={p.x}
            y1={p.y}
            x2={q.x}
            y2={q.y}
            stroke="rgba(255,255,255,0.28)"
            strokeWidth={0.6}
            strokeLinecap="round"
          />
        );
      })}

      {/* 모든 노드(연한 점) */}
      {nodes.map((p, i) => (
        <circle
          key={`n-${i}`}
          cx={p.x}
          cy={p.y}
          r={1.1}
          fill="rgba(255,255,255,0.25)"
        />
      ))}

      {/* 저장된 날 → 매핑된 노드만 강조 */}
      {Array.from(selectedNodes).map((i) => {
        const p = nodes[i];
        const related = stars.filter(
          (s) => dayToNodeIndex(s.dayIndex + 1, days, nodes.length) === i
        );
        const isSpecial = related.some((r) => r.isSpecial);
        const avgIntensity =
          related.reduce((a, r) => a + (r.intensity ?? 3), 0) /
          Math.max(1, related.length);
        const r = 1.6 + avgIntensity * 0.7;
        return (
          <circle
            key={`star-${i}`}
            cx={p.x}
            cy={p.y}
            r={r}
            fill={isSpecial ? "#9b5de5" : "#FFC43D"}
          />
        );
      })}
    </svg>
  );
}
