"use client";

import { supabase } from "@/app/utils/supabase/client";

export async function signInWithKakao() {
  const redirectTo = `${window.location.origin}/api/auth/callback`; // 고정 ENV 대신 현재 도메인
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "kakao",
    options: { redirectTo },
  });
  if (error) console.error(error);
}
