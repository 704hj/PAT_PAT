"use client";

import { supabase } from "@/app/lib/supabase/supbase";
import { useRouter } from "next/navigation";
import { useState } from "react";
import KakaoButton from "../components/SocialLogin";
import SocialButton from "../components/SocialLogin";
import SocialLogin from "../components/SocialLogin";

export default function SignUpPage() {
  const router = useRouter();
  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const canSubmit = nickname.trim().length >= 2 && /\S+@\S+\.\S+/.test(email);

  const submit = async () => {
    if (!canSubmit || busy) return;
    try {
      setBusy(true);
      // TODO: 여기에 회원가입 로직 연결 (예: 매직링크 발송)
      // await api.signUp({ nickname, email })
      router.replace("/lumi/home");
    } finally {
      setBusy(false);
    }
  };

  const social = async (provider: "google" | "kakao") => {
    if (busy) return;
    try {
      setBusy(true);
      // kakao 소셜 로그인, sighInWithOAuth : 회원가입이 되어있지 않은 유저의 로그인 시도를 자동으로 회원가입 과정이 일어나게끔 해주는 기능 포함
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "kakao",
        options: {
          //로컬 환경 주소
          redirectTo: `${process.env.NEXT_PUBLIC_REDIRECT_URL}/lumi/auth/callback`,
        },
      });
      // await api.oauthSignIn(provider)
      // router.replace("/lumi/home");
    } catch (error) {
      console.error("kakao 로그인 에러");
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="relative min-h-[100svh] overflow-hidden">
      <div
        aria-hidden
        className="absolute inset-0 -z-20 bg-[radial-gradient(100%_70%_at_50%_100%,#0b1d4a_0%,#091430_48%,#070f24_100%)]"
      />
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_center,transparent_60%,rgba(0,0,0,0.28))]"
      />

      <section className="relative mx-auto w-full max-w-[480px] aspect-[9/16] px-5">
        <header className="pt-8 text-center">
          <h1 className="text-white text-[20px] font-semibold tracking-tight">
            별빛 계정 만들기
          </h1>
          <p className="mt-1 text-white/70 text-[13px]">
            밤하늘에 기록을 오래 담아둘 수 있어요
          </p>
        </header>

        <div className="mt-6 rounded-[16px] border border-white/12 bg-white/6 backdrop-blur p-5">
          <label className="block text-white/80 text-[13px] mb-1">닉네임</label>
          <input
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="별빛에 표시될 이름"
            className="w-full h-11 rounded-[12px] px-3 bg-white/6 border border-white/12 text-white/90 placeholder:text-white/45 outline-none focus:border-white/30"
            maxLength={20}
          />

          <label className="block text-white/80 text-[13px] mt-4 mb-1">
            이메일
          </label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            inputMode="email"
            className="w-full h-11 rounded-[12px] px-3 bg-white/6 border border-white/12 text-white/90 placeholder:text-white/45 outline-none focus:border-white/30"
          />

          <button
            onClick={submit}
            disabled={!canSubmit || busy}
            className={[
              "mt-5 w-full h-12 rounded-[12px] text-[15px] font-semibold text-white",
              "bg-[linear-gradient(180deg,#18326f_0%,#0b1d4a_100%)] border border-white/14",
              "shadow-[0_6px_16px_rgba(10,18,38,0.32)]",
              busy || !canSubmit
                ? "opacity-50 cursor-not-allowed"
                : "hover:brightness-[1.03] active:translate-y-[1px]",
            ].join(" ")}
          >
            {busy ? "처리 중…" : "별빛 계정 만들기"}
          </button>

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
              onClick={() => router.push("/lumi/auth/signin")}
              className="text-white/85 text-[13px] underline underline-offset-4 hover:text-white transition"
            >
              이미 계정이 있나요? 로그인
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
