"use client";

import { useRouter } from "next/navigation";
import SocialLogin from "../components/socialLogin";
import LoginButton from "@/app/components/loginBtn";
import { useSignIn } from "@/app/hooks/useSignIn";

export default function SignInPage() {
  const router = useRouter();
  const {
    email,
    password,
    loading,
    error,
    canSubmit,
    setEmail,
    setPassword,
    signIn,
    clearError,
    handleSubmit,
  } = useSignIn();

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

        <form
          onSubmit={handleSubmit}
          className="flex flex-col mt-6 rounded-[16px] border border-white/12 bg-white/6 backdrop-blur p-5 gap-4"
        >
          {/* 이메일 입력 */}
          <div>
            <input
              type="email"
              placeholder="이메일"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                clearError();
              }}
              className={`flex items-center gap-2 w-full text-[16px] py-4 rounded-2xl px-4 border ${
                error && error.includes("이메일") ? "border-red-500" : "border-white/12"
              } bg-white/5 text-white placeholder:text-white/50 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/30`}
            />
            {error && error.includes("이메일") && (
              <p className="mt-1 text-xs text-red-400">{error}</p>
            )}
          </div>

          {/* 비밀번호 입력 */}
          <div>
            <input
              type="password"
              placeholder="비밀번호"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                clearError();
              }}
              className={`flex items-center gap-2 w-full text-[16px] py-4 rounded-2xl px-4 border ${
                error && !error.includes("이메일") ? "border-red-500" : "border-white/12"
              } bg-white/5 text-white placeholder:text-white/50 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/30`}
            />
            {error && !error.includes("이메일") && (
              <p className="mt-1 text-xs text-red-400">{error}</p>
            )}
          </div>

          {/* 로그인 버튼 */}
          <button
            type="submit"
            disabled={!canSubmit}
            className={`flex items-center gap-2 w-full text-[16px] justify-center py-4 rounded-2xl transition-colors ${
              canSubmit
                ? "bg-[#657FC2] text-white hover:bg-[#5570b5]"
                : "bg-[#657FC2]/50 text-white/50 cursor-not-allowed opacity-50"
            }`}
          >
            {loading ? "로그인 중..." : "로그인"}
          </button>

          <div className="relative my-4">
            <div className="h-px bg-white/10" />
            <span className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 px-3 text-white/60 text-[12px] bg-[#0d1a3d]">
              또는
            </span>
          </div>

          {/* Google 및 kakao */}
          <SocialLogin />

          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={() => router.push("/lumi/auth/email")}
              className="text-white/85 text-[13px] underline underline-offset-4 hover:text-white transition"
            >
              계정이 없나요? 이메일로 가입하기
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}
