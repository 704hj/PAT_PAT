"use client";

import GlassCard from "@/shared/components/glassCard";

function SkeletonLine({ w = "w-full", h = "h-4" }: { w?: string; h?: string }) {
  return <div className={`${w} ${h} rounded-md bg-white/10 animate-pulse`} />;
}

function SkeletonButton({ h = "h-12" }: { h?: string }) {
  return <div className={`${h} rounded-xl bg-white/12 animate-pulse`} />;
}

export default function DiarySkeleton() {
  return (
    <div className="relative min-h-[100svh] overflow-y-auto">
      {/* 배경 */}
      <div
        className="pointer-events-none absolute inset-0 -z-10
        bg-[linear-gradient(180deg,#07102a_0%,#050b1c_100%)]"
      />

      <section className="mx-auto max-w-[480px] px-5 pb-[120px]">
        {/* 헤더 */}
        <header className="pt-6 flex items-center justify-between">
          <div className="w-9 h-9 rounded-lg bg-white/10 animate-pulse" />
          <SkeletonLine w="w-24" h="h-5" />
          <div className="w-9" />
        </header>

        {/* 안내 카드 */}
        <div className="mt-4">
          <GlassCard className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/10 animate-pulse" />
              <div className="flex-1 space-y-2">
                <SkeletonLine w="w-3/4" />
                <SkeletonLine w="w-1/2" h="h-3" />
              </div>
            </div>
          </GlassCard>
        </div>

        {/* 상태 선택 */}
        <div className="mt-4">
          <GlassCard className="p-4">
            <SkeletonLine w="w-20" h="h-4" />
            <div className="mt-3 grid grid-cols-2 gap-3">
              <SkeletonButton />
              <SkeletonButton />
            </div>
          </GlassCard>
        </div>

        {/* 강도 */}
        <div className="mt-4">
          <GlassCard className="p-4 space-y-2">
            <SkeletonLine w="w-24" />
            <SkeletonLine w="w-32" h="h-3" />
            <div className="mt-3 h-4 rounded-full bg-white/10 animate-pulse" />
          </GlassCard>
        </div>

        {/* 기록 */}
        <div className="mt-4">
          <GlassCard className="p-4 space-y-3">
            <SkeletonLine w="w-40" />
            <div className="h-32 rounded-xl bg-white/10 animate-pulse" />
            <div className="flex justify-between">
              <SkeletonLine w="w-32" h="h-3" />
              <SkeletonLine w="w-12" h="h-3" />
            </div>
          </GlassCard>
        </div>

        {/* 하단 CTA */}
        <div
          className="fixed left-1/2 -translate-x-1/2 w-[92%] max-w-[420px]"
          style={{
            bottom: "max(calc(env(safe-area-inset-bottom) + 10px), 18px)",
          }}
        >
          <div className="grid grid-cols-2 gap-3">
            <SkeletonButton />
            <SkeletonButton />
          </div>
        </div>
      </section>
    </div>
  );
}
