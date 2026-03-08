'use client';

import {
  getZodiacBackgroundImage,
  getZodiacNameKo,
  getZodiacSign,
  loadTemplates,
  Pt,
  toDateString,
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

  // 연도와 월 추출
  const [year, m] = useMemo(() => month.split('-').map(Number), [month]);

  // 해당 월의 마지막 날 계산
  const daysInMonth = useMemo(() => new Date(year, m, 0).getDate(), [year, m]);

  // 해당 월의 날짜 리스트 생성 (YYYY-MM-DD)
  const dates = useMemo(() => {
    return Array.from({ length: daysInMonth }, (_, i) => {
      const day = i + 1;
      return `${year}-${String(m).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    });
  }, [year, m, daysInMonth]);

  // 해당 월의 대표 별자리 결정 (월의 중간 날짜 기준)
  const sign = useMemo(() => {
    const middleDate = new Date(year, m - 1, 15);
    return getZodiacSign(middleDate);
  }, [year, m]);

  const zodiacName = getZodiacNameKo(sign);
  const zodiacBgImage = getZodiacBackgroundImage(sign);

  // 앵커 포인트 (별자리 모양을 결정하는 지점들)
  const [anchorPoints, setAnchorPoints] = useState<Pt[]>([]);
  const [loading, setLoading] = useState(true);

  // 별자리 템플릿 로드
  useEffect(() => {
    const fetchTemplate = async () => {
      setLoading(true);
      try {
        const templates = await loadTemplates();
        const template = templates.find(
          (t: any) => t.zodiac_code === sign || t.star_code === sign
        );

        if (template && template.points && template.points.length > 0) {
          const path = template.path_index
            ? template.path_index.map((i: number) => template.points[i])
            : template.points;
          setAnchorPoints(path);
        }
      } catch (error) {
        console.error('Failed to load zodiac template:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTemplate();
  }, [sign]);

  // diaryList를 ConstellationSvg가 기대하는 Record 형식으로 변환
  const entriesRecord = useMemo(() => {
    const record: Record<string, any> = {};
    diaryList.forEach((diary) => {
      record[diary.entry_date] = {
        content: diary.content,
        emotion_polarity: diary.emotion_polarity,
        emotion_intensity: diary.emotion_intensity,
      };
    });
    return record;
  }, [diaryList]);

  // 모달 및 선택 상태
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedEntry, setSelectedEntry] = useState<Entry | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 별 클릭 핸들러
  const handleStarClick = useCallback(
    (date: string) => {
      const diary = diaryList.find((d) => d.entry_date === date);
      setSelectedDate(date);
      if (diary) {
        setSelectedEntry({
          content: diary.content,
          emotion_polarity: diary.emotion_polarity,
          emotion_intensity: diary.emotion_intensity,
        } as Entry);
      } else {
        setSelectedEntry(null);
      }
      setIsModalOpen(true);
    },
    [diaryList]
  );

  // 수정하기 핸들러 (다이어리 에디터로 이동)
  const handleEdit = useCallback(() => {
    if (selectedDate) {
      router.push(`/diary/editor?date=${selectedDate}`);
    }
  }, [selectedDate, router]);

  const todayStr = useMemo(() => toDateString(new Date()), []);

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
          기록 {diaryList.length}/{daysInMonth}
        </div>
      </div>

      {/* 별자리 카드 영역 */}
      <div className="hero-card overflow-hidden">
        <div className="hero-inner p-4 min-h-[320px] relative">
          {/* 별자리 배경 (starLoad와 동일한 스타일 답습) */}
          <div
            className="absolute inset-0 opacity-20 pointer-events-none"
            style={{
              backgroundImage: 'url(/images/bg/zodiac_bg/starLoad_bg.png)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
          <div
            className="absolute inset-0 opacity-30 pointer-events-none"
            style={{
              backgroundImage: `url(${zodiacBgImage})`,
              backgroundSize: 'contain',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
            }}
          />

          {/* SVG 별자리 레이어 */}
          <div className="relative z-10">
            {loading ? (
              <div className="flex items-center justify-center min-h-[280px]">
                <p className="text-white/40 text-sm animate-pulse">
                  별자리를 불러오는 중...
                </p>
              </div>
            ) : anchorPoints.length > 0 ? (
              <ConstellationSvg
                anchorPoints={anchorPoints}
                daysCount={daysInMonth}
                entries={entriesRecord}
                dates={dates}
                todayDate={todayStr}
                onStarClick={handleStarClick}
              />
            ) : (
              <div className="flex items-center justify-center min-h-[280px]">
                <p className="text-white/40 text-sm">
                  별자리 데이터를 찾을 수 없습니다.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 안내 문구 */}
      <p className="text-center text-[12px] text-white/40 pt-2">
        별을 눌러 그날의 기록을 확인하거나 수정할 수 있어요.
      </p>

      {/* 상세 확인 및 수정 모달 */}
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
