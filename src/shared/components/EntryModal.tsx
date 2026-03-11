"use client";

import { displayDate } from "@/lib/zodiac";
import { Entry } from "@/utils/entries";
import { useEffect, useState } from "react";

type EntryModalProps = {
  isOpen: boolean;
  date: string | null;
  entry: Entry | null;
  onClose: () => void;
  onEdit?: () => void;
};

// 카드 우상단 장식용 미니 별자리
function ConstellationDeco() {
  const stars = [
    { x: 52, y: 12 },
    { x: 72, y: 28 },
    { x: 88, y: 10 },
    { x: 96, y: 38 },
    { x: 68, y: 52 },
  ];
  const lines = [
    [0, 1], [1, 2], [2, 3], [3, 4], [1, 4],
  ];
  return (
    <svg width="110" height="65" viewBox="0 0 110 65" className="opacity-[0.18]">
      {lines.map(([a, b], i) => (
        <line
          key={i}
          x1={stars[a].x} y1={stars[a].y}
          x2={stars[b].x} y2={stars[b].y}
          stroke="white" strokeWidth="0.6"
        />
      ))}
      {stars.map((s, i) => (
        <g key={i}>
          <circle cx={s.x} cy={s.y} r={2.5} fill="white" opacity={0.15} />
          <circle cx={s.x} cy={s.y} r={1} fill="white" opacity={0.9} />
        </g>
      ))}
    </svg>
  );
}

export default function EntryModal({
  isOpen,
  date,
  entry,
  onClose,
  onEdit,
}: EntryModalProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      requestAnimationFrame(() => setVisible(true));
    } else {
      setVisible(false);
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  const handleClose = () => {
    setVisible(false);
    setTimeout(onClose, 280);
  };

  if (!isOpen) return null;

  return (
    <>
      <style>{`
        @keyframes breathe {
          0%, 100% { opacity: 0.25; }
          50% { opacity: 0.55; }
        }
        @keyframes border-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes twinkle-a {
          0%, 100% { opacity: 0.2; } 50% { opacity: 0.9; }
        }
        @keyframes twinkle-b {
          0%, 100% { opacity: 0.6; } 60% { opacity: 0.1; }
        }
        @keyframes twinkle-c {
          0%, 100% { opacity: 0.4; } 30% { opacity: 1; }
        }
      `}</style>

      <div
        className={`fixed inset-0 z-50 flex items-center justify-center p-6 transition-all duration-300 ${
          visible ? "opacity-100" : "opacity-0"
        }`}
        onClick={handleClose}
      >
        {/* 오버레이 */}
        <div className="absolute inset-0 bg-[#010612]/50 backdrop-blur-sm" />

        {/* 은하 글로우 */}
        <div
          className="absolute rounded-full pointer-events-none"
          style={{
            width: 320, height: 220,
            background: "radial-gradient(ellipse, rgba(80,110,255,0.18) 0%, rgba(40,60,180,0.08) 50%, transparent 75%)",
            animation: "breathe 4s ease-in-out infinite",
          }}
        />

        {/* 모달 */}
        <div
          className={`relative w-full max-w-[310px] transition-all duration-300 ${
            visible ? "translate-y-0 scale-100" : "translate-y-4 scale-[0.97]"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* 외곽 글로우 */}
          <div
            className="absolute -inset-[3px] rounded-[31px] pointer-events-none"
            style={{
              background: "radial-gradient(ellipse, rgba(80,120,255,0.15), transparent 70%)",
              animation: "breathe 3.5s ease-in-out infinite",
            }}
          />

          {/* border beam wrapper */}
          <div className="relative rounded-[28px] p-[1px] overflow-hidden"
            style={{ boxShadow: "0 32px 64px rgba(0,0,20,0.75)" }}
          >
            {/* 회전하는 빛 */}
            <div
              className="absolute pointer-events-none"
              style={{
                inset: "-80%",
                background: "conic-gradient(from 0deg, transparent 0deg, transparent 110deg, rgba(100,140,255,0.08) 130deg, rgba(160,200,255,0.6) 165deg, rgba(210,230,255,0.95) 180deg, rgba(160,200,255,0.6) 195deg, rgba(100,140,255,0.08) 220deg, transparent 240deg, transparent 360deg)",
                animation: "border-spin 8s linear infinite",
              }}
            />

          {/* 카드 */}
          <div
            className="relative rounded-[27px] overflow-hidden"
            style={{
              background: "linear-gradient(155deg, rgba(14,22,58,0.97) 0%, rgba(7,11,32,0.99) 100%)",
            }}
          >
            {/* 상단 빛줄기 */}
            <div className="h-px" style={{
              background: "linear-gradient(90deg, transparent 0%, rgba(140,170,255,0.5) 40%, rgba(180,200,255,0.7) 55%, rgba(140,170,255,0.5) 70%, transparent 100%)"
            }} />

            {/* 별자리 장식 - 우상단 */}
            <div className="absolute top-0 right-0 pointer-events-none">
              <ConstellationDeco />
            </div>

            {/* 흩어진 미세 별들 */}
            {[
              { top: "18%", left: "8%", dur: "2.8s", anim: "twinkle-a" },
              { top: "45%", left: "5%", dur: "4.1s", anim: "twinkle-b" },
              { top: "72%", left: "12%", dur: "3.3s", anim: "twinkle-c" },
              { top: "60%", right: "7%", dur: "2.5s", anim: "twinkle-a" },
              { top: "85%", right: "15%", dur: "3.8s", anim: "twinkle-b" },
            ].map((s, i) => (
              <div
                key={i}
                className="absolute w-0.5 h-0.5 rounded-full bg-white pointer-events-none"
                style={{
                  top: s.top,
                  left: (s as any).left,
                  right: (s as any).right,
                  animation: `${s.anim} ${s.dur} ease-in-out infinite`,
                }}
              />
            ))}

            <div className="relative px-6 pt-6 pb-5">
              {/* 헤더: 날짜 + 닫기 버튼 */}
              <div className="flex items-start justify-between mb-5">
                <div>
                  <p className="text-[10px] tracking-[0.22em] text-white/25 uppercase mb-2">
                    ✦ &nbsp; your star
                  </p>
                  <h2 className="text-white/90 text-[17px] font-light tracking-[-0.01em]">
                    {date ? displayDate(date) : "—"}
                  </h2>
                </div>
                <button
                  onClick={handleClose}
                  className="mt-1 w-7 h-7 flex items-center justify-center rounded-full transition-all"
                  style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}
                  aria-label="닫기"
                >
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-white/40">
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* 구분선 */}
              <div className="flex items-center gap-2 mb-5">
                <div className="flex-1 h-px" style={{
                  background: "linear-gradient(90deg, rgba(100,130,255,0.25), transparent)"
                }} />
                <svg width="6" height="6" viewBox="0 0 6 6">
                  <polygon points="3,0 3.7,2.3 6,2.3 4.2,3.7 4.9,6 3,4.6 1.1,6 1.8,3.7 0,2.3 2.3,2.3" fill="rgba(150,180,255,0.4)" />
                </svg>
                <div className="flex-1 h-px" style={{
                  background: "linear-gradient(90deg, transparent, rgba(100,130,255,0.1))"
                }} />
              </div>

              {/* 내용 */}
              <div className="min-h-[72px] mb-6">
                {entry?.content ? (
                  <p className="text-white/75 text-[14px] leading-[1.85] tracking-[-0.01em] whitespace-pre-wrap font-light">
                    {entry.content}
                  </p>
                ) : (
                  <p className="text-white/18 text-[13px] text-center py-4 italic tracking-wide">
                    아직 빛나지 않은 별이에요
                  </p>
                )}
              </div>

              {/* 하단 구분선 */}
              <div className="h-px mb-5" style={{
                background: "linear-gradient(90deg, transparent, rgba(100,130,255,0.12), transparent)"
              }} />

              {/* 버튼 */}
              <div className="flex gap-2">
                {onEdit && (
                  <button
                    onClick={() => { onEdit(); handleClose(); }}
                    className="flex-1 py-[11px] rounded-2xl text-[13px] font-medium tracking-wide transition-all duration-200 active:scale-[0.97]"
                    style={{
                      background: "rgba(255,255,255,0.06)",
                      border: "1px solid rgba(150,180,255,0.25)",
                      color: "rgba(180,210,255,0.8)",
                    }}
                  >
                    수정하기
                  </button>
                )}
                <button
                  onClick={handleClose}
                  className="flex-1 py-[11px] rounded-2xl text-[13px] tracking-wide transition-all duration-200 active:scale-[0.97]"
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.07)",
                    color: "rgba(255,255,255,0.25)",
                  }}
                >
                  닫기
                </button>
              </div>
            </div>
          </div>
          </div>{/* border beam wrapper 닫기 */}
        </div>
      </div>
    </>
  );
}
