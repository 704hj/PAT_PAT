"use client";

import GlassCard from "@/app/components/glassCard";
import { useUserProfile } from "@/app/hooks/useUserProfile";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import Pill from "../home/component/pill";
import PrimaryButton from "../home/component/primaryButton";
import SecondaryButton from "../home/component/secondaryButton";

type TodayState = {
  hasEntry: boolean;
  starCountToday: number;
  lastSavedAt?: string;
};

type WeekSummary = {
  entryDays: number; // 0~7
  positiveDays: number;
  negativeDays: number;
  insight: string;
};

function pct(value: number, max: number) {
  const v = Math.max(0, Math.min(max, value));
  return (v / max) * 100;
}

export default function HomeReLayoutSingleCTA() {
  // 공통 훅으로 세션 + 프로필 정보 한 번에 가져오기
  const { profile, loading } = useUserProfile();

  const router = useRouter();

  const today: TodayState = {
    hasEntry: false,
    starCountToday: 0,
  };

  const week: WeekSummary = {
    entryDays: 3,
    positiveDays: 2,
    negativeDays: 1,
    insight: "이번 주는 조용히 남긴 날이 많아요.",
  };

  const headerTitle = "yun 님,";
  const headerSubtitle = "오늘을 한 줄로 정리해볼까요?";

  const todayTitle = useMemo(() => {
    return today.hasEntry
      ? "오늘은 조용히 남겨졌어요"
      : "오늘은 아직 기록이 없어요";
  }, [today.hasEntry]);

  const todayDesc = useMemo(() => {
    return today.hasEntry
      ? `별 ${today.starCountToday}개가 남아 있어요.`
      : "하루가 지나가기 전, 한 줄을 남길 수 있어요.";
  }, [today.hasEntry, today.starCountToday]);

  const todaySkyLabel = useMemo(() => {
    return today.hasEntry ? "오늘의 하늘 · 빛남" : "오늘의 하늘 · 고요함";
  }, [today.hasEntry]);

  // 로딩 중이면 로딩 UI 표시
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="relative min-h-[100svh] overflow-y-auto">
      {/* 배경 */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(1200px_800px_at_50%_-10%,rgba(70,120,255,0.22),transparent_60%),radial-gradient(900px_600px_at_80%_40%,rgba(130,70,255,0.14),transparent_60%),linear-gradient(180deg,#07102a_0%,#050b1c_100%)]" />

      <section className="relative mx-auto w-full max-w-[480px] px-5 pb-[120px]">
        {/* 헤더 */}
        <header className="pt-10">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="text-white text-[28px] font-semibold tracking-[-0.02em]">
                {headerTitle}
              </div>
              <div className="mt-2 text-white/85 text-[18px] leading-snug">
                {headerSubtitle}
              </div>

              <div className="mt-4 flex items-center gap-2">
                <Pill>⭐ Star {today.starCountToday}</Pill>
                <Pill>{todaySkyLabel}</Pill>
              </div>
            </div>

            <img
              src="/images/icon/lumi/lumi_main.svg"
              alt="루미"
              className="w-16 h-16 object-contain"
            />
          </div>
        </header>

        {/* (1) 오늘 상태: 정보 카드 (CTA 제거) */}
        <div className="mt-6">
          <GlassCard className="p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-white text-[16px] font-semibold">
                  {todayTitle}
                </div>
                <div className="mt-1 text-white/70 text-[13px] leading-snug">
                  {todayDesc}
                </div>

                {/* 허전함 해결용 "시간성" 한 줄 */}
                <div className="mt-3 text-white/55 text-[12px]">
                  오늘이 지나가고 있어요.
                </div>
              </div>

              {/* 대신 오른쪽에는 작은 장식(또는 빈 공간)으로 정리 */}
              <div className=" w-10 h-10 rounded-2xl border border-white/10 bg-white/4 flex items-center justify-center text-white/60 text-[12px]">
                ✦
              </div>
            </div>
          </GlassCard>
        </div>

        {/* (2) 메인 CTA 단 하나 */}
        <div className="mt-4">
          <PrimaryButton onClick={() => router.push("/lumi/write")}>
            오늘 정리하기
          </PrimaryButton>
        </div>

        {/* (3) 주간 요약 (정보 소비 영역) */}
        <div className="mt-6">
          <GlassCard className="p-4">
            <div className="flex items-center justify-between">
              <div className="text-white/90 text-[15px] font-semibold">
                이번 주 돌아보기
              </div>
              <button
                onClick={() => router.push("/lumi/stats")}
                className="h-9 rounded-xl px-3 text-[13px] text-white/80 bg-white/6 border border-white/12 hover:bg-white/10 transition"
              >
                자세히
              </button>
            </div>

            <div className="mt-3 text-white/70 text-[13px] leading-snug">
              {week.insight}
            </div>

            <div className="mt-4">
              <div className="flex items-center justify-between text-[12px] text-white/55">
                <span>기록한 날</span>
                <span>{week.entryDays}/7</span>
              </div>
              <div className="mt-2 h-2 rounded-full bg-white/8 overflow-hidden">
                <div
                  className="h-full rounded-full bg-white/40"
                  style={{ width: `${pct(week.entryDays, 7)}%` }}
                />
              </div>
            </div>
          </GlassCard>
        </div>

        {/* (4) 보조 바로가기 */}
        <div className="mt-4 grid grid-cols-2 gap-3">
          <SecondaryButton onClick={() => router.push("/lumi/diary")}>
            기록 모아보기
          </SecondaryButton>
          <SecondaryButton onClick={() => router.push("/lumi/starLoad")}>
            별자리 보기
          </SecondaryButton>
        </div>
      </section>
    </div>
  );
}
