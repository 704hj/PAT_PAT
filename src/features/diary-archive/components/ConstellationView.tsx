'use client';

import {
  getZodiacBackgroundImage,
  toDateString,
  type Pt,
  type ZodiacSign,
} from '@/lib/zodiac';
import ConstellationSvg from '@/shared/components/ConstellationSvg';
import EntryModal from '@/shared/components/EntryModal';
import { Entry } from '@/utils/entries';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';

type Props = {
  month: string; // YYYY-MM
  diaryList: TDiaryItem[];
};

/**
 * ConstellationView: 기록 보관함의 '목록 보기'를 대체하는 별자리 뷰 컴포넌트입니다.
 * 선택된 월의 기록들을 밤하늘의 별자리처럼 시각화하여 보여줍니다.
 */
export function ConstellationView({ month, diaryList }: Props) {
  const router = useRouter();

  const [year, m] = useMemo(() => month.split('-').map(Number), [month]);

  // 해당 월 중간 날짜를 기준으로 별자리 시즌 조회 (15일 사용)
  const representativeDate = useMemo(
    () => `${year}-${String(m).padStart(2, '0')}-15`,
    [year, m],
  );

  // DB에서 가져오는 시즌 정보
  const [zodiacName, setZodiacName] = useState('');
  const [zodiacCode, setZodiacCode] = useState<ZodiacSign | null>(null);
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);
  const [starPoints, setStarPoints] = useState<Pt[]>([]);
  const [loading, setLoading] = useState(true);

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

  // 시즌 정보 + 좌표 로드
  useEffect(() => {
    setLoading(true);
    (async () => {
      try {
        const periodRes = await fetch(
          `/api/constellation/period/by-date?date=${representativeDate}`,
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
      } finally {
        setLoading(false);
      }
    })();
  }, [representativeDate]);

  // diaryList를 ConstellationSvg가 기대하는 Record 형식으로 변환
  const entriesRecord = useMemo(() => {
    const record: Record<string, any> = {};
    diaryList.forEach((diary) => {
      record[diary.entry_date] = {
        content: diary.content,
        emotion_polarity: diary.emotion_polarity,
        emotion_intensity: diary.emotion_intensity,
        star_color_hex: diary.star_color_hex ?? undefined,
      };
    });
    return record;
  }, [diaryList]);

  // 모달 및 선택 상태
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedEntry, setSelectedEntry] = useState<Entry | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleStarClick = useCallback(
    (date: string) => {
      const diary = diaryList.find((d) => d.entry_date === date);
      setSelectedDate(date);
      if (diary) {
        setSelectedEntry({
          content: diary.content,
          emotion_polarity: diary.emotion_polarity,
          emotion_intensity: diary.emotion_intensity,
          star_color_hex: diary.star_color_hex ?? undefined,
        } as Entry);
      } else {
        setSelectedEntry(null);
      }
      setIsModalOpen(true);
    },
    [diaryList],
  );

  const handleEdit = useCallback(() => {
    if (selectedDate) {
      router.push(`/diary/editor?date=${selectedDate}`);
    }
  }, [selectedDate, router]);

  const todayStr = useMemo(
    () => new Date(Date.now() + 9 * 60 * 60 * 1000).toISOString().slice(0, 10),
    [],
  );

  const progressCount = useMemo(
    () =>
      diaryList.filter(
        (d) => dates.includes(d.entry_date),
      ).length,
    [diaryList, dates],
  );

  return (
    <div className="space-y-4">
      {/* 별자리 정보 헤더 */}
      <div className="flex items-center justify-between px-1">
        <div className="space-y-0.5">
          <h3 className="text-[15px] font-medium text-white/90">
            {zodiacName}
          </h3>
          <p className="text-[12px] text-white/50">
            {year}년 {m}월의 밤하늘
          </p>
        </div>
        <div className="chip chip-glow text-[11px]">
          기록 {progressCount}/{dates.length}
        </div>
      </div>

      {/* 별자리 카드 영역 */}
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
          {zodiacBgImage && (
            <div
              className="absolute inset-0 opacity-30 pointer-events-none"
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
                entries={entriesRecord}
                dates={dates}
                todayDate={todayStr}
                onStarClick={handleStarClick}
                theme="default"
              />
            )}
          </div>
        </div>
      </div>

      <p className="text-center text-[12px] text-white/40 pt-2">
        별을 눌러 그날의 기록을 확인하거나 수정할 수 있어요.
      </p>

      <EntryModal
        isOpen={isModalOpen}
        date={selectedDate}
        entry={selectedEntry}
        onClose={() => setIsModalOpen(false)}
        onEdit={handleEdit}
      />
    </div>
  );
}
