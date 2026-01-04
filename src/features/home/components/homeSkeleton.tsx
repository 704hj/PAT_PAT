import GlassCard from "@/shared/components/glassCard";
import { Skeleton } from "@/shared/components/skeleton/skeletons";

export default function HomeSkeleton() {
  return (
    <div className="relative min-h-[100svh] overflow-y-auto">
      {/* 배경 */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(1200px_800px_at_50%_-10%,rgba(70,120,255,0.22),transparent_60%),radial-gradient(900px_600px_at_80%_40%,rgba(130,70,255,0.14),transparent_60%),linear-gradient(180deg,#07102a_0%,#050b1c_100%)]" />

      <section className="relative mx-auto w-full max-w-[480px] px-5 pb-[120px]">
        {/* 헤더 스켈레톤 */}
        <header className="pt-10">
          <div className="flex items-start justify-between gap-4">
            <div className="w-full">
              <Skeleton className="h-8 w-[140px] rounded-2xl" />
              <Skeleton className="mt-3 h-5 w-[220px] rounded-2xl" />

              <div className="mt-4 flex items-center gap-2">
                <Skeleton className="h-7 w-[92px] rounded-full" />
                <Skeleton className="h-7 w-[120px] rounded-full" />
              </div>
            </div>

            <Skeleton className="w-16 h-16 rounded-2xl" />
          </div>
        </header>

        {/* 오늘 상태 카드 스켈레톤 */}
        <div className="mt-6">
          <GlassCard className="p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="w-full">
                <Skeleton className="h-5 w-[180px]" />
                <Skeleton className="mt-2 h-4 w-[240px]" />
                <Skeleton className="mt-3 h-3 w-[140px] opacity-70" />
              </div>
              <Skeleton className="w-10 h-10 rounded-2xl" />
            </div>
          </GlassCard>
        </div>

        {/* CTA 스켈레톤 */}
        <div className="mt-4">
          <Skeleton className="h-12 w-full rounded-[14px]" />
        </div>

        {/* 주간 요약 스켈레톤 */}
        <div className="mt-6">
          <GlassCard className="p-4">
            <div className="flex items-center justify-between">
              <Skeleton className="h-5 w-[120px]" />
              <Skeleton className="h-9 w-[70px] rounded-xl" />
            </div>

            <Skeleton className="mt-3 h-4 w-[260px]" />

            <div className="mt-4">
              <div className="flex items-center justify-between">
                <Skeleton className="h-3 w-[60px]" />
                <Skeleton className="h-3 w-[40px]" />
              </div>
              <Skeleton className="mt-2 h-2 w-full rounded-full" />
            </div>
          </GlassCard>
        </div>

        {/* 보조 버튼 스켈레톤 */}
        <div className="mt-4 grid grid-cols-2 gap-3">
          <Skeleton className="h-12 w-full rounded-[14px]" />
          <Skeleton className="h-12 w-full rounded-[14px]" />
        </div>

        {/* 로딩 텍스트(선택) */}
        <div className="mt-6 text-center text-white/50 text-[12px]">
          불러오는 중…
        </div>
      </section>
    </div>
  );
}
