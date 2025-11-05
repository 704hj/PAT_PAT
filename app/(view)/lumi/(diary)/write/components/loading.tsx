import {
  GlassCardSkeleton,
  SkeletonCircle,
  SkeletonLine,
} from "../../../components/skeletons";

export default function Loading() {
  return (
    <div
      className="relative min-h-[100svh] overflow-y-auto"
      aria-busy="true"
      aria-live="polite"
    >
      <section className="relative mx-auto w-full max-w-[480px] px-5 pb-[96px]">
        {/* 헤더 */}
        <header className="pt-6 flex items-center justify-between">
          <SkeletonLine className="h-9 w-12 rounded-lg" />
          <SkeletonLine className="h-5 w-32 rounded" />
          <span className="w-9" />
        </header>

        {/* 캐릭터 안내 카드 */}
        <div className="mt-4">
          <GlassCardSkeleton className="p-3">
            <div className="flex items-center gap-3">
              <SkeletonCircle className="h-10 w-10" />
              <SkeletonLine className="h-4 w-3/5" />
            </div>
          </GlassCardSkeleton>
        </div>

        {/* Mood 선택 */}
        <div className="mt-4">
          <GlassCardSkeleton className="p-4">
            <div className="flex items-center justify-between">
              <SkeletonLine className="h-4 w-20" />
              <SkeletonLine className="h-4 w-16" />
            </div>

            {/* 이미지 그리드 (4열 x 2~3행) */}
            <div className="mt-3 grid grid-cols-4 gap-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="h-18 rounded-xl border border-white/10 bg-white/6"
                >
                  <SkeletonCircle className="h-14 w-14 mx-auto my-2" />
                </div>
              ))}
            </div>
          </GlassCardSkeleton>
        </div>

        {/* 강도 슬라이더 */}
        <div className="mt-4">
          <GlassCardSkeleton className="p-4">
            <div className="flex items-center justify-between">
              <SkeletonLine className="h-4 w-20" />
              <SkeletonLine className="h-4 w-10" />
            </div>
            <div className="mt-3 px-1">
              <SkeletonLine className="h-2 w-full rounded-full" />
              <div className="mt-2 flex justify-between">
                <SkeletonLine className="h-3 w-10" />
                <SkeletonLine className="h-3 w-10" />
                <SkeletonLine className="h-3 w-10" />
              </div>
            </div>
          </GlassCardSkeleton>
        </div>

        {/* 텍스트 입력 + 태그 */}
        <div className="mt-4">
          <GlassCardSkeleton className="p-3">
            <SkeletonLine className="h-24 w-full rounded-xl" />
            <div className="mt-2 flex items-center justify-between">
              <SkeletonLine className="h-3 w-40" />
              <SkeletonLine className="h-3 w-16" />
            </div>

            {/* 태그 칩 6~8개 뼈대 */}
            <div className="mt-2 flex flex-wrap gap-2">
              {Array.from({ length: 8 }).map((_, i) => (
                <SkeletonLine key={i} className="h-7 w-16 rounded-full" />
              ))}
            </div>
          </GlassCardSkeleton>
        </div>

        {/* 하단 CTA */}
        <div
          className="absolute left-1/2 -translate-x-1/2 w-[92%] max-w-[420px]"
          style={{
            bottom: "max(calc(env(safe-area-inset-bottom) + 8px), 20px)",
          }}
        >
          <div className="grid grid-cols-2 gap-8">
            <SkeletonLine className="h-12 rounded-[12px]" />
            <SkeletonLine className="h-12 rounded-[12px]" />
          </div>
        </div>
      </section>
    </div>
  );
}
