"use client";
import BottomNav from "@/shared/components/navigation";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <main
      className="
        w-full min-h-screen flex justify-center
        bg-[linear-gradient(to_bottom,#000A2D_0%,#030D32_40%,#14295A_100%)]
      "
    >
      {/* 모바일 프레임 */}
      <div
        className="
          relative w-full max-w-[412px] min-h-screen
          overflow-hidden
        "
      >
        {/* 스크롤 영역 */}
        <div
          className="
            relative min-h-screen
            overflow-y-auto
            pb-[96px] 
          "
        >
          {children}
        </div>

        {/* 하단 네비: viewport 기준 고정 */}
        <div
          className="
            fixed left-1/2 -translate-x-1/2 bottom-0
            w-full max-w-[412px]
            z-50
            pb-[max(12px,env(safe-area-inset-bottom))]
          "
        >
          <BottomNav />
        </div>
      </div>
    </main>
  );
}
