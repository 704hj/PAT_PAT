'use client';

import ErrorModal from '@/features/common/ErrorModal';
import { useHomeSummary } from '@/features/home/hooks/useHomeSummary';
import { getLumiImage } from '@/utils/getLumiImage';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import HomeSkeleton from './homeSkeleton';

const WEEK_LABELS = ['월', '화', '수', '목', '금', '토', '일'];

function getTodayIndex() {
  const day = new Date().getDay();
  return (day + 6) % 7;
}

const STAR_POINTS =
  '12,2 13.8,8.6 20.5,8.6 15.4,12.8 17.2,19.4 12,15.2 6.8,19.4 8.6,12.8 3.5,8.6 10.2,8.6';


export default function HomeClient() {
  const { data: result, isPending, isError, error } = useHomeSummary();
  const router = useRouter();
  const todayIndex = getTodayIndex();
  const weekDiaries = result?.weekDiaries ?? [];
  const filledDays = weekDiaries.length;
  const periodDiaryCount = result?.periodDiaryCount ?? 0;
  const periodTotalDays = result?.periodTotalDays ?? 0;
  const periodProgress =
    periodTotalDays > 0
      ? Math.round((periodDiaryCount / periodTotalDays) * 100)
      : 0;
  const isCollected = periodProgress >= 80;
  const [popoverIndex, setPopoverIndex] = useState<number | null>(null);
  const [shakingIndex, setShakingIndex] = useState<number | null>(null);

  const diaryByDate = useMemo(
    () => Object.fromEntries(weekDiaries.map((d) => [d.entry_date, d])),
    [weekDiaries]
  );

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
      const diary = diaryByDate[dateStr] ?? null;
      const isFilled = !!diary;
      return { label, dateNumber, isToday, isFuture, isFilled, diary };
    });
  }, [todayIndex, diaryByDate]);

  if (isPending) return <HomeSkeleton />;

  const isDiary = result?.isDiary ?? false;
  const todayDiary = weekStars.find((s) => s.isToday)?.diary;
  const lumiImage = getLumiImage(todayDiary?.emotion_polarity, todayDiary?.emotion_intensity);

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
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          30% { transform: translateX(-2px); }
          70% { transform: translateX(2px); }
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

        <section className="mx-auto w-full max-w-[480px] px-5 pt-12 pb-[120px]">
          {/* ── 날짜 헤더 ── */}
          <header className="mb-5 flex items-center justify-between">
            <div>
              <p className="text-white/85 text-[17px] font-light">
                {result?.profile.nickname}님의 하늘
              </p>
              <p className="text-white/50 text-[13px] font-light mt-0.5">
                {new Date().toLocaleDateString('ko-KR', {
                  month: 'long',
                  day: 'numeric',
                  weekday: 'short',
                })}
              </p>
            </div>
            <img
              src={lumiImage}
              alt="루미"
              className="w-20 h-20 object-contain opacity-90"
              style={{ animation: 'float 4s ease-in-out infinite' }}
            />
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
                  <p className="text-white/95 text-[17px] font-light leading-snug">
                    {isDiary
                      ? '오늘의 감정이 담겼어요'
                      : '오늘은 아직 기록이 없어요'}
                  </p>
                  <p className="mt-1.5 text-white/50 text-[13px] font-light">
                    {isDiary
                      ? '언제든 다시 수정할 수 있어요'
                      : '오늘의 별은 오늘만 담을 수 있어요'}
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
                className="w-full flex items-center justify-center gap-2 rounded-[12px] transition-opacity duration-150 active:opacity-50"
                style={{
                  height: 44,
                  background: isDiary
                    ? 'rgba(255,255,255,0.05)'
                    : 'rgba(255,255,255,0.04)',
                  border: isDiary
                    ? '1px solid rgba(255,255,255,0.13)'
                    : '1px solid rgba(160,185,255,0.22)',
                }}
              >
                <span
                  className="text-[13px]"
                  style={{
                    color: isDiary
                      ? 'rgba(180,205,255,0.9)'
                      : 'rgba(190,210,255,0.95)',
                    fontWeight: 300,
                    letterSpacing: '0.02em',
                  }}
                >
                  {isDiary ? '기록 수정하기' : '기록 남기기'}
                </span>
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  style={{
                    color: isDiary
                      ? 'rgba(180,205,255,0.65)'
                      : 'rgba(190,210,255,0.8)',
                  }}
                >
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </button>
            </div>
          </div>

          {/* ── 이번 주 별자리 ── */}
          <div
            className="rounded-2xl mb-3 overflow-hidden"
            onClick={() => setPopoverIndex(null)}
            style={{
              background: 'rgba(255,255,255,0.025)',
              border: '1px solid rgba(255,255,255,0.06)',
            }}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-7">
                <p className="text-white/70 text-[13px] font-light">이번 주</p>
                <p className="text-white/50 text-[12px] font-light">
                  <span className="text-white/80">{filledDays}</span> / 7
                </p>
              </div>

              {/* 별 7개 */}
              <div className="flex justify-between items-center px-0.5">
                {weekStars.map(
                  (
                    { label, dateNumber, isToday, isFuture, isFilled, diary },
                    i
                  ) => (
                    <div key={i} className="flex flex-col items-center gap-2.5">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (isFilled) {
                            setPopoverIndex(popoverIndex === i ? null : i);
                          } else if (!isFuture) {
                            // 과거 빈 별: 진동 + 흔들림
                            navigator.vibrate?.(30);
                            setShakingIndex(i);
                            setTimeout(() => setShakingIndex(null), 500);
                          }
                        }}
                        className="relative flex items-center justify-center"
                        style={{
                          width: 32,
                          height: 32,
                          animation:
                            shakingIndex === i ? 'shake 0.5s ease' : 'none',
                        }}
                      >
                        {isFilled && (
                          <div
                            className="absolute inset-0 rounded-full"
                            style={{
                              background:
                                diary?.emotion_polarity === 'NEGATIVE'
                                  ? 'rgba(180,140,255,0.12)'
                                  : diary?.emotion_polarity === 'UNSET'
                                  ? 'rgba(200,210,220,0.08)'
                                  : 'rgba(140,180,255,0.12)',
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
                              ? diary?.emotion_polarity === 'NEGATIVE'
                                ? 'drop-shadow(0 0 4px rgba(180,140,255,0.7))'
                                : diary?.emotion_polarity === 'UNSET'
                                ? 'drop-shadow(0 0 3px rgba(200,210,220,0.4))'
                                : 'drop-shadow(0 0 4px rgba(160,200,255,0.6))'
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
                                ? diary?.emotion_polarity === 'NEGATIVE'
                                  ? 'rgba(210,190,255,0.92)'
                                  : diary?.emotion_polarity === 'UNSET'
                                  ? 'rgba(200,210,220,0.6)'
                                  : 'rgba(195,218,255,0.92)'
                                : 'rgba(255,255,255,0.14)'
                            }
                          />
                        </svg>
                      </button>

                      <div className="flex flex-col items-center gap-0.5">
                        <span
                          className="text-[10px]"
                          style={{
                            color: isToday
                              ? 'rgba(175,205,255,0.9)'
                              : 'rgba(255,255,255,0.45)',
                            fontWeight: isToday ? 500 : 300,
                          }}
                        >
                          {label}
                        </span>
                        <span
                          className="text-[9px]"
                          style={{
                            color: isToday
                              ? 'rgba(175,205,255,0.7)'
                              : 'rgba(255,255,255,0.35)',
                            fontWeight: 300,
                          }}
                        >
                          {dateNumber}
                        </span>
                      </div>
                    </div>
                  )
                )}
              </div>

              {/* 선택된 별 미리보기 패널 */}
              {popoverIndex !== null &&
                weekStars[popoverIndex]?.diary &&
                (() => {
                  const selected = weekStars[popoverIndex];
                  const d = selected.diary!;
                  const polarity = d.emotion_polarity; // 'POSITIVE' | 'NEGATIVE' | 'UNSET'
                  const theme =
                    polarity === 'POSITIVE'
                      ? {
                          bg: 'linear-gradient(135deg, rgba(80,120,255,0.07), rgba(100,160,255,0.04))',
                          border: '1px solid rgba(120,170,255,0.18)',
                          shadow: '0 0 24px rgba(100,160,255,0.06)',
                          dot: 'rgba(140,200,255,0.9)',
                          dotGlow: '0 0 6px 2px rgba(140,200,255,0.5)',
                          label: 'rgba(160,200,255,0.7)',
                        }
                      : polarity === 'NEGATIVE'
                      ? {
                          bg: 'linear-gradient(135deg, rgba(140,80,255,0.07), rgba(180,120,255,0.04))',
                          border: '1px solid rgba(170,120,255,0.18)',
                          shadow: '0 0 24px rgba(160,100,255,0.06)',
                          dot: 'rgba(190,150,255,0.9)',
                          dotGlow: '0 0 6px 2px rgba(190,150,255,0.5)',
                          label: 'rgba(200,160,255,0.7)',
                        }
                      : {
                          bg: 'rgba(255,255,255,0.03)',
                          border: '1px solid rgba(255,255,255,0.09)',
                          shadow: 'none',
                          dot: 'rgba(200,210,220,0.5)',
                          dotGlow: 'none',
                          label: 'rgba(200,210,220,0.6)',
                        };
                  const preview = d.content.split('\n')[0].slice(0, 50);
                  return (
                    <div
                      key={popoverIndex}
                      role="button"
                      onClick={() => setPopoverIndex(null)}
                      className="mt-5 rounded-[14px] p-4 cursor-pointer active:opacity-70 transition-opacity"
                      style={{
                        background: theme.bg,
                        border: theme.border,
                        boxShadow: theme.shadow,
                      }}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className="shrink-0"
                          style={{
                            width: 6,
                            height: 6,
                            marginTop: 5,
                            borderRadius: '50%',
                            background: theme.dot,
                            boxShadow: theme.dotGlow,
                          }}
                        />
                        <div className="flex flex-col gap-1 min-w-0">
                          <span
                            className="text-[10px] tracking-[0.06em]"
                            style={{ color: theme.label }}
                          >
                            {selected.dateNumber}일 · {selected.label}요일
                          </span>
                          <p
                            className="text-[13px] leading-relaxed break-keep"
                            style={{
                              color: 'rgba(220,230,255,0.9)',
                              fontWeight: 300,
                            }}
                          >
                            {preview}
                            {d.content.length > 50 ? '…' : ''}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })()}

              {filledDays > 0 && popoverIndex === null && (
                <p className="mt-6 text-white/40 text-[11px] text-center tracking-[0.05em]">
                  {filledDays === 7
                    ? '이번 주 별자리를 완성했어요'
                    : `${filledDays}개의 별이 모였어요`}
                </p>
              )}
            </div>
          </div>

          {/* ── 이번 달 진행률 ── */}
          <div
            className="rounded-2xl overflow-hidden relative"
            style={{
              background: 'rgba(255,255,255,0.025)',
              border: isCollected
                ? '1px solid rgba(160,120,255,0.2)'
                : '1px solid rgba(255,255,255,0.06)',
            }}
          >
            {/* 별자리 점/선 장식 */}
            <svg
              className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none"
              width="64"
              height="64"
              viewBox="0 0 64 64"
              fill="none"
              style={{ opacity: isCollected ? 0.35 : 0.18 }}
            >
              <circle
                cx="12"
                cy="52"
                r="2.5"
                fill={
                  isCollected
                    ? 'rgba(185,155,255,0.9)'
                    : 'rgba(180,200,255,0.9)'
                }
              />
              <circle
                cx="32"
                cy="16"
                r="2.5"
                fill={
                  isCollected
                    ? 'rgba(185,155,255,0.9)'
                    : 'rgba(180,200,255,0.9)'
                }
              />
              <circle
                cx="54"
                cy="40"
                r="2.5"
                fill={
                  isCollected
                    ? 'rgba(185,155,255,0.9)'
                    : 'rgba(180,200,255,0.9)'
                }
              />
              <circle
                cx="44"
                cy="22"
                r="1.5"
                fill={
                  isCollected
                    ? 'rgba(185,155,255,0.7)'
                    : 'rgba(180,200,255,0.7)'
                }
              />
              <circle
                cx="22"
                cy="38"
                r="1.5"
                fill={
                  isCollected
                    ? 'rgba(185,155,255,0.7)'
                    : 'rgba(180,200,255,0.7)'
                }
              />
              <line
                x1="12"
                y1="52"
                x2="32"
                y2="16"
                stroke={
                  isCollected
                    ? 'rgba(185,155,255,0.3)'
                    : 'rgba(180,200,255,0.3)'
                }
                strokeWidth="0.8"
              />
              <line
                x1="32"
                y1="16"
                x2="54"
                y2="40"
                stroke={
                  isCollected
                    ? 'rgba(185,155,255,0.3)'
                    : 'rgba(180,200,255,0.3)'
                }
                strokeWidth="0.8"
              />
              <line
                x1="32"
                y1="16"
                x2="44"
                y2="22"
                stroke={
                  isCollected
                    ? 'rgba(185,155,255,0.2)'
                    : 'rgba(180,200,255,0.2)'
                }
                strokeWidth="0.6"
              />
              <line
                x1="12"
                y1="52"
                x2="22"
                y2="38"
                stroke={
                  isCollected
                    ? 'rgba(185,155,255,0.2)'
                    : 'rgba(180,200,255,0.2)'
                }
                strokeWidth="0.6"
              />
            </svg>
            <div className="relative px-5 pt-4 pb-5">
              <div className="flex items-center justify-between mb-3">
                <p className="text-white/40 text-[10px] tracking-[0.15em]">
                  이번 달 별자리
                </p>
                <p className="text-white/50 text-[11px] font-light">
                  <span className="text-white/60">{periodDiaryCount}</span> /{' '}
                  {periodTotalDays}일
                </p>
              </div>

              <p className="text-white/85 text-[15px] font-light leading-snug mb-4">
                {isCollected
                  ? '이번 달 별자리를 수집했어요'
                  : periodProgress >= 50
                  ? `별자리까지 ${80 - periodProgress}% 남았어요`
                  : '매일 기록하면 별자리가 완성돼요'}
              </p>

              {/* 프로그레스 바 */}
              <div
                className="relative w-full rounded-full overflow-hidden"
                style={{ height: 4, background: 'rgba(255,255,255,0.07)' }}
              >
                {/* 80% 목표선 */}
                <div
                  className="absolute top-0 bottom-0 w-px"
                  style={{
                    left: '80%',
                    background: 'rgba(255,255,255,0.45)',
                  }}
                />
                {/* 진행 */}
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${Math.min(periodProgress, 100)}%`,
                    background: isCollected
                      ? 'linear-gradient(90deg, rgba(160,120,255,0.8), rgba(200,160,255,0.9))'
                      : 'linear-gradient(90deg, rgba(100,150,255,0.7), rgba(140,180,255,0.85))',
                    boxShadow: isCollected
                      ? '0 0 8px rgba(160,120,255,0.5)'
                      : '0 0 6px rgba(120,160,255,0.4)',
                  }}
                />
              </div>
              <div className="flex justify-between mt-1.5">
                <span className="text-white/55 text-[9px]">
                  {periodProgress}%
                </span>
                <span
                  className="text-[9px]"
                  style={{
                    color: isCollected
                      ? 'rgba(180,140,255,0.5)'
                      : 'rgba(255,255,255,0.45)',
                  }}
                >
                  80% 달성 시 수집
                </span>
              </div>
            </div>
          </div>
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
