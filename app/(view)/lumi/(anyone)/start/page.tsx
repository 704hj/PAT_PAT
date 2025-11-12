"use client";

import { useState } from "react";
import LoginButton from "../../components/loginBtn";

export default function Onboarding() {
  const [loaded, setLoaded] = useState<boolean>(false);
  return (
    <div className="flex flex-col w-full items-center">
      <div className="flex flex-col items-center mt-24">
        <span className="font-dunggeunmis text-white text-[50px] leading-[1.3] font-bold tracking-[-0.01em]">
          PAT PAT
        </span>
        <span className="text-[14px] text-[#B9B9B9] font-light mt-[18px]">
          “오늘도, 마음을 토닥토닥”
        </span>
      </div>

      <div className="flex w-full justify-end mt-4">
        <img
          src="/images/icon/lumi/lumi_start.svg"
          alt="Lumi 캐릭터"
          className="w-[150px] h-[150px]"
          onLoad={() => setLoaded(true)}
          style={{
            opacity: loaded ? 1 : 0,
            transition: "opacity 0.3s ease-in-out",
          }}
        />
      </div>

      <div className="flex flex-col w-full px-4 items-center gap-5 mt-6">
        <LoginButton
          title="카카오로 시작하기"
          onClickEvent={() => {}}
          icon="/images/icon/sns/kakao.svg"
          style="bg-[#FEE300] text-[#353C3B]"
        />
        <LoginButton
          title="구글로 시작하기"
          onClickEvent={() => {}}
          icon="/images/icon/sns/google.svg"
          style="bg-[#4B5672] text-[#FBFBFB]"
        />
        <LoginButton
          title="이메일로 시작하기"
          onClickEvent={() => {}}
          style="bg-[#1E2843] text-[#FBFBFB]"
        />

        <div className="bg-[#A0AFDA] h-[1px] w-full mt-12" />

        <div className="flex justify-around w-full mt-1.5 text-[#A6A6A6] text-[15px]">
          <a href="/lumi/auth/signup">회원가입</a>
          <a href="/lumi/auth/signin">로그인</a>
        </div>
      </div>
    </div>
  );
}
