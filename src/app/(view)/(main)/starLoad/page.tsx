'use client';

import {
  displayDate,
  getZodiacBackgroundImage,
  toDateString,
  type Pt,
  type ZodiacSign,
} from '@/lib/zodiac';
import ConstellationSvg from '@/shared/components/ConstellationSvg';
import EntryModal from '@/shared/components/EntryModal';
import { Entry, loadEntriesByRange } from '@/utils/entries';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';

export default function Page() {
  const router = useRouter();
  const todayStr = useMemo(
    () => new Date(Date.now() + 9 * 60 * 60 * 1000).toISOString().slice(0, 10),
    [],
  );

  // DB에서 가져오는 시즌 정보
  const [zodiacName, setZodiacName] = useState('');
  const [zodiacCode, setZodiacCode] = useState<ZodiacSign | null>(null);
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);
  const [starPoints, setStarPoints] = useState<Pt[]>([]);

  const zodiacBgImage = useMemo(
    () => (zodiacCode ? getZodiacBackgroundImage(zodiacCode) : ''),
    [zodiacCode],
  );

  // 시즌 날짜 배열 (start_date ~ end_date)
  const dates = useMemo(() => {
    if (!startDate || !endDate) return [];
    const result: string[] = [];
    const current = new Date(startDate);
    const end = new Date(endDate);
    while (current <= end) {
      result.push(toDateString(current));
      current.setDate(current.getDate() + 1);
    }
    return result;
  }, [startDate, endDate]);

  const rangeDisplay = useMemo(() => {
    if (!startDate || !endDate) return '';
    return `${displayDate(startDate)} ~ ${displayDate(endDate)}`;
  }, [startDate, endDate]);

  // 일기 데이터
  const [entries, setEntries] = useState<Record<string, Entry>>({});
  const [loading, setLoading] = useState(true);

  // 모달 상태
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedEntry, setSelectedEntry] = useState<Entry | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [showStarEffect, setShowStarEffect] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowStarEffect(false), 2200);
    return () => clearTimeout(timer);
  }, []);

  // 1) 시즌 정보 + 좌표 로드
  useEffect(() => {
    (async () => {
      const periodRes = await fetch(
        `/api/constellation/period/by-date?date=${todayStr}`,
        { cache: 'no-store' },
      );
      const periodJson = await periodRes.json();
      if (!periodJson.ok) return;

      const { period_id, start_date, end_date, constellation_master } =
        periodJson.data;
      setZodiacName(constellation_master?.name_ko ?? '');
      setZodiacCode((constellation_master?.code as ZodiacSign) ?? null);
      setStartDate(start_date);
      setEndDate(end_date);

      const pointsRes = await fetch(
        `/api/constellation/period/${period_id}/points`,
        { cache: 'no-store' },
      );
      const pointsJson = await pointsRes.json();
      if (!pointsJson.ok) return;

      const pts: Pt[] = (pointsJson.data ?? []).map(
        (r: { day_index: number; x: number; y: number }) => ({
          x: r.x,
          y: r.y,
        }),
      );
      setStarPoints(pts);
    })();
  }, [todayStr]);

  // 2) 일기 데이터 로드 (시즌 날짜 확정 후)
  useEffect(() => {
    if (!startDate || !endDate) return;

    (async () => {
      setLoading(true);
      try {
        const loaded = await loadEntriesByRange(
          new Date(startDate),
          new Date(endDate),
        );
        setEntries(loaded);
      } finally {
        setLoading(false);
      }
    })();
  }, [startDate, endDate]);

  const handleStarClick = useCallback(
    (date: string) => {
      const entry = entries[date];

      if (!entry) {
        if (date === todayStr) {
          router.push('/diary/editor');
        }
        return;
      }

      setSelectedDate(date);
      setSelectedEntry(entry);
      setIsModalOpen(true);
    },
    [entries, todayStr, router],
  );

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedDate(null);
    setSelectedEntry(null);
  }, []);

  const handleEdit = useCallback(() => {
    const diaryId = selectedEntry?.diary_id;
    if (diaryId) {
      router.push(`/diary/editor?diaryId=${diaryId}`);
    } else if (selectedDate) {
      router.push(`/diary/editor?date=${selectedDate}`);
    } else {
      router.push('/diary/editor');
    }
  }, [selectedEntry, selectedDate, router]);

  const progressCount = useMemo(() => Object.keys(entries).length, [entries]);

  return (
    <main className="min-h-[100svh] text-white">
      {/* 별 생성 인트로 오버레이 */}
      <style>{`
        @keyframes starBirth {
          0%   { transform: scale(0.2); opacity: 0; filter: drop-shadow(0 0 0px rgba(180,210,255,0)); }
          30%  { transform: scale(1.3); opacity: 1; filter: drop-shadow(0 0 20px rgba(180,210,255,0.9)); }
          60%  { transform: scale(1.0); opacity: 1; filter: drop-shadow(0 0 30px rgba(180,210,255,1)); }
          100% { transform: scale(1.6); opacity: 0; filter: drop-shadow(0 0 0px rgba(180,210,255,0)); }
        }
        @keyframes overlayFade {
          0%   { opacity: 1; }
          70%  { opacity: 1; }
          100% { opacity: 0; }
        }
        @keyframes textReveal {
          0%   { opacity: 0; transform: translateY(6px); }
          40%  { opacity: 0; transform: translateY(6px); }
          70%  { opacity: 1; transform: translateY(0); }
          100% { opacity: 0; }
        }
        @keyframes ripple {
          0%   { transform: scale(0.5); opacity: 0.6; }
          100% { transform: scale(3);   opacity: 0; }
        }
      `}</style>
      {showStarEffect && (
        <div
          className="fixed inset-0 z-50 flex flex-col items-center justify-center"
          style={{
            background: 'rgba(5,11,28,0.92)',
            animation: 'overlayFade 2.2s ease-in-out forwards',
            pointerEvents: 'none',
          }}
        >
          <div className="relative flex items-center justify-center">
            {/* 파문 효과 */}
            <div className="absolute w-20 h-20 rounded-full border border-white/20"
              style={{ animation: 'ripple 1.5s ease-out 0.2s forwards' }} />
            <div className="absolute w-20 h-20 rounded-full border border-white/10"
              style={{ animation: 'ripple 1.5s ease-out 0.5s forwards' }} />
            {/* 별 */}
            <svg viewBox="0 0 24 24" width="48" height="48"
              style={{ animation: 'starBirth 2.2s ease-in-out forwards' }}>
              <polygon
                points="12,2 13.8,8.6 20.5,8.6 15.4,12.8 17.2,19.4 12,15.2 6.8,19.4 8.6,12.8 3.5,8.6 10.2,8.6"
                fill="rgba(200,220,255,0.95)"
              />
            </svg>
          </div>
          <p className="mt-6 text-[14px] font-light text-white/70 tracking-wide"
            style={{ animation: 'textReveal 2.2s ease-in-out forwards' }}>
            오늘의 별이 생겼어요
          </p>
        </div>
      )}

      {/* 배경 */}
      <div className="fixed inset-0 -z-10 bg-space">
        <div className="nebula nebula-a opacity-30" />
        <div className="nebula nebula-b opacity-30" />
        <div className="nebula nebula-c opacity-30" />
        <div className="starfield opacity-20" />
        <div className="vignette opacity-30" />
      </div>

      <section className="mx-auto w-full max-w-[480px] px-5 pt-5 pb-28">
        {/* Top bar */}
        <header className="flex items-center justify-between">
          <button
            onClick={() => router.push('/home')}
            className="h-10 w-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center transition active:opacity-50"
            aria-label="홈으로"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="text-white/70">
              <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z" />
              <path d="M9 21V12h6v9" />
            </svg>
          </button>
          <div className="text-center">
            <div className="text-[16px] font-semibold tracking-[-0.01em]">
              {zodiacName}
            </div>
            <div className="text-[12px] text-white/65">{rangeDisplay}</div>
          </div>
          <span className="w-10" />
        </header>

        {/* Hero constellation card */}
        <div className="mt-4 hero-card">
          <div className="hero-halo" />
          <div className="hero-inner p-4 min-h-[300px] relative">
            <div
              className="absolute inset-0 opacity-30 pointer-events-none"
              style={{
                backgroundImage: 'url(/images/bg/zodiac_bg/starLoad_bg.png)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
              }}
              aria-hidden="true"
            />
            <div className="relative z-10">
              {loading || starPoints.length === 0 ? (
                <div className="flex flex-col items-center justify-center min-h-[280px]">
                  <p className="text-white/40 text-[13px] tracking-tight animate-pulse">
                    별자리를 불러오고 있습니다...
                  </p>
                </div>
              ) : (
                <ConstellationSvg
                  bgImage={zodiacBgImage}
                  zodiacCode={zodiacCode ?? undefined}
                  starPoints={starPoints}
                  entries={entries}
                  dates={dates}
                  todayDate={todayStr}
                  onStarClick={handleStarClick}
                  theme="default"
                />
              )}
            </div>
          </div>
        </div>
        {/* 안내 문구 */}
        <div className="mt-5 text-center">
          <p className="text-white/80 text-[15px] font-light">오늘의 별이 담겼어요</p>
          <p className="text-white/40 text-[12px] mt-1">
            {progressCount}/{dates.length}개 · 별자리를 채워가고 있어요
          </p>
        </div>

        {/* 홈 링크 */}
        <button
          onClick={() => router.push('/home')}
          className="mt-4 w-full text-center text-[13px] text-white/35 active:opacity-50 transition-opacity"
        >
          홈으로 →
        </button>
      </section>

      <EntryModal
        isOpen={isModalOpen}
        date={selectedDate}
        entry={selectedEntry}
        onClose={handleCloseModal}
        onEdit={handleEdit}
      />
    </main>
  );
}
