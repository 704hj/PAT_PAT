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

type PeriodInfo = {
  period_id: number;
  start_date: string;
  end_date: string;
  name_ko: string;
  code: ZodiacSign;
};

async function fetchPeriodByDate(date: string): Promise<PeriodInfo | null> {
  const res = await fetch(
    `/api/constellation/period/by-date?date=${date}`,
    { cache: 'no-store' },
  );
  const json = await res.json();
  if (!json.ok) return null;
  const { period_id, start_date, end_date, constellation_master } = json.data;
  return {
    period_id,
    start_date,
    end_date,
    name_ko: constellation_master?.name_ko ?? '',
    code: (constellation_master?.code ?? 'aries') as ZodiacSign,
  };
}

function addDays(dateStr: string, days: number): string {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + days);
  return toDateString(d);
}

export function ConstellationView() {
  const router = useRouter();

  const todayStr = useMemo(
    () => new Date(Date.now() + 9 * 60 * 60 * 1000).toISOString().slice(0, 10),
    [],
  );

  const [period, setPeriod] = useState<PeriodInfo | null>(null);
  const [starPoints, setStarPoints] = useState<Pt[]>([]);
  const [entries, setEntries] = useState<Record<string, Entry>>({});
  const [loading, setLoading] = useState(true);

  const zodiacBgImage = useMemo(
    () => (period?.code ? getZodiacBackgroundImage(period.code) : ''),
    [period?.code],
  );

  const dates = useMemo(() => {
    if (!period) return [];
    const result: string[] = [];
    const current = new Date(period.start_date);
    const end = new Date(period.end_date);
    while (current <= end) {
      result.push(toDateString(current));
      current.setDate(current.getDate() + 1);
    }
    return result;
  }, [period]);

  const rangeDisplay = useMemo(() => {
    if (!period) return '';
    return `${displayDate(period.start_date)} ~ ${displayDate(period.end_date)}`;
  }, [period]);

  const loadPeriod = useCallback(async (date: string) => {
    setLoading(true);
    // 전환 중 starPoints/dates 불일치 방지: 먼저 초기화
    setPeriod(null);
    setStarPoints([]);
    setEntries({});
    try {
      const info = await fetchPeriodByDate(date);
      if (!info) return;

      const [pointsRes, loadedEntries] = await Promise.all([
        fetch(`/api/constellation/period/${info.period_id}/points`, {
          cache: 'no-store',
        }).then((r) => r.json()),
        loadEntriesByRange(new Date(info.start_date), new Date(info.end_date)),
      ]);

      const pts = pointsRes.ok
        ? (pointsRes.data ?? []).map(
            (r: { day_index: number; x: number; y: number }) => ({
              x: r.x,
              y: r.y,
            }),
          )
        : [];

      // period, starPoints, entries를 한 렌더 사이클에서 가능한 한 같이 설정
      setPeriod(info);
      setStarPoints(pts);
      setEntries(loadedEntries);
    } finally {
      setLoading(false);
    }
  }, []);

  // 초기 로드: 오늘 날짜 기준 시즌
  useEffect(() => {
    loadPeriod(todayStr);
  }, [todayStr, loadPeriod]);

  const goToPrev = useCallback(() => {
    if (!period) return;
    loadPeriod(addDays(period.start_date, -1));
  }, [period, loadPeriod]);

  const goToNext = useCallback(() => {
    if (!period) return;
    // 다음 시즌이 아직 오지 않았으면 이동 불가
    const nextDate = addDays(period.end_date, 1);
    if (nextDate > todayStr) return;
    loadPeriod(nextDate);
  }, [period, loadPeriod, todayStr]);

  const isNextDisabled = useMemo(() => {
    if (!period) return true;
    return addDays(period.end_date, 1) > todayStr;
  }, [period, todayStr]);

  // 모달
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedEntry, setSelectedEntry] = useState<Entry | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleStarClick = useCallback(
    (date: string) => {
      const entry = entries[date];

      // 기록 없는 별 처리
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
    <div className="space-y-4">
      {/* 시즌 네비게이션 */}
      <div className="flex items-center justify-between gap-2">
        <button
          onClick={goToPrev}
          className="h-9 px-3 rounded-xl bg-white/5 border border-white/10
                     text-white/60 text-[13px] hover:bg-white/10 transition"
        >
          ←
        </button>

        <div className="flex-1 text-center">
          <p className="text-[16px] font-semibold text-white">
            {period?.name_ko ?? ''}
          </p>
          <p className="text-[11px] text-white/45 mt-0.5">{rangeDisplay}</p>
        </div>

        <button
          onClick={goToNext}
          disabled={isNextDisabled}
          className="h-9 px-3 rounded-xl bg-white/5 border border-white/10
                     text-white/60 text-[13px] hover:bg-white/10 transition
                     disabled:opacity-30 disabled:cursor-not-allowed"
        >
          →
        </button>
      </div>

      {/* 진행도 */}
      <div className="flex justify-end">
        <span className="chip chip-glow text-[11px]">
          기록 {progressCount}/{dates.length}
        </span>
      </div>

      {/* 별자리 카드 */}
      <div className="hero-card overflow-hidden">
        <div className="hero-inner p-4 min-h-[320px] relative">
          <div
            className="absolute inset-0 opacity-20 pointer-events-none"
            style={{
              backgroundImage: 'url(/images/bg/zodiac_bg/starLoad_bg.png)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
            aria-hidden="true"
          />
          <div className="relative z-10">
            {loading || starPoints.length === 0 ? (
              <div className="flex items-center justify-center min-h-[280px]">
                <p className="text-white/40 text-[13px] animate-pulse">
                  별자리를 불러오고 있습니다...
                </p>
              </div>
            ) : (
              <ConstellationSvg
                bgImage={zodiacBgImage}
                zodiacCode={period?.code}
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

      <p className="text-center text-[12px] text-white/40 pt-1">
        별을 눌러 그날의 기록을 확인하거나 수정할 수 있어요.
      </p>

      <EntryModal
        isOpen={isModalOpen}
        date={selectedDate}
        entry={selectedEntry}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedDate(null);
          setSelectedEntry(null);
        }}
        onEdit={handleEdit}
      />
    </div>
  );
}
