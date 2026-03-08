'use client';

import { Browser } from '@capacitor/browser';
import { Capacitor } from '@capacitor/core';

import { supabase } from '@/utils/supabase/client';

const DEEP_LINK_CALLBACK = 'com.patpat.app://auth/callback';

export async function signInWithKakao(nextPath: string = '/home') {
  if (Capacitor.isNativePlatform()) {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'kakao',
      options: {
        redirectTo: DEEP_LINK_CALLBACK,
        skipBrowserRedirect: true,
      },
    });

    if (error || !data.url) {
      console.error('Kakao login error:', error?.message);
      return;
    }

    await Browser.open({ url: data.url, windowName: '_self' });
  } else {
    const origin = window.location.origin;
    const redirectTo = `${origin}/api/auth/callback?next=${encodeURIComponent(nextPath)}`;

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'kakao',
      options: { redirectTo },
    });

    if (error) {
      console.error('Kakao login error:', error.message);
    }
  }
}
