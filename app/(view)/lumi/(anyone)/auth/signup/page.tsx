"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { supabase } from "@/app/utils/supabase/client";
import SocialLogin from "../components/socialLogin";

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

  const emailLogin = async () => {
    router.push("/lumi/auth/email");
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

        <div
          className="flex flex-col items-center mt-6 rounded-[16px] border border-white/12 
             bg-white/6 backdrop-blur px-5 pt-5 pb-6 text-center shadow-[0_12px_36px_rgba(7,17,40,0.35)]"
        >
          {/* 별빛 계정 만들기 버튼 */}
          <button
            onClick={emailLogin}
            type="button"
            disabled={!emailLogin || busy}
            className={[
              "w-full max-w-[360px] h-12 rounded-[12px] text-[15px] font-semibold text-white",
              "bg-[linear-gradient(180deg,#18326f_0%,#0b1d4a_100%)] border border-white/14",
              "shadow-[0_6px_16px_rgba(10,18,38,0.32)] transition-all",
              busy || !emailLogin
                ? "opacity-50 cursor-not-allowed"
                : "hover:brightness-[1.03] active:translate-y-[1px]",
            ].join(" ")}
            tabIndex={0}
          >
            {busy ? "처리 중…" : "별빛 계정 만들기"}
          </button>

          {/* 구분선 */}
          <div className="relative w-full max-w-[360px] my-5">
            <div className="h-px bg-white/10" />
            <span
              className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 
                 px-3 text-white/60 text-[16px] bg-[#0b1d4a]/50 backdrop-blur-sm rounded-full"
            >
              or
            </span>
          </div>

          {/* SNS 로그인 (SocialLogin 컴포넌트) */}
          <div className="w-full max-w-[360px]">
            <SocialLogin />
          </div>

          {/* 로그인 안내 */}
          <div className="mt-5">
            <button
              onClick={() => router.push("/lumi/auth/signin")}
              className="text-white/85 text-[13px] underline underline-offset-4 
                 hover:text-white transition py-6"
            >
              이미 계정이 있나요? 로그인
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
