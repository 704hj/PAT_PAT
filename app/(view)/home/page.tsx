"use client";

export default function HomePage() {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center">
      {/* 고양이 캐릭터 */}
      <div className="absolute inset-0 flex justify-center items-end bottom-1/3 z-30">
        <div className="relative mb-4 left-1/4">
          <img
            src="/images/icon/cat.png"
            alt="character"
            className="max-w-[70%] h-auto transition-transform duration-150 ease-out active:translate-y-1 active:scale-95 cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
}
