"use client";

import { supabase } from "@/app/utils/supabase/client";

export async function signInWithKakao(nextPath: string = "/home") {
  const origin = window.location.origin;
  const redirectTo = `${origin}/api/auth/callback?next=${encodeURIComponent(
    nextPath
  )}`;

  console.log("[signInWithKakao] Origin:", origin);
  console.log("[signInWithKakao] Callback URL:", redirectTo);

  const { error } = await supabase.auth.signInWithOAuth({
    provider: "kakao",
    options: { redirectTo },
  });

  if (error) {
    console.error("Kakao login error:", error.message);
    console.error("Kakao login error details:", error);
  }
}
