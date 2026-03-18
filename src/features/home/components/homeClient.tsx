'use client';

import ErrorModal from '@/features/common/ErrorModal';
import { useHomeSummary } from '@/features/home/hooks/useHomeSummary';
import { useRouter } from 'next/navigation';
import { useMemo } from 'react';
import HomeSkeleton from './homeSkeleton';

function getTimeMessage(hour: number) {
  if (hour >= 5 && hour < 11) return '오늘이 천천히 시작되고 있어요.';
  if (hour >= 11 && hour < 17) return '오늘이 차분히 흘러가고 있어요.';
  if (hour >= 17 && hour < 22) return '오늘이 정리되는 시간이에요.';
  return '오늘이 조용히 마무리되고 있어요.';
}

const WEEK_LABELS = ['월', '화', '수', '목', '금', '토', '일'];

function getTodayIndex() {
  const day = new Date().getDay();
  return (day + 6) % 7;
}

const STAR_POINTS =
  '12,2 13.8,8.6 20.5,8.6 15.4,12.8 17.2,19.4 12,15.2 6.8,19.4 8.6,12.8 3.5,8.6 10.2,8.6';

const ZODIAC_BY_MONTH: Record<number, string> = {
  1: '1_aquarius',
  2: '2_pisces',
  3: '3_aries',
  4: '4_taurus',
  5: '5_gemini',
  6: '6_cancer',
  7: '7_leo',
  8: '8_virgo',
  9: '9_libra',
  10: '10_scorpio',
  11: '11_sagittarius',
  12: '12_capricorn',
};

function getZodiacPreviewSrc() {
  const month = new Date().getMonth() + 1;
  return `/images/bg/zodiac/${ZODIAC_BY_MONTH[month]}.png`;
}

export default function HomeClient() {
  const { data: result, isPending, isError, error } = useHomeSummary();
  const router = useRouter();
  const hour = new Date().getHours();
  const todayIndex = getTodayIndex();
  const weekDiaryDates = result?.weekDiaryDates ?? [];
  const filledDays = weekDiaryDates.length;
  const collectedCount = result?.collectedCount ?? 0;

  const weekStars = useMemo(() => {
    const now = new Date();
    const nowKst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
    const kstDay = nowKst.getUTCDay();
    const mondayKst = new Date(nowKst);
    mondayKst.setUTCDate(nowKst.getUTCDate() - ((kstDay + 6) % 7));

    return WEEK_LABELS.map((label, i) => {
      const dayKst = new Date(mondayKst);
      dayKst.setUTCDate(mondayKst.getUTCDate() + i);
      const dateStr = dayKst.toISOString().split('T')[0];
      const dateNumber = dayKst.getUTCDate();

      const isToday = i === todayIndex;
      const isFuture = i > todayIndex;
      const isFilled = weekDiaryDates.includes(dateStr);
      return { label, dateNumber, isToday, isFuture, isFilled };
    });
  }, [todayIndex, weekDiaryDates]);

  if (isPending) return <HomeSkeleton />;

  const isDiary = result?.isDiary ?? false;

  return (
    <>
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        @keyframes twinkle {
          0%, 100% { opacity: 0.7; }
          50% { opacity: 1; }
        }
        @keyframes soft-glow {
          0%, 100% { opacity: 0.15; }
          50% { opacity: 0.28; }
        }
      `}</style>

      <div className="relative min-h-[100svh] overflow-y-auto">
        {/* 배경 성운 — 분위기용, 미세하게 */}
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <div
            style={{
              position: 'absolute',
              width: 500,
              height: 380,
              top: -120,
              left: '50%',
              transform: 'translateX(-50%)',
              background:
                'radial-gradient(ellipse, rgba(60,90,200,0.18) 0%, transparent 65%)',
              filter: 'blur(80px)',
              animation: 'soft-glow 10s ease-in-out infinite',
            }}
          />
          <div
            style={{
              position: 'absolute',
              width: 300,
              height: 240,
              top: 380,
              right: -60,
              background:
                'radial-gradient(ellipse, rgba(80,40,180,0.1) 0%, transparent 70%)',
              filter: 'blur(70px)',
              animation: 'soft-glow 14s ease-in-out infinite 3s',
            }}
          />
        </div>

        {/* 배경 미세 별 */}
        {[
          [7, 11],
          [13, 83],
          [21, 93],
          [36, 5],
          [50, 89],
          [64, 16],
          [77, 71],
          [88, 43],
          [19, 57],
          [44, 67],
        ].map(([top, left], i) => (
          <div
            key={i}
            className="pointer-events-none absolute -z-10 rounded-full bg-white"
            style={{
              top: `${top}%`,
              left: `${left}%`,
              width: 1,
              height: 1,
              opacity: 0.12 + (i % 3) * 0.07,
            }}
          />
        ))}

        <section className="mx-auto w-full max-w-[480px] px-5 pb-[120px]">
          {/* ── 헤더 ── */}
          <header className="pt-14 mb-12">
            <p className="text-white/25 text-[11px] tracking-[0.2em]">
              {getTimeMessage(hour)}
            </p>
            <div className="mt-5 flex items-center justify-between">
              <div>
                <h1 className="text-white/90 text-[26px] font-light tracking-[-0.01em]">
                  {result?.profile?.nickname ?? '사용자'} 님
                </h1>
                <p className="mt-1.5 text-white/35 text-[13px] font-light">
                  {isDiary
                    ? '오늘의 별을 남겼어요'
                    : '오늘의 별을 기다리고 있어요'}
                </p>
              </div>
              <img
                src="/images/icon/lumi/lumi_main.svg"
                alt="루미"
                className="w-11 h-11 object-contain flex-shrink-0 opacity-80"
                style={{ animation: 'float 4s ease-in-out infinite' }}
              />
            </div>
          </header>

          {/* ── Today 카드 ── */}
          <div
            className="rounded-2xl mb-3 overflow-hidden"
            style={{
              background: 'rgba(255,255,255,0.03)',
              border: `1px solid ${
                isDiary ? 'rgba(140,175,255,0.15)' : 'rgba(255,255,255,0.07)'
              }`,
            }}
          >
            <div className="p-6">
              {/* 상태 + 별 */}
              <div className="flex items-start justify-between gap-4 mb-5">
                <div>
                  <p className="text-white/20 text-[10px] tracking-[0.25em] uppercase mb-3">
                    Today
                  </p>
                  <p className="text-white/85 text-[17px] font-light leading-snug">
                    {isDiary
                      ? '오늘의 감정이 담겼어요'
                      : '오늘은 아직 기록이 없어요'}
                  </p>
                  <p className="mt-1.5 text-white/30 text-[13px] font-light">
                    {isDiary
                      ? '언제든 다시 수정할 수 있어요'
                      : '하루가 지나가기 전 한 줄을 남겨보세요'}
                  </p>
                </div>

                <div className="flex-shrink-0 mt-1">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    style={{
                      filter: isDiary
                        ? 'drop-shadow(0 0 6px rgba(170,200,255,0.7))'
                        : 'none',
                      animation: isDiary
                        ? 'twinkle 3s ease-in-out infinite'
                        : 'none',
                      opacity: isDiary ? 1 : 0.2,
                    }}
                  >
                    <polygon
                      points={STAR_POINTS}
                      fill="rgba(200,220,255,0.95)"
                    />
                  </svg>
                </div>
              </div>

              {/* 버튼 */}
              <button
                onClick={() =>
                  router.push(
                    result?.diaryId
                      ? `/diary/editor?diaryId=${result.diaryId}`
                      : '/diary/editor'
                  )
                }
                className="flex items-center gap-1.5 text-[13px] font-light transition-opacity duration-150 active:opacity-50"
                style={{
                  color: isDiary
                    ? 'rgba(160,195,255,0.75)'
                    : 'rgba(255,255,255,0.45)',
                }}
              >
                <span>{isDiary ? '기록 수정하기' : '기록 남기기'}</span>
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </button>
            </div>
          </div>

          {/* ── 이번 주 별자리 ── */}
          <div
            className="rounded-2xl mb-3 overflow-hidden"
            style={{
              background: 'rgba(255,255,255,0.025)',
              border: '1px solid rgba(255,255,255,0.06)',
            }}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-7">
                <p className="text-white/55 text-[13px] font-light">이번 주</p>
                <p className="text-white/30 text-[12px] font-light">
                  <span className="text-white/65">{filledDays}</span> / 7
                </p>
              </div>

              {/* 별 7개 */}
              <div className="flex justify-between items-center px-0.5">
                {weekStars.map(({ label, dateNumber, isToday, isFuture, isFilled }, i) => (
                  <div key={i} className="flex flex-col items-center gap-2.5">
                    <div
                      className="relative flex items-center justify-center"
                      style={{ width: 32, height: 32 }}
                    >
                      {isFilled && (
                        <div
                          className="absolute inset-0 rounded-full"
                          style={{
                            background: 'rgba(140,180,255,0.12)',
                            filter: 'blur(8px)',
                          }}
                        />
                      )}
                      <svg
                        viewBox="0 0 24 24"
                        style={{
                          width: isFilled ? 20 : 13,
                          height: isFilled ? 20 : 13,
                          position: 'relative',
                          filter: isFilled
                            ? 'drop-shadow(0 0 4px rgba(160,200,255,0.6))'
                            : 'none',
                          animation:
                            isFilled && isToday
                              ? 'twinkle 3s ease-in-out infinite'
                              : 'none',
                          transition: 'width 0.3s, height 0.3s',
                          opacity: isFuture ? 0.3 : 1,
                        }}
                      >
                        <polygon
                          points={STAR_POINTS}
                          fill={
                            isFilled
                              ? 'rgba(195,218,255,0.92)'
                              : 'rgba(255,255,255,0.14)'
                          }
                        />
                      </svg>
                    </div>

                    <div className="flex flex-col items-center gap-0.5">
                      <span
                        className="text-[10px]"
                        style={{
                          color: isToday
                            ? 'rgba(175,205,255,0.7)'
                            : 'rgba(255,255,255,0.2)',
                          fontWeight: isToday ? 500 : 300,
                        }}
                      >
                        {label}
                      </span>
                      <span
                        className="text-[9px]"
                        style={{
                          color: isToday
                            ? 'rgba(175,205,255,0.5)'
                            : 'rgba(255,255,255,0.12)',
                          fontWeight: 300,
                        }}
                      >
                        {dateNumber}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {filledDays > 0 && (
                <p className="mt-6 text-white/20 text-[11px] text-center tracking-[0.05em]">
                  {filledDays === 7
                    ? '이번 주 별자리를 완성했어요'
                    : `${filledDays}개의 별이 모였어요`}
                </p>
              )}
            </div>
          </div>

          {/* ── 수집된 별자리 ── */}
          {collectedCount > 0 ? (
            <div
              className="rounded-2xl overflow-hidden"
              style={{
                background: 'rgba(255,255,255,0.025)',
                border: '1px solid rgba(160,120,255,0.12)',
              }}
            >
              <div className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-white/20 text-[10px] tracking-[0.25em] uppercase mb-3">
                    Collection
                  </p>
                  <p className="text-white/80 text-[17px] font-light">
                    <span className="text-white/90">{collectedCount}개</span>의
                    별자리를 수집했어요
                  </p>
                </div>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <circle
                    cx="4"
                    cy="18"
                    r="2"
                    fill="rgba(185,155,255,0.7)"
                    style={{
                      filter: 'drop-shadow(0 0 4px rgba(170,130,255,0.8))',
                    }}
                  />
                  <circle
                    cx="12"
                    cy="7"
                    r="2"
                    fill="rgba(185,155,255,0.7)"
                    style={{
                      filter: 'drop-shadow(0 0 4px rgba(170,130,255,0.8))',
                    }}
                  />
                  <circle
                    cx="20"
                    cy="14"
                    r="2"
                    fill="rgba(185,155,255,0.7)"
                    style={{
                      filter: 'drop-shadow(0 0 4px rgba(170,130,255,0.8))',
                    }}
                  />
                  <line
                    x1="4"
                    y1="18"
                    x2="12"
                    y2="7"
                    stroke="rgba(170,130,255,0.3)"
                    strokeWidth="0.8"
                  />
                  <line
                    x1="12"
                    y1="7"
                    x2="20"
                    y2="14"
                    stroke="rgba(170,130,255,0.3)"
                    strokeWidth="0.8"
                  />
                </svg>
              </div>
            </div>
          ) : (
            // 수집 없음: zodiac 이미지 프리뷰
            <div
              className="rounded-2xl overflow-hidden relative"
              style={{
                background: 'rgba(255,255,255,0.025)',
                border: '1px solid rgba(255,255,255,0.06)',
              }}
            >
              {/* zodiac 이미지 — 우측에 반투명하게 */}
              <img
                src={getZodiacPreviewSrc()}
                alt=""
                className="absolute right-[-30px] top-0 h-full w-auto object-contain pointer-events-none"
                style={{ opacity: 0.18 }}
              />
              {/* 컨텐츠 */}
              <div className="relative px-5 py-4">
                <p className="text-white/20 text-[10px] tracking-[0.25em] uppercase mb-3">
                  Collection
                </p>
                <p className="text-white/50 text-[14px] font-light leading-snug">
                  아직 수집된 별자리가 없어요
                </p>
                <p className="mt-1 text-white/28 text-[11px] font-light">
                  기간의 80%를 채우면 이런 별자리가 수집돼요
                </p>
              </div>
            </div>
          )}
        </section>

        <ErrorModal
          open={isError}
          title="데이터를 불러오지 못했어요"
          description={
            error?.message === 'signup_incomplete'
              ? '회원가입이 완료되지 않았어요. 약관 동의 후 이용해 주세요.'
              : error?.message ?? '잠시 후 다시 시도해 주세요.'
          }
          onClose={() =>
            error?.message === 'signup_incomplete'
              ? router.replace('/auth/terms')
              : router.push('/home')
          }
        />
      </div>
    </>
  );
}
