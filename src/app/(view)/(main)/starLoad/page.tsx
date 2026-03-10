'use client';

import {
  displayDate,
  getZodiacBackgroundImage,
  toDateString,
  type Pt,
  type ZodiacSign,
} from '@/lib/zodiac';
import BackButton from '@/shared/components/BackButton';
import ConstellationSvg from '@/shared/components/ConstellationSvg';
import EntryModal from '@/shared/components/EntryModal';
import { Entry, getEntryByDate, loadEntriesByRange } from '@/utils/entries';
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
    async (date: string) => {
      setSelectedDate(date);
      const entry = entries[date] || (await getEntryByDate(date));
      setSelectedEntry(entry);
      setIsModalOpen(true);
    },
    [entries],
  );

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedDate(null);
    setSelectedEntry(null);
  }, []);

  const handleEdit = useCallback(() => {
    router.push(
      selectedDate ? `/diary/editor?date=${selectedDate}` : '/diary/editor',
    );
  }, [selectedDate, router]);

  const progressCount = useMemo(() => Object.keys(entries).length, [entries]);

  return (
    <main className="min-h-[100svh] text-white">
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
          <BackButton />
          <div className="text-center">
            <div className="text-[16px] font-semibold tracking-[-0.01em]">
              {zodiacName}
            </div>
            <div className="text-[12px] text-white/65">{rangeDisplay}</div>
          </div>
          <button
            className="h-10 w-10 rounded-xl bg-white/5 border border-white/10 hover:bg-white/8 transition"
            aria-label="정보"
          >
            i
          </button>
        </header>

        {/* Progress row */}
        <div className="mt-4 flex items-center justify-between">
          <div className="inline-flex items-center gap-2">
            <span className="chip">이달의 별자리</span>
            <span className="chip chip-soft">
              {new Date(todayStr).toLocaleDateString('ko-KR')}
            </span>
          </div>
          <span className="chip chip-glow">
            진행 {progressCount}/{dates.length}
          </span>
        </div>

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
            {zodiacBgImage && (
              <div
                className="absolute inset-0 opacity-40 pointer-events-none"
                style={{
                  backgroundImage: `url(${zodiacBgImage})`,
                  backgroundSize: 'contain',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat',
                }}
                aria-hidden="true"
              />
            )}

            <div className="relative z-10">
              {loading || starPoints.length === 0 ? (
                <div className="flex flex-col items-center justify-center min-h-[280px]">
                  <p className="text-white/40 text-[13px] tracking-tight animate-pulse">
                    별자리를 불러오고 있습니다...
                  </p>
                </div>
              ) : (
                <ConstellationSvg
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
