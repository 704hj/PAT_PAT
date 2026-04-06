'use client';

import { useEffect, useState } from 'react';

type BirthdayOverlayProps = {
  nickname: string;
  zodiacNameKo: string;
};

const STORAGE_KEY = 'pat_birthday_overlay_shown';

function getStoredDate(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(STORAGE_KEY);
}

function isBirthdayToday(birthDate: string): boolean {
  const now = new Date();
  const nowKst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const todayMmdd = `${String(nowKst.getUTCMonth() + 1).padStart(2, '0')}-${String(nowKst.getUTCDate()).padStart(2, '0')}`;
  const birthMmdd = birthDate.slice(5); // "YYYY-MM-DD" → "MM-DD"
  return todayMmdd === birthMmdd;
}

export default function BirthdayOverlay({
  nickname,
  zodiacNameKo,
}: BirthdayOverlayProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];
    if (getStoredDate() === todayStr) return;
    // 약간의 딜레이 후 표시
    const timer = setTimeout(() => setVisible(true), 600);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setVisible(false);
    const todayStr = new Date().toISOString().split('T')[0];
    localStorage.setItem(STORAGE_KEY, todayStr);
  };

  if (!visible) return null;

  return (
    <>
      <style>{`
        @keyframes bd-float {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-8px) scale(1.02); }
        }
        @keyframes bd-particle {
          0% { transform: translateY(0) scale(1); opacity: 1; }
          100% { transform: translateY(-80px) scale(0.3); opacity: 0; }
        }
        @keyframes bd-glow {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.6; }
        }
        @keyframes bd-fadein {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>

      <div
        className="fixed inset-0 z-[100] flex items-center justify-center"
        onClick={handleClose}
      >
        {/* 배경 */}
        <div className="absolute inset-0 bg-[#010612]/80 backdrop-blur-md" />

        {/* 금색 글로우 */}
        <div
          className="absolute pointer-events-none"
          style={{
            width: 400,
            height: 300,
            background: 'radial-gradient(ellipse, rgba(255,200,60,0.15) 0%, transparent 65%)',
            animation: 'bd-glow 3s ease-in-out infinite',
          }}
        />

        {/* 금색 파티클 */}
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full pointer-events-none"
            style={{
              width: 3 + (i % 3) * 2,
              height: 3 + (i % 3) * 2,
              left: `${15 + (i * 6.2) % 70}%`,
              bottom: `${10 + (i * 7.3) % 30}%`,
              background: `rgba(255,${190 + (i % 4) * 15},${40 + (i % 3) * 20},0.8)`,
              animation: `bd-particle ${2 + (i % 3) * 0.8}s ease-out infinite`,
              animationDelay: `${(i * 0.3) % 2}s`,
            }}
          />
        ))}

        {/* 콘텐츠 카드 */}
        <div
          className="relative text-center px-8 py-10"
          style={{ animation: 'bd-fadein 0.6s ease-out' }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* 금색 별 아이콘 */}
          <div
            className="mx-auto mb-6"
            style={{ animation: 'bd-float 4s ease-in-out infinite' }}
          >
            <svg width="64" height="64" viewBox="0 0 24 24">
              <defs>
                <linearGradient id="bd-star-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FFD700" />
                  <stop offset="100%" stopColor="#FFA500" />
                </linearGradient>
              </defs>
              <polygon
                points="12,2 14.5,8.5 21.5,8.5 16,13 18,20 12,16 6,20 8,13 2.5,8.5 9.5,8.5"
                fill="url(#bd-star-grad)"
                style={{ filter: 'drop-shadow(0 0 12px rgba(255,200,60,0.6))' }}
              />
            </svg>
          </div>

          <p className="text-amber-200/90 text-[20px] font-light leading-relaxed mb-2">
            오늘은 {nickname}님의
            <br />
            별이 태어난 날이에요
          </p>
          <p className="text-amber-300/50 text-[14px] font-light">
            당신의 {zodiacNameKo}가 가장 밝게 빛나는 날
          </p>

          <button
            onClick={handleClose}
            className="mt-8 px-6 py-2.5 rounded-full text-[13px] text-amber-200/80 bg-amber-400/10 border border-amber-400/25 hover:bg-amber-400/20 transition"
          >
            오늘의 하늘로
          </button>
        </div>
      </div>
    </>
  );
}

export { isBirthdayToday };
