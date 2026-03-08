'use client';

import { Browser } from '@capacitor/browser';
import { Capacitor } from '@capacitor/core';

import { supabase } from '@/utils/supabase/client';

const DEEP_LINK_CALLBACK = 'com.patpat.app://auth/callback';

export async function signInWithGoogle(nextPath: string = '/') {
  if (Capacitor.isNativePlatform()) {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: DEEP_LINK_CALLBACK,
        skipBrowserRedirect: true,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    });

    if (error || !data.url) {
      console.error('Google login error:', error?.message);
      return;
    }

    await Browser.open({ url: data.url });
  } else {
    const origin = window.location.origin;
    const callbackUrl = `${origin}/api/auth/callback?next=${encodeURIComponent(nextPath)}`;

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: callbackUrl,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    });

    if (error) {
      console.error('Google login error:', error.message);
    }
  }
}
