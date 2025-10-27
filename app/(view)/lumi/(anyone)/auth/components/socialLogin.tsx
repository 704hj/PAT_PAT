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
