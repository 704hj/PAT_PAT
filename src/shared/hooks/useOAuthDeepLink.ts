'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { App } from '@capacitor/app';
import { Browser } from '@capacitor/browser';
import { Capacitor } from '@capacitor/core';

import { supabase } from '@/utils/supabase/client';

/**
 * 네이티브 앱에서 OAuth 딥링크 콜백을 처리합니다.
 * com.patpat.app://auth/callback?code=xxx 형태의 URL을 수신하면
 * code를 세션으로 교환하고 /home으로 이동합니다.
 */
export function useOAuthDeepLink() {
  const router = useRouter();

  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;

    const listenerPromise = App.addListener('appUrlOpen', async ({ url }) => {
      if (!url.includes('auth/callback')) return;

      const urlObj = new URL(url);
      const code = urlObj.searchParams.get('code');

      if (!code) return;

      const { data, error } = await supabase.auth.exchangeCodeForSession(code);

      if (error) {
        console.error('[OAuthDeepLink] Session exchange failed:', error.message);
        await Browser.close();
        router.replace('/start?error=UNAUTHORIZED');
        return;
      }

      // 신규 유저 여부 확인 (users 테이블에 레코드 없으면 약관 동의 필요)
      const authUserId = data.user?.id;
      const { data: existingUser } = await supabase
        .from('users')
        .select('user_id')
        .eq('auth_user_id', authUserId)
        .maybeSingle();

      await Browser.close();
      router.replace(existingUser ? '/home' : '/auth/terms');
    });

    return () => {
      listenerPromise.then((l) => l.remove());
    };
  }, [router]);
}
