'use client';

import {
  displayDate,
  getZodiacBackgroundImage,
  samplePolyline,
  toDateString,
  type Pt,
  type ZodiacSign,
} from '@/lib/zodiac';
import ConstellationSvg from '@/shared/components/ConstellationSvg';
import { useEffect, useMemo, useState } from 'react';

// ──────────────────────────────────────────────
// 상수
// ──────────────────────────────────────────────
const PERIODS = [
  {
    period_id: 27,
    code: 'pisces',
    name_ko: '물고기자리',
    start_date: '2026-02-19',
    end_date: '2026-03-20',
  },
  {
    period_id: 28,
    code: 'aries',
    name_ko: '양자리',
    start_date: '2026-03-21',
    end_date: '2026-04-19',
  },
  {
    period_id: 26,
    code: 'aquarius',
    name_ko: '물병자리',
    start_date: '2026-01-20',
    end_date: '2026-02-18',
  },
  {
    period_id: 25,
    code: 'capricorn',
    name_ko: '염소자리',
    start_date: '2025-12-22',
    end_date: '2026-01-19',
  },
  {
    period_id: 24,
    code: 'sagittarius',
    name_ko: '사수자리',
    start_date: '2025-11-22',
    end_date: '2025-12-21',
  },
  {
    period_id: 23,
    code: 'scorpio',
    name_ko: '전갈자리',
    start_date: '2025-10-23',
    end_date: '2025-11-21',
  },
  {
    period_id: 22,
    code: 'libra',
    name_ko: '천칭자리',
    start_date: '2025-09-23',
    end_date: '2025-10-22',
  },
  {
    period_id: 21,
    code: 'virgo',
    name_ko: '처녀자리',
    start_date: '2025-08-23',
    end_date: '2025-09-22',
  },
  {
    period_id: 20,
    code: 'leo',
    name_ko: '사자자리',
    start_date: '2025-07-23',
    end_date: '2025-08-22',
  },
  {
    period_id: 19,
    code: 'cancer',
    name_ko: '게자리',
    start_date: '2025-06-21',
    end_date: '2025-07-22',
  },
  {
    period_id: 18,
    code: 'gemini',
    name_ko: '쌍둥이자리',
    start_date: '2025-05-21',
    end_date: '2025-06-20',
  },
  {
    period_id: 17,
    code: 'taurus',
    name_ko: '황소자리',
    start_date: '2025-04-20',
    end_date: '2025-05-20',
  },
] as const;

type CoordSource = 'db' | 'json' | 'custom';
type MockPattern =
  | 'none'
  | 'all_positive'
  | 'all_negative'
  | 'mixed'
  | 'random';

// ──────────────────────────────────────────────
// 모의 데이터 생성
// ──────────────────────────────────────────────
function generateMockEntries(
  dates: string[],
  density: number,
  pattern: MockPattern,
  intensity: number
): Record<
  string,
  { content: string; emotion_polarity: string; emotion_intensity: number }
> {
  const result: Record<string, any> = {};
  dates.forEach((date, i) => {
    if (pattern === 'none') return;
    if (Math.random() * 100 > density) return;
    let polarity: string;
    if (pattern === 'all_positive') polarity = 'POSITIVE';
    else if (pattern === 'all_negative') polarity = 'NEGATIVE';
    else if (pattern === 'mixed')
      polarity = i % 2 === 0 ? 'POSITIVE' : 'NEGATIVE';
    else polarity = Math.random() > 0.5 ? 'POSITIVE' : 'NEGATIVE';
    result[date] = {
      content: `테스트 기록 (${date})`,
      emotion_polarity: polarity,
      emotion_intensity:
        intensity === 0 ? Math.ceil(Math.random() * 5) : intensity,
    };
  });
  return result;
}

// ──────────────────────────────────────────────
// 컴포넌트
// ──────────────────────────────────────────────
export default function ConstellationTestPage() {
  const [selectedPeriodId, setSelectedPeriodId] = useState(27);
  const period =
    PERIODS.find((p) => p.period_id === selectedPeriodId) ?? PERIODS[0];

  // 좌표 소스
  const [coordSource, setCoordSource] = useState<CoordSource>('db');
  const [dbPoints, setDbPoints] = useState<Pt[]>([]);
  const [jsonPoints, setJsonPoints] = useState<Pt[]>([]);
  const [customJson, setCustomJson] = useState('');
  const [customJsonError, setCustomJsonError] = useState('');
  const [loadingPoints, setLoadingPoints] = useState(false);

  // 배경
  const [bgOpacity, setBgOpacity] = useState(40);
  const [showZodiacBg, setShowZodiacBg] = useState(true);

  // 모의 데이터
  const [density, setDensity] = useState(60);
  const [pattern, setPattern] = useState<MockPattern>('random');
  const [fixedIntensity, setFixedIntensity] = useState(0);
  const [mockSeed, setMockSeed] = useState(0);

  const dates = useMemo(() => {
    const result: string[] = [];
    const cur = new Date(period.start_date);
    const end = new Date(period.end_date);
    while (cur <= end) {
      result.push(toDateString(cur));
      cur.setDate(cur.getDate() + 1);
    }
    return result;
  }, [period]);

  const [entries, setEntries] = useState<Record<string, any>>({});
  useEffect(() => {
    setEntries(generateMockEntries(dates, density, pattern, fixedIntensity));
  }, [dates, density, pattern, fixedIntensity, mockSeed]);

  const zodiacBgImage = getZodiacBackgroundImage(period.code as ZodiacSign);

  // DB 좌표 로드
  useEffect(() => {
    setLoadingPoints(true);
    setDbPoints([]);
    fetch(`/api/constellation/period/${period.period_id}/points`, {
      cache: 'no-store',
    })
      .then((r) => r.json())
      .then((json) => {
        if (json.ok)
          setDbPoints((json.data ?? []).map((r: any) => ({ x: r.x, y: r.y })));
      })
      .finally(() => setLoadingPoints(false));
  }, [period.period_id]);

  // star.json 파일 기반 좌표 로드
  useEffect(() => {
    if (coordSource !== 'json') return;
    setLoadingPoints(true);
    setJsonPoints([]);
    fetch('/mock/star.json', { cache: 'no-store' })
      .then((r) => r.json())
      .then((data: any[]) => {
        const star = data.find((s) => s.starCode === period.code);
        if (!star?.points?.length) return;
        const path: Pt[] = star.pathIndex?.length
          ? star.pathIndex.map((i: number) => star.points[i]).filter(Boolean)
          : star.points;
        setJsonPoints(samplePolyline(path, dates.length));
      })
      .finally(() => setLoadingPoints(false));
  }, [period.code, coordSource, dates.length]);

  // 커스텀 JSON 파싱
  const customPoints = useMemo((): Pt[] => {
    if (!customJson.trim()) return [];
    try {
      const parsed = JSON.parse(customJson);
      if (!Array.isArray(parsed)) throw new Error('배열이 아닙니다');
      const pts = parsed.map((p: any) => {
        if (typeof p.x !== 'number' || typeof p.y !== 'number')
          throw new Error('x, y가 숫자여야 합니다');
        return { x: p.x, y: p.y };
      });
      setCustomJsonError('');
      return pts;
    } catch (e: any) {
      setCustomJsonError(e.message);
      return [];
    }
  }, [customJson]);

  const starPoints =
    coordSource === 'db'
      ? dbPoints
      : coordSource === 'json'
      ? jsonPoints
      : customPoints;

  const todayStr = useMemo(
    () => new Date(Date.now() + 9 * 60 * 60 * 1000).toISOString().slice(0, 10),
    []
  );

  return (
    <div className="min-h-[100svh] text-white bg-[#050b1c]">
      <div className="mx-auto max-w-[480px] px-4 pt-6 pb-32 space-y-5">
        <div>
          <h1 className="text-[18px] font-semibold">🔬 별자리 테스트</h1>
          <p className="text-white/40 text-[12px] mt-0.5">
            좌표 소스 · 배경 · 모의데이터를 자유롭게 조합해볼 수 있어요
          </p>
        </div>

        {/* ── 별자리 시즌 ── */}
        <section>
          <Label>별자리 시즌</Label>
          <div className="grid grid-cols-3 gap-2 mt-2">
            {PERIODS.map((p) => (
              <button
                key={p.period_id}
                onClick={() => setSelectedPeriodId(p.period_id)}
                className={[
                  'py-2 rounded-xl border text-[12px] transition',
                  p.period_id === selectedPeriodId
                    ? 'bg-white/15 border-white/40 text-white'
                    : 'bg-white/4 border-white/10 text-white/55',
                ].join(' ')}
              >
                {p.name_ko}
              </button>
            ))}
          </div>
          <p className="mt-1 text-white/35 text-[11px]">
            {displayDate(period.start_date)} ~ {displayDate(period.end_date)} (
            {dates.length}일)
          </p>
        </section>

        {/* ── 좌표 소스 ── */}
        <section>
          <Label>좌표 소스</Label>
          <div className="grid grid-cols-3 gap-2 mt-2">
            {(
              [
                {
                  key: 'db',
                  label: 'DB 좌표',
                  desc: 'constellation_period_day_point',
                },
                {
                  key: 'json',
                  label: 'star.json',
                  desc: 'public/mock/star.json → 보간',
                },
                { key: 'custom', label: '커스텀 JSON', desc: '직접 좌표 입력' },
              ] as { key: CoordSource; label: string; desc: string }[]
            ).map((opt) => (
              <button
                key={opt.key}
                onClick={() => setCoordSource(opt.key)}
                className={[
                  'py-2 px-2 rounded-xl border text-left transition',
                  coordSource === opt.key
                    ? 'bg-white/15 border-white/40'
                    : 'bg-white/4 border-white/10',
                ].join(' ')}
              >
                <p
                  className={[
                    'text-[12px] font-medium',
                    coordSource === opt.key ? 'text-white' : 'text-white/60',
                  ].join(' ')}
                >
                  {opt.label}
                </p>
                {/* <p className="text-[9px] text-white/35 mt-0.5 leading-tight">{opt.desc}</p> */}
              </button>
            ))}
          </div>

          {/* 커스텀 JSON 입력 */}
          {coordSource === 'custom' && (
            <div className="mt-2">
              <textarea
                value={customJson}
                onChange={(e) => setCustomJson(e.target.value)}
                placeholder={`[{"x":10,"y":20},{"x":30,"y":50},...]`}
                rows={5}
                className="w-full rounded-xl bg-white/4 border border-white/10 p-3
                           text-[12px] text-white/80 font-mono resize-none
                           placeholder:text-white/25 focus:outline-none focus:border-white/25"
              />
              {customJsonError && (
                <p className="mt-1 text-[11px] text-red-400">
                  ⚠ {customJsonError}
                </p>
              )}
              <p className="mt-1 text-[10px] text-white/30">
                viewBox 0~100 범위 좌표 · {customPoints.length}개 파싱됨
              </p>

              {/* 예시 버튼들 */}
              <div className="mt-2 flex flex-wrap gap-1.5">
                <p className="w-full text-[10px] text-white/35">
                  예시 불러오기
                </p>
                {EXAMPLE_COORDS.map((ex) => (
                  <button
                    key={ex.label}
                    onClick={() =>
                      setCustomJson(JSON.stringify(ex.pts, null, 2))
                    }
                    className="px-2 py-1 rounded-lg bg-white/6 border border-white/10 text-[10px] text-white/55"
                  >
                    {ex.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 좌표 정보 */}
          <div className="mt-2 flex items-center gap-2">
            <span className="text-[11px] text-white/35">
              {coordSource === 'db' && `DB: ${dbPoints.length}개`}
              {coordSource === 'json' &&
                `star.json: ${jsonPoints.length}개`}
              {coordSource === 'custom' && `커스텀: ${customPoints.length}개`}
            </span>
            {coordSource === 'db' && (
              <button
                onClick={() => {
                  const json = JSON.stringify(starPoints, null, 2);
                  setCustomJson(json);
                  setCoordSource('custom');
                }}
                className="px-2 py-0.5 rounded-lg bg-white/6 border border-white/10 text-[10px] text-white/50"
              >
                → 커스텀으로 복사
              </button>
            )}
          </div>
        </section>

        {/* ── 배경 ── */}
        <section>
          <Label>배경</Label>
          <div className="mt-2 space-y-3 bg-white/4 border border-white/8 rounded-xl p-3">
            <div className="flex items-center justify-between">
              <span className="text-[13px] text-white/70">별자리 이미지</span>
              <Toggle value={showZodiacBg} onChange={setShowZodiacBg} />
            </div>
            <div>
              <div className="flex justify-between text-[12px] text-white/50 mb-1">
                <span>opacity</span>
                <span>{bgOpacity}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                value={bgOpacity}
                onChange={(e) => setBgOpacity(Number(e.target.value))}
                className="w-full slider-star"
              />
            </div>
          </div>
        </section>

        {/* ── 모의 데이터 ── */}
        <section>
          <Label>모의 데이터</Label>
          <div className="mt-2 space-y-3 bg-white/4 border border-white/8 rounded-xl p-3">
            <div>
              <p className="text-[12px] text-white/50 mb-2">감정 패턴</p>
              <div className="grid grid-cols-3 gap-1.5">
                {(
                  [
                    { key: 'none', label: '없음' },
                    { key: 'all_positive', label: '전부 긍정' },
                    { key: 'all_negative', label: '전부 부정' },
                    { key: 'mixed', label: '교대' },
                    { key: 'random', label: '랜덤' },
                  ] as { key: MockPattern; label: string }[]
                ).map((opt) => (
                  <button
                    key={opt.key}
                    onClick={() => setPattern(opt.key)}
                    className={[
                      'py-1.5 rounded-lg border text-[11px] transition',
                      pattern === opt.key
                        ? 'bg-white/15 border-white/40 text-white'
                        : 'bg-white/4 border-white/10 text-white/55',
                    ].join(' ')}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
            <SliderRow
              label="기록 밀도"
              value={density}
              setValue={setDensity}
              min={0}
              max={100}
              unit="%"
            />
            <SliderRow
              label="감정 강도"
              value={fixedIntensity}
              setValue={setFixedIntensity}
              min={0}
              max={5}
              step={1}
              unit={fixedIntensity === 0 ? ' (랜덤)' : ''}
            />
            <button
              onClick={() => setMockSeed((s) => s + 1)}
              className="w-full py-2 rounded-xl bg-white/8 border border-white/15 text-[13px] text-white/70"
            >
              🔄 새로 생성
            </button>
          </div>
        </section>

        {/* ── 프리뷰 ── */}
        <section>
          <div className="flex items-center justify-between mb-2">
            <Label>프리뷰</Label>
            <span className="text-[11px] text-white/40">
              기록 {Object.keys(entries).length}/{dates.length} ·{' '}
              {starPoints.length}개 좌표
            </span>
          </div>

          <div className="relative rounded-2xl overflow-hidden border border-white/10 min-h-[340px] bg-[#07102a]">
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundImage: 'url(/images/bg/zodiac_bg/starLoad_bg.png)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                opacity: (bgOpacity / 100) * 0.5,
              }}
            />
            {showZodiacBg && zodiacBgImage && (
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  backgroundImage: `url(${zodiacBgImage})`,
                  backgroundSize: 'contain',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat',
                  opacity: bgOpacity / 100,
                }}
              />
            )}
            <div className="relative z-10 p-4">
              {loadingPoints && coordSource !== 'custom' ? (
                <div className="flex items-center justify-center min-h-[300px]">
                  <p className="text-white/40 text-[13px] animate-pulse">
                    좌표 로딩 중...
                  </p>
                </div>
              ) : (
                <ConstellationSvg
                  zodiacCode={period.code}
                  starPoints={starPoints}
                  entries={entries}
                  dates={dates}
                  todayDate={todayStr}
                  theme="default"
                />
              )}
            </div>
          </div>

          {/* 범례 */}
          <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1.5">
            {[
              { color: '#93C5FD', label: '긍정 약(1-2)' },
              { color: '#2563EB', label: '긍정 중(3)' },
              { color: '#1E3A8A', label: '긍정 강(4-5)' },
              { color: '#FCA5A5', label: '부정 약(1-2)' },
              { color: '#DC2626', label: '부정 중(3)' },
              { color: '#991B1B', label: '부정 강(4-5)' },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-1">
                <div
                  className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-[10px] text-white/45">{item.label}</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────
// 예시 좌표
// ──────────────────────────────────────────────
const EXAMPLE_COORDS = [
  {
    label: '직선 (가로)',
    pts: Array.from({ length: 30 }, (_, i) => ({ x: 10 + i * 2.7, y: 50 })),
  },
  {
    label: '대각선',
    pts: Array.from({ length: 30 }, (_, i) => ({
      x: 10 + i * 2.7,
      y: 10 + i * 2.7,
    })),
  },
  {
    label: '별 모양',
    pts: Array.from({ length: 30 }, (_, i) => {
      const angle = (i / 30) * Math.PI * 2;
      const r = i % 2 === 0 ? 35 : 15;
      return { x: 50 + r * Math.cos(angle), y: 50 + r * Math.sin(angle) };
    }),
  },
  {
    label: '나선형',
    pts: Array.from({ length: 30 }, (_, i) => {
      const angle = (i / 30) * Math.PI * 4;
      const r = 5 + i * 1.2;
      return { x: 50 + r * Math.cos(angle), y: 50 + r * Math.sin(angle) };
    }),
  },
];

// ──────────────────────────────────────────────
// 유틸 컴포넌트
// ──────────────────────────────────────────────
function Label({ children }: { children: React.ReactNode }) {
  return <p className="text-[13px] font-medium text-white/80">{children}</p>;
}

function Toggle({
  value,
  onChange,
}: {
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      onClick={() => onChange(!value)}
      className={[
        'w-10 h-5 rounded-full transition-colors relative',
        value ? 'bg-blue-500' : 'bg-white/20',
      ].join(' ')}
    >
      <span
        className={[
          'absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform',
          value ? 'left-5' : 'left-0.5',
        ].join(' ')}
      />
    </button>
  );
}

function SliderRow({
  label,
  value,
  setValue,
  min,
  max,
  step = 1,
  unit = '',
}: {
  label: string;
  value: number;
  setValue: (v: number) => void;
  min: number;
  max: number;
  step?: number;
  unit?: string;
}) {
  return (
    <div>
      <div className="flex justify-between text-[12px] text-white/50 mb-1">
        <span>{label}</span>
        <span>
          {value}
          {unit}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => setValue(Number(e.target.value))}
        className="w-full slider-star"
      />
    </div>
  );
}
