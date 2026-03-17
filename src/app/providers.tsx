'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { usePathname, useRouter } from 'next/navigation';
import * as React from 'react';
import { useEffect, useRef, useState } from 'react';

import ErrorModal from '@/features/common/ErrorModal';
import { useOAuthDeepLink } from '@/shared/hooks/useOAuthDeepLink';
import { supabase } from '@/utils/supabase/client';
import { Capacitor } from '@capacitor/core';

function OAuthDeepLinkHandler() {
  useOAuthDeepLink();
  return null;
}

/** 네트워크 오프라인 시 안내 배너를 표시하고, 재연결 시 페이지를 리로드합니다. */
function NetworkStatusHandler() {
  const [offline, setOffline] = useState(false);

  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;

    let Network: typeof import('@capacitor/network').Network;

    async function init() {
      const mod = await import('@capacitor/network');
      Network = mod.Network;

      const status = await Network.getStatus();
      setOffline(!status.connected);

      await Network.addListener('networkStatusChange', (s) => {
        const wasOffline = !s.connected;
        setOffline(wasOffline);
        if (!wasOffline) {
          // 재연결 시 WebView 리로드
          window.location.reload();
        }
      });
    }

    init();

    return () => {
      Network?.removeAllListeners();
    };
  }, []);

  if (!offline) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 9999,
        background: 'rgba(10, 10, 30, 0.95)',
        color: 'rgba(255,255,255,0.85)',
        textAlign: 'center',
        padding: '12px 16px',
        fontSize: '14px',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
      }}
    >
      인터넷에 연결되지 않았습니다. 연결을 확인해 주세요.
    </div>
  );
}

/** 앱 사용 중 세션이 만료되면 모달 → signOut → /start */
function SessionErrorHandler() {
  const router = useRouter();
  const pathname = usePathname();
  const [sessionExpired, setSessionExpired] = useState(false);
  const wasLoggedIn = useRef(false);

  // 이메일 가입 플로우 등 auth 페이지에서는 세션 만료 감지 불필요
  const isAuthPage =
    pathname.startsWith('/auth') ||
    pathname.startsWith('/start') ||
    pathname === '/';

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        wasLoggedIn.current = true;
      } else if (
        wasLoggedIn.current &&
        !isAuthPage &&
        event !== 'SIGNED_OUT' // 의도적 로그아웃은 제외
      ) {
        // 로그인 상태였다가 세션이 예기치 않게 사라진 경우 (만료/오류)
        setSessionExpired(true);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleClose = async () => {
    await supabase.auth.signOut();
    setSessionExpired(false);
    router.replace('/start');
  };

  return (
    <ErrorModal
      open={sessionExpired}
      title="세션이 만료됐어요"
      description="다시 로그인해 주세요."
      onClose={handleClose}
    />
  );
}

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 30,
        refetchOnWindowFocus: false,
        retry: 1,
      },
      mutations: {
        retry: 0,
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined;

function getQueryClient() {
  if (typeof window === 'undefined') return makeQueryClient();
  if (!browserQueryClient) browserQueryClient = makeQueryClient();
  return browserQueryClient;
}

export function Providers({ children }: { children: React.ReactNode }) {
  const queryClient = getQueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <OAuthDeepLinkHandler />
      <SessionErrorHandler />
      <NetworkStatusHandler />
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
