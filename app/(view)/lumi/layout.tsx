// app/(view)/layout.tsx
"use client";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative w-full min-h-screen">
      <img
        src="/images/bg/lumi.png"
        alt="background"
        className="w-full h-auto min-h-screen object-cover"
      />
      <div className="absolute inset-0">{children}</div>
    </div>
  );
}
