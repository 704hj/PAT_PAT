"use client";
import { useEffect, useState } from "react";
import ConstellationCanvas from "../../components/constellationCanvas";

type Star = {
  zodiac_code: string;
  name_ko: string;
  start_mmdd: string;
  end_mmdd: string;
  primary_month: string;
  points: { x: number; y: number }[];
  edges: number[][];
  path_index: number[];
};

export default function Page() {
  // 2025-12-24 (month는 0=1월, 11=12월)
  const d = new Date(2025, 11, 24);

  const [star, setStar] = useState<Star | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    fetch("/mock/star.json")
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((json: Star[] | Star) => {
        if (!alive) return;
        // 파일이 배열이면 capricorn 선택, 객체 하나면 그대로 사용
        const cap = Array.isArray(json)
          ? json.find((s) => s.zodiac_code === "capricorn") ?? null
          : (json as Star);
        setStar(cap);
      })
      .catch((e) => alive && setErr(String(e)));
    return () => {
      alive = false;
    };
  }, []);

  return (
    <main className="min-h-[100svh] px-5 pt-6">
      <h2 className="text-white/90 text-[16px] mb-3">
        이달의 별자리 : {star?.name_ko ?? "로딩 중…"}
      </h2>
      <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
        {/* ConstellationCanvas가 외부 데이터를 받을 수 있으면 star를 prop으로 전달 */}
        <ConstellationCanvas userId="demoUser" date={d} />
      </div>
      {err && (
        <p className="text-red-400 text-sm mt-2">데이터 로드 실패: {err}</p>
      )}
    </main>
  );
}
