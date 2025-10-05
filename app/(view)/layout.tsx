"use client";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative w-full min-h-screen bg-[#172E60] overflow-hidden">
      <div className="relative z-10 flex flex-col w-full h-full">
        {children}
      </div>
    </div>
  );
}
