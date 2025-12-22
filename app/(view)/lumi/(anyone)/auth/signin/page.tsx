"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import SocialLogin from "../components/socialLogin";
import LoginButton from "@/app/components/loginBtn";

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const canSubmit = /\S+@\S+\.\S+/.test(email);

  return (
    <main className="relative min-h-[100svh] overflow-y-auto">
      <div
        aria-hidden
        className="absolute inset-0 -z-20 bg-[radial-gradient(100%_70%_at_50%_100%,#0b1d4a_0%,#091430_48%,#070f24_100%)]"
      />
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_center,transparent_60%,rgba(0,0,0,0.28))]"
      />

      <section className="relative mx-auto w-full max-w-[480px] min-h-[100svh] px-5 py-4">
        <header className="pt-8 text-center">
          <h1 className="text-white text-[20px] font-semibold tracking-tight">
            별빛 열기
          </h1>
          <p className="mt-1 text-white/70 text-[13px]">기록을 다시 이어가요</p>
        </header>

        <div className=" flex flex-col mt-6 rounded-[16px] border border-white/12 bg-white/6 backdrop-blur p-5 gap-4">
          {/* 아이디 입력 */}
          <input
            type="text"
            placeholder="아이디"
            className="flex items-center gap-2 w-full text-[16px] justify-center py-4 rounded-2xl p-3 border border-white/12 text-[#ffffff]"
          />
          {/* 비밀번호 입력 */}
          <input
            type="text"
            placeholder="비밀번호"
            className="flex items-center gap-2 w-full text-[16px] justify-center py-4 rounded-2xl p-3 border border-white/12 text-[#ffffff]"
          />
          {/* 로그인 버튼 */}
          <LoginButton
            title={"로그인"}
            onClickEvent={() => {}}
            style="bg-[#1E2843] text-[#FBFBFB]"
          />
          <div className="relative my-4">
            <div className="h-px bg-white/10" />
            <span className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 px-3 text-white/60 text-[12px] bg-transparent">
              또는
            </span>
          </div>
          {/* Google 및 kakao */}
          <SocialLogin />
          <div className="mt-4 text-center">
            <button
              onClick={() => router.push("/lumi/auth/signup")}
              className="text-white/85 text-[13px] underline underline-offset-4 hover:text-white transition"
            >
              계정이 없나요? 가입하기
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
