"use client";

import { supabase } from "@/app/utils/supabase/client";

export async function signInWithGoogle(nextPath: string = "/") {
  const origin = window.location.origin;
  // const state = btoa(JSON.stringify({ next: nextPath, t: Date.now() }));
  /**
   * 구글로 회원가입 클릭
   *  > signInWithOAuth -> 구글 로그인 페이지로 이동
   *      > 구글 로그인 성공
   *      > redirectTo(콜백 라우트)에서 code 파라미터 받아서 supabase.auth.exchangeCodeForSession(code) 실행
   *      > 세션 생성
   *      > 시작 페이지로 리다이렉트
   */
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${origin}/auth/callback?next=${encodeURIComponent(
        nextPath
      )}`,
      queryParams: {
        access_type: "offline",
        prompt: "consent",
        // state,
      },
    },
  });

  if (error) console.error("Google login error:", error.message);
}
