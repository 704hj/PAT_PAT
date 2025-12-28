"use client";

import CalendarView from "@/app/components/calendarView";
import ConstellationCanvasPeriod from "@/app/components/constellationCanvasPeriod";
import { useEffect, useState } from "react";

function toISODate(d: Date) {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export default function Page() {
  const [nowDate, setNowDate] = useState<Date>(new Date());
  const [periodId, setPeriodId] = useState<number | null>(null);

  // UI용: 타이틀/기간 (이미 star 템플릿으로도 가능하지만, 여기선 표시만 예시)
  const title = "염소자리";
  const range = "12.22–01.19";

  useEffect(() => {
    (async () => {
      const iso = toISODate(nowDate);
      const res = await fetch(`/api/constellation/period/by-date?date=${iso}`, {
        cache: "no-store",
      });
      const json = await res.json();
      if (json.ok) setPeriodId(json.data.period_id);
      else setPeriodId(null);
    })();
  }, [nowDate]);

  return (
    <main className="min-h-[100svh] text-white">
      {/* 배경 */}
      <div className="fixed inset-0 -z-10 bg-space">
        <div className="nebula nebula-a" />
        <div className="nebula nebula-b" />
        <div className="nebula nebula-c" />
        <div className="starfield" />
        <div className="vignette" />
      </div>

      <section className="mx-auto w-full max-w-[420px] px-5 pt-5 pb-28">
        {/* Top bar */}
        <header className="flex items-center justify-between">
          <button
            className="h-10 w-10 rounded-xl bg-white/5 border border-white/10 hover:bg-white/8 transition"
            aria-label="뒤로"
            onClick={() => history.back()}
          >
            ←
          </button>

          <div className="text-center">
            <div className="text-[16px] font-semibold tracking-[-0.01em]">
              {title}
            </div>
            <div className="text-[12px] text-white/65">{range}</div>
          </div>

          <button
            className="h-10 w-10 rounded-xl bg-white/5 border border-white/10 hover:bg-white/8 transition"
            aria-label="정보"
          >
            i
          </button>
        </header>

        {/* Progress row */}
        <div className="mt-4 flex items-center justify-between">
          <div className="inline-flex items-center gap-2">
            <span className="chip">이달의 별자리</span>
            <span className="chip chip-soft">
              {nowDate.toLocaleDateString("ko-KR")}
            </span>
          </div>

          <span className="chip chip-glow">진행 3/29</span>
          {/* ↑ 나중에 progress API 붙이면 여기 값만 바꾸면 됨 */}
        </div>

        {/* Hero constellation card */}
        <div className="mt-4 hero-card">
          {/* 카드 안쪽 halo */}
          <div className="hero-halo" />

          <div className="hero-inner">
            {periodId ? (
              <ConstellationCanvasPeriod periodId={periodId} />
            ) : (
              <div className="text-white/60 text-sm">별자리 로딩 중…</div>
            )}
          </div>
        </div>

        {/* Calendar */}
        <div className="mt-5 glass-card p-3">
          <div className="flex items-center justify-between mb-2">
            <div className="text-[13px] text-white/80 font-semibold">
              날짜 선택
            </div>
            <div className="text-[12px] text-white/55">
              별을 밝힐 날을 골라요
            </div>
          </div>
          <CalendarView onSelectDate={(d) => d && setNowDate(d)} />
        </div>

        {/* CTA */}
        <div className="mt-5">
          <button className="cta">
            오늘의 별 만들기
            <span className="cta-shimmer" aria-hidden />
          </button>
        </div>
      </section>
    </main>
  );
}
