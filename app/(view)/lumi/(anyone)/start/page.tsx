"use client";

import { useRouter } from "next/navigation";
import MinimalIntro from "./miniIntro";
import LoginButton from "../../components/loginBtn";

const CAT_SRC = "/images/icon/lumi/lumi_start.svg";

export default function Onboarding() {
  const router = useRouter();

  return (
    <div className="flex flex-col w-full items-center">
      <div className="flex flex-col items-center">
        <span className="font-dunggeunmis  text-white text-[50px] leading-[1.3] font-bold tracking-[-0.01em] mt-24">
          PAT PAT
        </span>
        <span className="text-[14px] text-[#B9B9B9] font-light mt-[18px]">
          “오늘도, 마음을 토닥토닥”
        </span>
      </div>
      <div className="flex w-full items-start justify-end">
        <img src={"/images/icon/lumi/lumi_start.svg"} className=""></img>
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
        <div className="bg-[#A0AFDA] h-[1px] w-full mt-12"></div>
        <div className="flex flex-row w-full justify-around mt-1.5">
          <a className="text-[#A6A6A6] text-[15px]" href="/lumi/auth/signup">
            회원가입
          </a>
          <a className="text-[#A6A6A6] text-[15px]" href="/lumi/auth/signin">
            로그인
          </a>
        </div>
      </div>
    </div>
  );
}
