import { useEffect, useState } from "react";

// 파일 하단에 추가
export default function MinimalIntro({
  messages,
  title,
}: {
  messages: string[];
  title: string;
}) {
  const [i, setI] = useState(0);

  useEffect(() => {
    const itv = setInterval(() => setI((p) => (p + 1) % messages.length), 1600);
    return () => clearInterval(itv);
  }, [messages.length]);

  return (
    <div
      className="mx-auto rounded-xl px-5 py-4
                   bg-white/6 backdrop-blur-sm
                   border border-white/10
                   text-white"
    >
      {/* 헤드라인: 심플, 과장 없는 사이즈 */}
      <h2 className="text-[18px] sm:text-[20px] font-semibold tracking-tight">
        {title}
      </h2>

      {/* 얇은 포인트 라인 */}
      <div className="mt-1.5 h-px w-10 bg-white/25" />

      {/* 서브 카피: 짧고 담백, 슬라이드·페이드 교체 */}
      <p
        key={i}
        className="mt-2 text-[15px] sm:text-[16px] text-white/85 leading-snug
                     animate-[fadeSlide_350ms_ease]"
      >
        {messages[i]}
      </p>
    </div>
  );
}
