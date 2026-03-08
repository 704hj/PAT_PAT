'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useRouter } from 'next/navigation';
import * as React from 'react';
import { useEffect, useRef, useState } from 'react';

import ErrorModal from '@/features/common/ErrorModal';
import { useOAuthDeepLink } from '@/shared/hooks/useOAuthDeepLink';
import { supabase } from '@/utils/supabase/client';

function OAuthDeepLinkHandler() {
  useOAuthDeepLink();
  return null;
}

/** 앱 사용 중 세션이 만료되면 모달 → signOut → /start */
function SessionErrorHandler() {
  const router = useRouter();
  const [sessionExpired, setSessionExpired] = useState(false);
  const wasLoggedIn = useRef(false);

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        wasLoggedIn.current = true;
      } else if (wasLoggedIn.current) {
        // 로그인 상태였다가 세션이 사라진 경우 (만료/오류)
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
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
