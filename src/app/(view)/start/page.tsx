'use client';

import { Browser } from '@capacitor/browser';
import { Capacitor } from '@capacitor/core';
import ErrorModal from '@/features/common/ErrorModal';
import LoginButton from '@/shared/components/loginBtn';
import { supabase } from '@/utils/supabase/client';
import { signInWithGoogle } from '@/utils/supabase/signInWithGoogle';
import { signInWithKakao } from '@/utils/supabase/signInWithKakao';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';

function OnboardingContent() {
  const router = useRouter();
  const [loaded, setLoaded] = useState(false);
  const [busy, setBusy] = useState(false);

  const searchParams = useSearchParams();
  const errorCode = searchParams.get('error');

  const messages: Record<string, string> = {
    DB_ERROR: '계정 정보를 저장하는 데 실패했어요.',
    UNAUTHORIZED: '로그인 인증에 실패했습니다.',
    INVALID_CODE: '잘못된 접근입니다.',
  };

  let errorMessage = errorCode
    ? messages[errorCode] || '알 수 없는 오류가 발생했습니다.'
    : null;

  useEffect(() => {
    setLoaded(true);

    // 이미 로그인된 상태라면 즉시 홈으로
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) router.replace('/home');
    });

    // OAuth 완료 후 SIGNED_IN 이벤트로 홈 이동
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN') router.replace('/home');
    });

    return () => subscription.unsubscribe();
  }, [router]);

  const startOAuth = async (signIn: (path: string) => Promise<void>) => {
    if (busy) return;
    setBusy(true);
    const { data: { session } } = await supabase.auth.getSession();
    if (session) { router.replace('/home'); return; }

    if (Capacitor.isNativePlatform()) {
      // Native: Browser.open()은 브라우저가 열릴 때 resolve됨 (닫힐 때 아님)
      // browserFinished 이벤트가 올 때까지 busy 유지 → 버튼 비활성화 상태 유지
      const listener = await Browser.addListener('browserFinished', () => {
        setBusy(false);
        listener.remove();
      });
      await signIn('/home');
      // busy는 해제하지 않음 — browserFinished 또는 SIGNED_IN(→ /home 이동)에서 처리
    } else {
      // Web: signInWithOAuth가 페이지를 OAuth로 리다이렉트하므로 finally는 무해
      try {
        await signIn('/home');
      } finally {
        setBusy(false);
      }
    }
  };

  const onGoogle = () => startOAuth(signInWithGoogle);
  const onKakao = () => startOAuth(signInWithKakao);

  return (
    <main className="relative min-h-[100svh] w-full overflow-hidden flex justify-center">
      {/* (공통 배경은 Layout/body가 담당)
          페이지 전용 연출만 얹기 */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            'radial-gradient(1200px_900px_at_50%_10%,rgba(70,120,255,0.18),transparent_55%)',
        }}
      />

      {errorMessage && (
        <ErrorModal
          description={errorMessage}
          onClose={() => {
            errorMessage = null;
          }}
        />
      )}

      <img
        src="/images/icon/lumi/lumi_start.svg"
        alt="Lumi 캐릭터"
        className={[
          'absolute right-0 top-50 z-[10] w-[150px] h-auto select-none pointer-events-none',
          'transition-opacity duration-300 ease-in-out',
          loaded ? 'opacity-100' : 'opacity-0',
        ].join(' ')}
      />

      <div className="w-full max-w-[480px] px-5 pt-10 pb-10 flex flex-col items-center">
        <div className="flex flex-col items-center mt-24">
          <span className="font-surround text-white text-[50px] leading-[1.3] font-bold tracking-[-0.03em]">
            PAT PAT
          </span>

          {/* 토큰/룰 기반 톤으로 교체 (하드 컬러 제거) */}
          <span className="text-[14px] text-white/55 font-light mt-1 leading-[1.1]">
            로그인하고 오늘의 감정 기록을 시작해요
          </span>
        </div>

        <div className="flex flex-col w-full px-4 items-center gap-5 mt-44">
          <LoginButton
            title="카카오로 시작하기"
            onClickEvent={onKakao}
            icon="/images/icon/sns/kakao.svg"
            style="bg-[#FEE300] text-[#353C3B]"
            disable={busy}
          />
          <LoginButton
            title="구글로 시작하기"
            onClickEvent={onGoogle}
            icon="/images/icon/sns/google.svg"
            style="bg-[#4B5672] text-[#FBFBFB]"
            disable={busy}
          />
          <LoginButton
            title="이메일로 시작하기"
            onClickEvent={async () => {
              const { data: { session } } = await supabase.auth.getSession();
              if (session) { router.replace('/home'); return; }
              router.push('/auth/signin');
            }}
            style="bg-[#1E2843] text-[#FBFBFB]"
            disable={busy}
          />
        </div>
      </div>
    </main>
  );
}

export default function Onboarding() {
  return (
    <Suspense fallback={<div className="min-h-[100svh]" />}>
      <OnboardingContent />
    </Suspense>
  );
}
