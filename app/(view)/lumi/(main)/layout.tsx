"use client";

import BottomNav from "../components/navigation";
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <main className="w-full h-screen flex justify-center items-start bg-[linear-gradient(to_bottom,#000A2D_0%,#030D32_40%,#14295A_100%)] bg-cover bg-center overflow-x-auto">
      <div className="relative min-w-[412px] min-h-[920px] overflow-x-auto ">
        {children}

        <div className="absolute bottom-4 left-0 w-full z-50">
          <BottomNav />
        </div>
      </div>
    </main>
  );
}
