// import { supabase } from "@/app/lib/supabase/client";
// import { signInWithKakao } from "@/app/utils/supabase/signInWithKakao";
// import { signInWithGoogle } from "@/app/utils/supabase/signInWithGoogle";

// import React, { useState } from "react";

// export default function SocialLogin() {
//   const [busy, setBusy] = useState(false);

//   const social = async (provider: "google" | "kakao") => {
//     if (busy) return;
//     try {
//       setBusy(true);
//       // kakao 소셜 로그인, sighInWithOAuth : 회원가입이 되어있지 않은 유저의 로그인 시도를 자동으로 회원가입 과정이 일어나게끔 해주는 기능 포함
//       const { data, error } = await supabase.auth.signInWithOAuth({
//         provider: "kakao",
//         options: {
//           //로컬 환경 주소
//           redirectTo: `${process.env.NEXT_PUBLIC_REDIRECT_URL}/lumi/auth/callback`,
//           scopes: "profile_nickname profile_image account_email",
//         },
//       });
//       // await api.oauthSignIn(provider)
//       // router.replace("/lumi/home");
//     } catch (error) {
//       console.error("kakao 로그인 에러");
//     } finally {
//       setBusy(false);
//     }
//   };
//   return (
//     <div className="grid gap-2">
//       <button
//         onClick={() => signInWithGoogle()}
//         // className="h-11 rounded-[12px] bg-white/90 text-[#0b1d4a] font-medium hover:bg-white transition"
//       >
//         <img
//           src="/images/icon/google_login_large_wide.png"
//           alt="Google 로그인"
//           className="hover:bg-opacity-70"
//         />
//         Google로 계속하기
//       </button>
//       <button title="kakao 로그인" onClick={() => signInWithKakao()}>
//         <img
//           src="/images/icon/kakao_login_large_wide.png"
//           alt="kakao 로그인"
//           className="hover:bg-opacity-70"
//         />
//       </button>
//     </div>
//   );
// }

// app/lumi/auth/components/SocialLogin.tsx
"use client";

import React, { useState } from "react";
import { signInWithKakao } from "@/app/utils/supabase/signInWithKakao";
import { signInWithGoogle } from "@/app/utils/supabase/signInWithGoogle";

export default function SocialLogin() {
  const [busy, setBusy] = useState(false);

  const onGoogle = async () => {
    if (busy) return;
    setBusy(true);
    try {
      await signInWithGoogle("/lumi/home");
    } finally {
      setBusy(false);
    }
  };

  const onKakao = async () => {
    if (busy) return;
    setBusy(true);
    try {
      await signInWithKakao();
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="grid gap-2">
      {/* Google */}
      <button
        onClick={onGoogle}
        disabled={busy}
        aria-label="Google 로그인"
        className={[
          "w-full h-12 rounded-[12px] overflow-hidden",
          "bg-transparent p-0 disabled:opacity-60",
          "transition-[opacity,transform] hover:opacity-90 active:scale-[0.995]",
        ].join(" ")}
      >
        <img
          src="/images/icon/google_login_large_wide.png"
          alt="Google 로그인"
          className="w-full h-full object-contain pointer-events-none"
          draggable={false}
        />
      </button>

      {/* Kakao */}
      <button
        title="kakao 로그인"
        onClick={onKakao}
        disabled={busy}
        aria-label="Kakao 로그인"
        className={[
          "w-full h-12 rounded-[12px] overflow-hidden",
          "bg-transparent p-0 disabled:opacity-60",
          "transition-[opacity,transform] hover:opacity-90 active:scale-[0.995]",
        ].join(" ")}
      >
        <img
          src="/images/icon/kakao_login_large_wide.png"
          alt="kakao 로그인"
          className="w-full h-full object-contain pointer-events-none"
          draggable={false}
        />
      </button>
    </div>
  );
}
