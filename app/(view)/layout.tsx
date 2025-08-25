"use client";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative w-full min-h-screen bg-[#172E60] overflow-hidden">
      {/* 모바일 9:16 비율 배경 이미지 */}
      <div className="absolute inset-0 w-full h-full flex justify-center items-center">
        <img
          src="/images/bg/lumi4.png"
          // src="/images/bg/image2.png"
          alt="background"
          className="min-w-full min-h-full w-auto h-auto object-cover"
        />
      </div>

      {/* 자식 콘텐츠 */}
      <div className="relative z-10 flex flex-col w-full h-full">
        {children}
      </div>
    </div>
  );
}
