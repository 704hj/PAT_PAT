"use client";

type TLayoutProps = {
  children: React.ReactNode;
};

export default function Layout({ children }: TLayoutProps) {
  return (
    <div className="relative w-full min-h-screen flex flex-col">
      {/* 상단 색 */}
      <div className="absolute top-0 left-0 w-full h-1/3 bg-[#28284C]" />

      {/* 하단 색 */}
      <div className="absolute bottom-0 left-0 w-full h-1/3 bg-[#171A31]" />

      {/* 배경 이미지 */}
      <img
        src="/images/bg/adobe.png"
        alt="background"
        className="w-full h-auto mx-auto relative z-10"
      />

      <div className="absolute top-0 left-0 w-full h-full z-20">{children}</div>
    </div>
  );
}
