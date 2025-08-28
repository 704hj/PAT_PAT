"use client";

import { createSupabaseClient } from "./client";

export const signInWithKakao = async () => {
  const supabase = createSupabaseClient();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "kakao",
    options: {
      //로컬 환경 주소
      redirectTo: `${process.env.NEXT_PUBLIC_REDIRECT_URL}/auth/callback`,

      // http://localhost:3000 or https://배포한 도메인
    },
  });

  if (error) alert(error.message);

  if (data) console.log(data);
  return data;
};
