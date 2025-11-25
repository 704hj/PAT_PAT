"use client";

import React, { useState } from "react";
import { signInWithKakao } from "@/app/utils/supabase/signInWithKakao";
import { signInWithGoogle } from "@/app/utils/supabase/signInWithGoogle";
import LoginButton from "../../../components/loginBtn";

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
      await signInWithKakao("/lumi/home");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <LoginButton
        title="카카오로 시작하기"
        onClickEvent={onKakao}
        icon="/images/icon/sns/kakao.svg"
        style="bg-[#FEE300] text-[#353C3B]"
      />
      <LoginButton
        title="구글로 시작하기"
        onClickEvent={onGoogle}
        icon="/images/icon/sns/google.svg"
        style="bg-[#4B5672] text-[#FBFBFB]"
      />
    </div>
  );
}
