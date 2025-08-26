"use client";

import { useEffect, useState } from "react";
import ConstellationCanvas from "../../components/constellationCanvas";

type Point = { x: number; y: number };
type Star = {
  starCode: string; // 별자리 영어 이름
  name_ko: string; // 별자리 한글 이름
  startDay: string; // "MM-DD"
  endDay: string; // "MM-DD"
  primaryMonth: string; // 별자리 해당 월
  points: Point[]; // 별자리 좌표
  edges: number[][]; // 하나의 별자리에서 별들을 이은 선
  pathIndex: number[]; //startDay-endDay
};

function mmdd(d: Date) {
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${m}-${day}`;
}

// 별자리 날짜 범위 포함 여부 (연도 경계 처리)
function inRange(target: string, start: string, end: string) {
  if (start <= end) return target >= start && target <= end; // 일반 범위
  // 연도 걸치는 범위(예: 12-22 ~ 01-19)
  return target >= start || target <= end;
}

export default function Page() {
  // 예: 2025-02-15 → 물병자리 기간
  const d = new Date(2025, 11, 15);

  const [star, setStar] = useState<Star | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    fetch("/mock/star.json", { cache: "no-store" })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((json: Star[]) => {
        if (!alive) return;
        const key = mmdd(d);
        const picked =
          json.find((s) => inRange(key, s.startDay, s.endDay)) ?? null;
        setStar(picked);
      })
      .catch((e) => alive && setErr(String(e)));

    return () => {
      alive = false;
    };
  }, [d]);

  return (
    <main className="min-h-[100svh] px-5 pt-6">
      <h2 className="text-white/90 text-[16px] mb-3">
        이달의 별자리 : {star?.name_ko ?? "로딩 중…"} <br />
        기간 : {star ? `${star?.startDay}~${star?.endDay}` : "로딩 중…"}
      </h2>
      <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
        <ConstellationCanvas userId="demoUser" date={d} star={star} />
      </div>
      {err && (
        <p className="text-red-400 text-sm mt-2">데이터 로드 실패: {err}</p>
      )}
    </main>
  );
}
