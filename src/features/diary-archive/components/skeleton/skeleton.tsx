export function DiaryCollectionPageSkeleton({ view }: { view: string }) {
  return (
    <section>
      {/* 콘텐츠 */}
      <div className="mt-5 space-y-6">
        {view === "list" ? <DiaryListSkeleton /> : <CalendarViewSkeleton />}
      </div>
    </section>
  );
}

export function DiaryListSkeleton({ count = 3 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <section key={i} className="space-y-2">
          {/* DateHeader */}
          <div className="h-4 w-28 rounded bg-white/10" />

          {/* JournalCard */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 space-y-3">
            <div className="h-4 w-3/4 rounded bg-white/10" />
            <div className="h-3 w-full rounded bg-white/10" />
            <div className="h-3 w-5/6 rounded bg-white/10" />
          </div>
        </section>
      ))}
    </>
  );
}

export function CalendarViewSkeleton({
  showSelected = true,
  gridCells = 42, // 6주 기준(7*6). month에 따라 35~42 변동이지만 스켈레톤은 고정이 안정적
  cards = 1,
}: {
  showSelected?: boolean;
  gridCells?: number;
  cards?: number;
}) {
  return (
    <div className="space-y-6 animate-pulse">
      {/* 캘린더 */}
      <div className="grid grid-cols-7 gap-1 text-center">
        {/* 요일 헤더 */}
        {["일", "월", "화", "수", "목", "금", "토"].map((d) => (
          <div key={d} className="text-[11px] text-white/45 py-1">
            {d}
          </div>
        ))}

        {/* 날짜 셀 */}
        {Array.from({ length: gridCells }).map((_, idx) => {
          // 앞쪽 빈칸(placeholder)처럼 보이게 섞어주기
          const isBlank = idx < 2; // 살짝만
          if (isBlank) return <div key={idx} className="h-10" />;

          const isSelected = idx === 10; // 선택된 날짜 느낌 1개

          return (
            <div
              key={idx}
              className={[
                "h-10 rounded-lg relative",
                isSelected ? "bg-white/15" : "bg-white/8",
              ].join(" ")}
            >
              {/* 날짜 숫자 자리 */}
              <div className="absolute top-2 left-2 h-3 w-4 rounded bg-white/10" />

              {/* 기록 점(dot) 자리 */}
              <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-white/20" />
            </div>
          );
        })}
      </div>

      {/* 선택한 날짜의 기록 */}
      {showSelected && (
        <div>
          {/* 날짜 타이틀 */}
          <div className="mb-2 h-4 w-32 rounded bg-white/10" />

          {/* JournalCard 스켈레톤 */}
          <div className="space-y-2">
            {Array.from({ length: cards }).map((_, i) => (
              <div
                key={i}
                className="rounded-2xl border border-white/10 bg-white/5 p-4 space-y-3"
              >
                <div className="h-4 w-3/4 rounded bg-white/10" />
                <div className="h-3 w-full rounded bg-white/10" />
                <div className="h-3 w-5/6 rounded bg-white/10" />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
