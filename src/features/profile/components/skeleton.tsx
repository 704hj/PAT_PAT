export default function ProfileSkeleton() {
  return (
    <main
      className="relative min-h-[100svh] overflow-hidden"
      aria-busy
      aria-label="로딩 중"
    >
      {/* 배경 */}
      <div
        aria-hidden
        className="absolute inset-0 -z-20 bg-[radial-gradient(100%_70%_at_50%_100%,#0b1d4a_0%,#091430_48%,#070f24_100%)]"
      />
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_center,transparent_60%,rgba(0,0,0,0.28))]"
      />

      <section className="relative mx-auto w-full max-w-[480px] px-5">
        {/* 헤더 */}
        <header className="pt-6 pb-3 flex items-center justify-between">
          <SkLine className="w-16 h-5" />
          <SkLine className="w-12 h-4" />
        </header>

        <div className="space-y-5 pb-[88px]">
          {/* 프로필 카드 */}
          <div className="rounded-[16px] border border-white/12 bg-white/6 backdrop-blur p-4">
            <div className="flex items-center gap-3.5">
              {/* 아바타 */}
              <div
                className="w-[64px] h-[64px] rounded-2xl bg-white/10 animate-pulse shrink-0"
                aria-hidden
              />
              <div className="min-w-0 flex-1 space-y-2">
                <SkLine className="w-3/5 h-4" />
                <div className="flex gap-1.5">
                  <SkLine className="w-24 h-6 rounded-full" />
                  <SkLine className="w-20 h-6 rounded-full" />
                </div>
              </div>
            </div>
            {/* 통계 3열 */}
            <div className="mt-4 grid grid-cols-3 divide-x divide-white/10 rounded-[12px] overflow-hidden border border-white/10">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="bg-white/6 p-3 flex flex-col items-center gap-1.5"
                >
                  <SkLine className="w-8 h-5" />
                  <SkLine className="w-12 h-3" />
                </div>
              ))}
            </div>
          </div>

          {/* 계정 카드 */}
          <div className="rounded-[16px] border border-white/12 bg-white/6 backdrop-blur p-1.5">
            <div className="px-4 pt-3 pb-1">
              <SkLine className="w-10 h-3.5" />
            </div>
            {/* 이메일 행 */}
            <div className="px-4 py-3.5 flex items-center justify-between border-t border-white/8">
              <div className="space-y-1.5">
                <SkLine className="w-12 h-3.5" />
                <SkLine className="w-40 h-3" />
              </div>
            </div>
            {/* 로그인 방식 행 */}
            <div className="px-4 py-3.5 flex items-center justify-between border-t border-white/8">
              <SkLine className="w-20 h-3.5" />
              <SkLine className="w-16 h-7 rounded-full" />
            </div>
          </div>

          {/* 지원 카드 */}
          <div className="rounded-[16px] border border-white/12 bg-white/6 backdrop-blur p-1.5">
            <div className="px-4 pt-3 pb-1">
              <SkLine className="w-8 h-3.5" />
            </div>
            {['w-12', 'w-16', 'w-28'].map((w, i) => (
              <div
                key={i}
                className="px-4 py-3.5 flex items-center justify-between border-t border-white/8"
              >
                <div className="space-y-1.5">
                  <SkLine className={`${w} h-3.5`} />
                  {i < 2 && <SkLine className="w-24 h-3" />}
                </div>
                <SkLine className="w-4 h-4 rounded" />
              </div>
            ))}
          </div>

          {/* 하단 버튼 */}
          <div className="grid grid-cols-2 gap-3">
            <div
              className="h-11 rounded-[12px] bg-white/6 border border-white/12 animate-pulse"
              aria-hidden
            />
            <div
              className="h-11 rounded-[12px] bg-white/6 border border-white/12 animate-pulse"
              aria-hidden
            />
          </div>
        </div>
      </section>
    </main>
  );
}

function SkLine({ className = '' }: { className?: string }) {
  return (
    <div
      className={`rounded-md bg-white/10 animate-pulse ${className}`}
      aria-hidden
    />
  );
}
