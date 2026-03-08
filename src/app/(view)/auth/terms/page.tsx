'use client';

import {
  cancelSignupAction,
  completeSignupAction,
} from '@/features/auth/actions/auth';
import {
  PRIVACY_SECTIONS,
  TERMS_SECTIONS,
} from '@/features/auth/constants/termsContent';
import ErrorModal from '@/features/common/ErrorModal';
import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';

type Tab = 'terms' | 'privacy';

function CheckIcon() {
  return (
    <svg viewBox="0 0 12 10" fill="none" className="w-3 h-3">
      <path
        d="M1 5l3.5 3.5L11 1"
        stroke="#050b1c"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Checkbox({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={[
        'flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-all duration-200',
        checked
          ? 'bg-sky-400/90 border-sky-400 shadow-[0_0_8px_rgba(56,189,248,0.35)]'
          : 'border-white/22 bg-white/5 hover:border-white/40',
      ].join(' ')}
    >
      {checked && <CheckIcon />}
    </button>
  );
}

export default function TermsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>('terms');
  const [agreedTerms, setAgreedTerms] = useState(false);
  const [agreedPrivacy, setAgreedPrivacy] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const canProceed = agreedTerms && agreedPrivacy && !isSubmitting;
  const allAgreed = agreedTerms && agreedPrivacy;
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const switchTab = (tab: Tab) => {
    setActiveTab(tab);
    scrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancel = async () => {
    setIsCancelling(true);
    try {
      await cancelSignupAction();
    } catch (e) {
      console.error('cancelSignupAction error:', e);
    } finally {
      router.replace('/start');
    }
  };

  const handleCompleteSignup = async () => {
    if (!canProceed) return;
    setIsSubmitting(true);

    try {
      const fd = new FormData();
      const res = await completeSignupAction(fd);
      if (!res.ok) {
        setErrorMsg(res.message);
        console.log(res.message);
        setIsSubmitting(false);
        return;
      }

      // 성공 시 홈으로 이동
      router.push('/home');
    } catch (err: any) {
      console.error('completeSignupAction error:', err);
      setErrorMsg(err.message || '가입 처리 중 오류가 발생했습니다.');
      setIsSubmitting(false);
    }
  };

  const sections = activeTab === 'terms' ? TERMS_SECTIONS : PRIVACY_SECTIONS;

  return (
    /* Fills the flex-1 space in AuthLayout, ensuring internal scroll works */
    <div className="flex-1 flex flex-col min-h-0 text-white relative">
      {/* 페이지 전용 배경 글로우 */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            'radial-gradient(700px_400px_at_50%_0%,rgba(56,189,248,0.07),transparent_60%),' +
            'radial-gradient(500px_350px_at_90%_100%,rgba(130,70,255,0.07),transparent_55%)',
        }}
      />
      {/* 탭 바: 상단 고정 (Sticky within this container) */}
      <div className="shrink-0 z-20 border-b border-white/8 bg-[rgba(5,11,28,0.85)] backdrop-blur-md">
        <div className="flex w-full">
          {(['terms', 'privacy'] as Tab[]).map((tab) => {
            const label = tab === 'terms' ? '이용약관' : '개인정보 처리방침';
            const agreed = tab === 'terms' ? agreedTerms : agreedPrivacy;
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => switchTab(tab)}
                className={[
                  'relative flex flex-1 items-center justify-center gap-1.5 py-4 text-[13px] font-medium transition-colors',
                  isActive
                    ? 'text-sky-300'
                    : 'text-white/40 hover:text-white/65',
                ].join(' ')}
              >
                {agreed && (
                  <span className="flex h-4 w-4 items-center justify-center rounded-full bg-sky-400/20 border border-sky-400/40">
                    <CheckIcon />
                  </span>
                )}
                {label}
                {isActive && (
                  <span className="absolute bottom-0 left-1/2 h-[2px] w-14 -translate-x-1/2 rounded-full bg-sky-400" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── 내부 스크롤 콘텐츠 ── */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto scroll-hide">
        <div className="w-full px-5 pt-5 pb-5 space-y-3">
          {sections.map((s, idx) => (
            <section
              key={s.id}
              id={s.id}
              className="rounded-[16px] border border-white/8 bg-white/[0.04] px-5 py-5 shadow-[0_4px_16px_rgba(0,0,0,0.2)]"
            >
              <div className="mb-3 flex items-center gap-2.5">
                <span className="text-[11px] font-mono text-white/25 tabular-nums shrink-0">
                  {String(idx + 1).padStart(2, '0')}
                </span>
                <h2 className="text-[14px] font-semibold text-white/85">
                  {s.title}
                </h2>
              </div>
              <div className="mb-3 h-px bg-white/8" />
              <p className="whitespace-pre-line text-[13px] leading-[1.8] text-white/55">
                {s.content}
              </p>
            </section>
          ))}
          <div className="h-4" />
        </div>
      </div>

      {/* ── Fixed 하단 동의 바 ── */}
      <div className="shrink-0 border-t border-white/10 bg-[rgba(5,11,28,0.92)] backdrop-blur-2xl px-5 pt-4 pb-[max(20px,env(safe-area-inset-bottom))]">
        <div className="space-y-3">
          {/* 전체 동의 */}
          <div
            className={[
              'flex items-center gap-4 rounded-2xl px-5 py-4 transition-all duration-300 cursor-pointer',
              allAgreed
                ? 'bg-sky-400/[0.12] border border-sky-400/30 shadow-[0_0_24px_rgba(56,189,248,0.12)]'
                : 'bg-white/5 border border-white/10',
            ].join(' ')}
            onClick={() => {
              setAgreedTerms(!allAgreed);
              setAgreedPrivacy(!allAgreed);
            }}
          >
            <Checkbox
              checked={allAgreed}
              onChange={(v) => {
                setAgreedTerms(v);
                setAgreedPrivacy(v);
              }}
            />
            <div className="flex flex-col">
              <span
                className={[
                  'text-[14px] font-bold transition-colors duration-300',
                  allAgreed ? 'text-white' : 'text-white/90',
                ].join(' ')}
              >
                약관 전체 동의하기
              </span>
              <span
                className={[
                  'text-[11px] transition-colors duration-300',
                  allAgreed ? 'text-sky-300/60' : 'text-white/40',
                ].join(' ')}
              >
                필수 이용약관 및 개인정보 처리방침
              </span>
            </div>
          </div>

          {/* 개별 동의 2개 */}
          <div className="flex gap-3 px-1">
            {/* 이용약관 */}
            <div
              className="flex flex-1 items-center gap-2.5 cursor-pointer"
              onClick={() => setAgreedTerms(!agreedTerms)}
            >
              <div className="scale-90">
                <Checkbox checked={agreedTerms} onChange={setAgreedTerms} />
              </div>
              <span className="text-[12px] text-white/60 font-medium">
                이용약관 <span className="text-sky-300/60 ml-0.5">(필수)</span>
              </span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveTab('terms');
                }}
                className="ml-auto text-[11px] text-white/30 underline underline-offset-2 hover:text-white/55 transition"
              >
                보기
              </button>
            </div>

            {/* 개인정보 처리방침 */}
            <div
              className="flex flex-1 items-center gap-2.5 cursor-pointer"
              onClick={() => setAgreedPrivacy(!agreedPrivacy)}
            >
              <div className="scale-90">
                <Checkbox checked={agreedPrivacy} onChange={setAgreedPrivacy} />
              </div>
              <span className="text-[12px] text-white/60 font-medium">
                개인정보처리방침{' '}
                <span className="text-sky-300/60 ml-0.5">(필수)</span>
              </span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveTab('privacy');
                }}
                className="ml-auto text-[11px] text-white/30 underline underline-offset-2 hover:text-white/55 transition"
              >
                보기
              </button>
            </div>
          </div>

          {/* CTA 버튼 */}
          <button
            type="button"
            onClick={handleCompleteSignup}
            disabled={!canProceed}
            className={[
              'w-full h-[54px] rounded-2xl text-[16px] font-bold tracking-tight',
              'flex items-center justify-center transition-all duration-300',
              'active:scale-[0.98]',
              canProceed
                ? 'bg-[linear-gradient(180deg,var(--cta-from)_0%,var(--cta-to)_100%)] border-white/14 text-white shadow-[0_12px_32px_rgba(0,0,0,0.3)] hover:brightness-110'
                : 'bg-white/5 border border-white/5 text-white/20 cursor-not-allowed',
            ].join(' ')}
          >
            {isSubmitting ? '처리 중...' : '동의하고 시작하기'}
          </button>

          {/* 취소 버튼 */}
          <button
            type="button"
            onClick={handleCancel}
            disabled={isCancelling || isSubmitting}
            className="w-full text-center text-[13px] text-white/35 hover:text-white/55 transition py-1"
          >
            {isCancelling ? '취소 중...' : '회원가입 취소'}
          </button>
        </div>
      </div>
      {errorMsg && (
        <ErrorModal description={errorMsg} onClose={() => setErrorMsg(null)} />
      )}
    </div>
  );
}
