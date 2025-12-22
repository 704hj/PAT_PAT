"use client";

import LoginButton from "@/app/components/loginBtn";
import { signInWithGoogle } from "@/app/utils/supabase/signInWithGoogle";
import { signInWithKakao } from "@/app/utils/supabase/signInWithKakao";
import { useEffect, useState } from "react";
export default function Onboarding() {
  const [loaded, setLoaded] = useState<boolean>(false);
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

  useEffect(() => {
    setLoaded(true);
  }, []);
  return (
    <main
      className="
        relative
        min-h-screen
        min-w-[412px]          
        overflow-x-auto         
        flex justify-center
        bg-[radial-gradient(circle_at_center,_#0B183D_0%,_#070D1F_100%)]
      "
    >
      {/* 고양이: 항상 오른쪽 끝 */}
      <img
        src="/images/icon/lumi/lumi_start.svg"
        alt="Lumi 캐릭터"
        className="absolute right-0 top-50 z-[10]
                   w-[150px] sm:w-[150px] h-auto
                   select-none pointer-events-none"
        style={{
          opacity: loaded ? 1 : 0,
          transition: "opacity 0.3s ease-in-out",
        }}
      />

      {/* 가운데 카드 영역 */}
      <div
        className="
          w-full
          max-w-[480px]        
          px-4 pt-10 pb-10
          flex flex-col items-center
        "
      >
        <div className="flex flex-col items-center mt-24">
          <span className="font-surround text-white text-[50px] leading-[1.3] font-bold tracking-[-0.03em]">
            PAT PAT
          </span>
          <span className="text-[14px] text-[#656E8A] font-light mt-1 leading-[1.1]">
            로그인하고 오늘의 감정 기록을 시작해요
          </span>
        </div>

        <div className="flex w-full justify-end mt-40" />

        <div className="flex flex-col w-full px-4 items-center gap-5 mt-6">
          <LoginButton
            title="카카오로 시작하기"
            onClickEvent={onKakao}
            icon="/images/icon/sns/kakao.svg"
            style="bg-[#FEE300] text-[#353C3B]"
            disable={busy}
          />
          <LoginButton
            title="구글로 시작하기"
            onClickEvent={onGoogle}
            icon="/images/icon/sns/google.svg"
            style="bg-[#4B5672] text-[#FBFBFB]"
            disable={busy}
          />

          <LoginButton
            title="이메일로 시작하기"
            onClickEvent={() => {}}
            style="bg-[#1E2843] text-[#FBFBFB]"
          />

          <div className="bg-[#636B83] h-[1px] w-full mt-4" />

          <div className="mt-1.5 text-[#A6A6A6] text-[15px]">
            <a href="/lumi/auth/signup">회원가입</a>
          </div>
        </div>
      </div>
    </main>
  );
}
