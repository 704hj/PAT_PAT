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
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useRef, useState } from 'react';

type Tab = 'terms' | 'privacy';

function CheckIcon({ size = 10 }: { size?: number }) {
  return (
    <svg viewBox="0 0 12 10" fill="none" style={{ width: size, height: size }}>
      <path
        d="M1 5l3.5 3.5L11 1"
        stroke="currentColor"
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
  size = 'md',
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  size?: 'sm' | 'md';
}) {
  const dim = size === 'sm' ? 'h-[18px] w-[18px]' : 'h-5 w-5';
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={[
        'shrink-0 flex items-center justify-center rounded-md border transition-all duration-200',
        dim,
        checked
          ? 'bg-sky-400 border-sky-400 text-[#050b1c]'
          : 'border-white/20 bg-white/5 text-transparent hover:border-white/35',
      ].join(' ')}
    >
      <CheckIcon size={size === 'sm' ? 9 : 10} />
    </button>
  );
}

function TermsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isEmailFlow = searchParams.get('from') === 'email';
  const [activeTab, setActiveTab] = useState<Tab>('terms');
  const [agreedTerms, setAgreedTerms] = useState(false);
  const [agreedPrivacy, setAgreedPrivacy] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const allAgreed = agreedTerms && agreedPrivacy;
  const canProceed = allAgreed && !isSubmitting;

  const switchTab = (tab: Tab) => {
    setActiveTab(tab);
    scrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancel = async () => {
    if (isEmailFlow) {
      router.back();
      return;
    }
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
    if (isEmailFlow) {
      router.push('/auth/email');
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await completeSignupAction(new FormData());
      if (!res.ok) {
        setErrorMsg(res.message);
        setIsSubmitting(false);
        return;
      }
      router.push('/home');
    } catch (err: any) {
      setErrorMsg(err.message || '가입 처리 중 오류가 발생했습니다.');
      setIsSubmitting(false);
    }
  };

  const sections = activeTab === 'terms' ? TERMS_SECTIONS : PRIVACY_SECTIONS;

  return (
    <div className="flex-1 flex flex-col min-h-0 text-white relative">
      {/* 탭 바 */}
      <div className="shrink-0 z-20 px-5 pt-4 pb-0">
        <div className="flex gap-1 rounded-[12px] bg-white/[0.04] border border-white/8 p-1">
          {(['terms', 'privacy'] as Tab[]).map((tab) => {
            const label = tab === 'terms' ? '이용약관' : '개인정보 처리방침';
            const agreed = tab === 'terms' ? agreedTerms : agreedPrivacy;
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => switchTab(tab)}
                className={[
                  'relative flex flex-1 items-center justify-center gap-1.5 py-2.5 rounded-[9px] text-[13px] font-medium transition-all duration-200',
                  isActive
                    ? 'bg-white/10 text-white shadow-sm'
                    : 'text-white/40 hover:text-white/60',
                ].join(' ')}
              >
                {agreed && (
                  <span className="flex h-[16px] w-[16px] items-center justify-center rounded-full bg-sky-400 text-[#050b1c]">
                    <CheckIcon size={9} />
                  </span>
                )}
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 콘텐츠 */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto scroll-hide">
        <div className="px-5 pt-4 pb-4 space-y-2">
          {sections.map((s, idx) => (
            <section key={s.id} id={s.id}>
              <div className="px-4 py-4 rounded-[12px] border border-white/6 bg-white/[0.03]">
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-[10px] font-mono text-white/20 tabular-nums">
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                  <h2 className="text-[13px] font-semibold text-white/80">
                    {s.title}
                  </h2>
                </div>
                <p className="whitespace-pre-line text-[12px] leading-[1.85] text-white/45 pl-5">
                  {s.content}
                </p>
              </div>
            </section>
          ))}
          <div className="h-2" />
        </div>
      </div>

      {/* 하단 동의 바 */}
      <div className="shrink-0 border-t border-white/8 bg-[rgba(5,11,28,0.95)] backdrop-blur-2xl px-5 pt-4 pb-[max(20px,env(safe-area-inset-bottom))]">
        <div className="space-y-2.5">
          {/* 전체 동의 */}
          <div
            role="checkbox"
            aria-checked={allAgreed}
            tabIndex={0}
            onClick={() => {
              setAgreedTerms(!allAgreed);
              setAgreedPrivacy(!allAgreed);
            }}
            onKeyDown={(e) => {
              if (e.key === ' ' || e.key === 'Enter') {
                e.preventDefault();
                setAgreedTerms(!allAgreed);
                setAgreedPrivacy(!allAgreed);
              }
            }}
            className={[
              'flex items-center gap-3 rounded-[12px] px-4 py-3.5 cursor-pointer transition-all duration-200 select-none',
              allAgreed
                ? 'bg-sky-400/10 border border-sky-400/25'
                : 'bg-white/[0.04] border border-white/10',
            ].join(' ')}
          >
            <span
              className={[
                'shrink-0 flex h-5 w-5 items-center justify-center rounded-md border transition-all duration-200',
                allAgreed
                  ? 'bg-sky-400 border-sky-400 text-[#050b1c]'
                  : 'border-white/20 bg-white/5 text-transparent',
              ].join(' ')}
            >
              <CheckIcon size={10} />
            </span>
            <div>
              <p className="text-[13.5px] font-semibold text-white/90 leading-tight">
                약관 전체 동의
              </p>
              <p className="text-[11.5px] text-white/40 mt-0.5">
                이용약관 · 개인정보 처리방침 (필수)
              </p>
            </div>
          </div>

          {/* 개별 동의 */}
          <div className="space-y-1 px-1">
            {(
              [
                {
                  key: 'terms' as Tab,
                  label: '이용약관',
                  checked: agreedTerms,
                  set: setAgreedTerms,
                },
                {
                  key: 'privacy' as Tab,
                  label: '개인정보 처리방침',
                  checked: agreedPrivacy,
                  set: setAgreedPrivacy,
                },
              ] as const
            ).map(({ key, label, checked, set }) => (
              <div
                key={key}
                className="flex items-center gap-2.5 py-1.5 cursor-pointer"
                onClick={() => set(!checked)}
              >
                <Checkbox size="sm" checked={checked} onChange={set} />
                <span className="text-[12px] text-white/55 flex-1">
                  {label}{' '}
                  <span className="text-sky-400/60 text-[11px]">(필수)</span>
                </span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    switchTab(key);
                  }}
                  className="text-[11px] text-white/30 hover:text-white/55 transition underline underline-offset-2"
                >
                  보기
                </button>
              </div>
            ))}
          </div>

          {/* CTA */}
          <button
            type="button"
            onClick={handleCompleteSignup}
            disabled={!canProceed}
            className={[
              'w-full h-[52px] rounded-[12px] text-[15px] font-bold tracking-tight transition-all duration-300 active:scale-[0.98]',
              canProceed
                ? 'bg-[linear-gradient(180deg,var(--cta-from)_0%,var(--cta-to)_100%)] text-white shadow-[0_8px_24px_rgba(0,0,0,0.3)] hover:brightness-110'
                : 'bg-white/5 border border-white/5 text-white/20 cursor-not-allowed',
            ].join(' ')}
          >
            {isSubmitting ? '처리 중...' : '동의하고 시작하기'}
          </button>

          {/* 취소 */}
          <button
            type="button"
            onClick={handleCancel}
            disabled={isCancelling || isSubmitting}
            className="w-full text-center text-[12.5px] text-white/30 hover:text-white/50 transition py-1"
          >
            {isCancelling ? '취소 중...' : '뒤로가기'}
          </button>
        </div>
      </div>

      {errorMsg && (
        <ErrorModal description={errorMsg} onClose={() => setErrorMsg(null)} />
      )}
    </div>
  );
}

export default function TermsPage() {
  return (
    <Suspense>
      <TermsContent />
    </Suspense>
  );
}
