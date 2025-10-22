"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import SocialButton from "../components/socialLogin";
import SocialLogin from "../components/socialLogin";

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const canSubmit = /\S+@\S+\.\S+/.test(email);

  const signin = async () => {
    if (!canSubmit || busy) return;
    try {
      setBusy(true);
      // TODO: 매직링크/이메일 로그인 연결
      // await api.signInWithMagicLink(email)
      router.replace("/lumi/home");
    } finally {
      setBusy(false);
    }
  };

  const social = async (provider: "google" | "apple") => {
    if (busy) return;
    try {
      setBusy(true);
      // TODO: 소셜 로그인 연결
      // await api.oauthSignIn(provider)
      router.replace("/lumi/home");
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
            별빛 열기
          </h1>
          <p className="mt-1 text-white/70 text-[13px]">기록을 다시 이어가요</p>
        </header>

        <div className="mt-6 rounded-[16px] border border-white/12 bg-white/6 backdrop-blur p-5">
          <label className="block text-white/80 text-[13px] mb-1">이메일</label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            inputMode="email"
            className="w-full h-11 rounded-[12px] px-3 bg-white/6 border border-white/12 text-white/90 placeholder:text-white/45 outline-none focus:border-white/30"
          />

          <button
            onClick={signin}
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
            {busy ? "처리 중…" : "매직 링크 보내기"}
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
// app/lumi/signin/page.tsx  (또는 src/app/...)
// "use client";

// export default function LumiSignInPage() {
//   return <div style={{ padding: 24 }}>lumi/signin alive</div>;
// }
