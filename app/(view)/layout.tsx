"use client";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative w-full min-h-screen">
      <img
        src="/images/bg/image1.png"
        alt="bg"
        className="w-full h-auto min-h-screen object-cover"
      />
      <div className="absolute inset-0">{children}</div>
    </div>
  );
}
