"use client";
import { TStar } from "@/types/memory/star";
import { useEffect, useMemo, useState } from "react";
import {
  daysInMonth,
  loadTemplates,
  resolveZodiacByDate,
  type ZodiacTemplate,
} from "../../lib/zodiac";

export default function ConstellationCanvas({
  userId = "demoUser",
  date = new Date(),
  star,
}: {
  userId?: string;
  date?: Date;
  star?: TStar | null;
}) {
  const [z, setZ] = useState<ZodiacTemplate | null>(null);

  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const days = daysInMonth(year, month);

  useEffect(() => {
    if (star) {
      setZ({
        zodiac_code: star.star_code,
        name_ko: star.name_ko,
        start_mmdd: star.start_day,
        end_mmdd: star.end_day,
        primary_month: star.primary_month,
        points: star.points,
        edges: star.edges,
        path_index: star.path_index,
      } as unknown as ZodiacTemplate);
      return;
    }
    (async () => {
      const templates = await loadTemplates();
      const target = resolveZodiacByDate(date, templates);
      setZ(target);
    })();
  }, [star, date]);

  const nodes = z?.points ?? [];
  const edges = z?.edges ?? [];

  const selectedNodes = useMemo(() => {
    const s = new Set<number>();
    return s;
  }, []);

  if (nodes.length === 0) {
    return <svg viewBox="0 0 100 100" className="w-full h-auto" />;
  }

  return (
    <svg
      viewBox="0 0 100 100"
      className="w-full h-auto"
      preserveAspectRatio="xMidYMid meet"
      role="img"
    >
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
      {nodes.map((p, i) => (
        <circle
          key={`n-${i}`}
          cx={p.x}
          cy={p.y}
          r={1.1}
          fill="rgba(255,255,255,0.25)"
        />
      ))}
      {Array.from(selectedNodes).map((i) => {
        const p = nodes[i];
        return <circle key={`s-${i}`} cx={p.x} cy={p.y} r={2} fill="#FFC43D" />;
      })}
    </svg>
  );
}
