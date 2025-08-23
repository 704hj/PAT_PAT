"use client";

import BottomNav from "../components/navigation";
export default function Layout({ children }: { children: React.ReactNode }) {
  const NAV_H = 64;
  return (
    <div
      className="relative min-h-screen "
      style={{
        paddingBottom: `calc(${NAV_H}px + env(safe-area-inset-bottom))`,
      }}
    >
      <main className="min-h-[100svh]">{children}</main>
      <div className="fixed bottom-0 left-0 w-full z-50">
        <BottomNav />
      </div>
    </div>
  );
}
