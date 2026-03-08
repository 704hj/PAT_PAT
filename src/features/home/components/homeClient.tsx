'use client';

import ErrorModal from '@/features/common/ErrorModal';
import { useHomeSummary } from '@/features/home/hooks/useHomeSummary';
import GlassCard from '@/shared/components/glassCard';
import { useRouter } from 'next/navigation';
import { useMemo } from 'react';
import HomeSkeleton from './homeSkeleton';
import PrimaryButton from './primaryButton';

function pct(value: number, max: number) {
  const v = Math.max(0, Math.min(max, value));
  return (v / max) * 100;
}

function getTimeMessage(hour: number) {
  if (hour >= 5 && hour < 11) return '오늘이 천천히 시작되고 있어요.';
  if (hour >= 11 && hour < 17) return '오늘이 차분히 흘러가고 있어요.';
  if (hour >= 17 && hour < 22) return '오늘이 정리되는 시간이에요.';
  return '오늘이 조용히 마무리되고 있어요.';
}


export default function HomeClient() {
  const { data: result, isPending, isError, error } = useHomeSummary();
  const router = useRouter();
  const hour = new Date().getHours();

  const headerSubtitle = result?.isDiary
    ? '오늘도 기록했네요 ✦'
    : '오늘 어떤 하루였나요?';


  const todayTitle = useMemo(() => {
    return result?.isDiary
      ? '오늘의 감정이 담겼어요'
      : '오늘은 아직 기록이 없어요';
  }, [result?.isDiary]);

  const todayDesc = useMemo(() => {
    return result?.isDiary
      ? '기록은 언제든 다시 수정할 수 있어요.'
      : '하루가 지나가기 전, 한 줄을 남길 수 있어요.';
  }, [result?.isDiary]);

  const filledDays = result?.diaryCount ?? 0;

  if (isPending) {
    return <HomeSkeleton />;
  }

  return (
    <div className="relative min-h-[100svh] overflow-y-auto">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(1200px_800px_at_50%_-10%,rgba(70,120,255,0.22),transparent_60%),radial-gradient(900px_600px_at_80%_40%,rgba(130,70,255,0.14),transparent_60%),linear-gradient(180deg,#07102a_0%,#050b1c_100%)]" />

      <section className="relative mx-auto w-full max-w-[480px] px-5 pb-[120px]">
        {/* 헤더 */}
        <header className="pt-12 flex items-center justify-between gap-4">
          <div>
            <p className="text-white/45 text-[13px]">
              {getTimeMessage(new Date().getHours())}
            </p>
            <h1 className="mt-1 text-white text-[26px] font-semibold tracking-[-0.02em]">
              {result?.profile?.nickname ?? '사용자'} 님,
            </h1>

            <p className="mt-1 text-white/70 text-[16px]">{headerSubtitle}</p>
          </div>
          <img
            src="/images/icon/lumi/lumi_main.svg"
            alt="루미"
            className="w-14 h-14 object-contain flex-shrink-0"
          />
        </header>

        {/* 오늘 카드 + CTA 통합 */}
        <div className="mt-8">
          <GlassCard className="p-5">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <p className="text-white/40 text-[11px] uppercase tracking-widest">
                  Today
                </p>
                <p className="mt-2 text-white text-[17px] font-semibold leading-snug">
                  {todayTitle}
                </p>
                <p className="mt-1 text-white/55 text-[13px] leading-relaxed">
                  {todayDesc}
                </p>
              </div>

              <div
                className={[
                  'w-9 h-9 rounded-2xl flex items-center justify-center text-[15px] flex-shrink-0',
                  result?.isDiary
                    ? 'bg-indigo-400/20 border border-indigo-400/30 text-indigo-300'
                    : 'bg-white/6 border border-white/10 text-white/30',
                ].join(' ')}
              >
                {result?.isDiary ? '✦' : '○'}
              </div>
            </div>

            <div className="mt-5">
              <PrimaryButton
                onClick={() =>
                  router.push(
                    result?.diaryId
                      ? `/diary/editor?diaryId=${result?.diaryId}`
                      : `/diary/editor`
                  )
                }
              >
                {result?.isDiary ? '오늘 기록 수정하기' : '오늘 기록 남기기'}
              </PrimaryButton>
            </div>
          </GlassCard>
        </div>

        {/* 주간 요약 */}
        <div className="mt-3">
          <GlassCard className="p-5">
            <div className="flex items-center justify-between">
              <p className="text-white/85 text-[15px] font-semibold">
                이번 주 기록
              </p>
              <p className="text-white/85 text-[15px] font-semibold">
                {filledDays}
                <span className="text-white/35 text-[13px] font-normal">
                  {' '}
                  / 7일
                </span>
              </p>
            </div>

            <div className="mt-4 h-1.5 rounded-full bg-white/8 overflow-hidden">
              <div
                className="h-full rounded-full bg-white/35 transition-all duration-500"
                style={{ width: `${pct(filledDays, 7)}%` }}
              />
            </div>

            <p className="mt-3 text-white/40 text-[12px]">
              {filledDays > 0
                ? `이번 주에 ${filledDays}일을 기록했어요`
                : '이번 주는 아직 기록이 없어요'}
            </p>
          </GlassCard>
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
  );
}
