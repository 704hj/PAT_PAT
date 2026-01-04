"use client";

import React from "react";
import { useSignUp } from "@/features/auth/hooks/useSignUp";

export default function EmailSignupPage() {
  const {
    nickname,
    email,
    code,
    password,
    password2,
    nicknameChecking,
    nicknameAvailable,
    nicknameError,
    sendingOtp,
    otpSent,
    verifyingOtp,
    otpVerified,
    otpError,
    passwordError,
    password2Error,
    busy,
    setNickname,
    setEmail,
    setCode,
    checkNickname,
    sendOtp,
    verifyOtp,
    handlePasswordChange,
    handlePassword2Change,
    handleSubmit,
  } = useSignUp();

  return (
    <div className="min-h-screen flex justify-center bg-gradient-to-b from-[#0a1230] to-[#0e143c] text-slate-200 p-6 py-10 overflow-y-auto">
      <div className="w-full max-w-md rounded-3xl bg-[rgba(24,32,64,0.85)] backdrop-blur-md shadow-2xl p-8 h-fit">
        <h2 className="text-2xl font-semibold text-slate-100 mb-1">
          별빛 계정 만들기
        </h2>
        <p className="text-sm text-slate-400 mb-6">
          이메일 인증으로 계정을 생성하세요
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* 닉네임 */}
          <div>
            <label
              htmlFor="nickname"
              className="block text-sm text-slate-300 mb-2"
            >
              닉네임
            </label>
            <div className="flex gap-2">
              <input
                id="nickname"
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="별빛의 사용자 이름"
                className={`flex-1 rounded-2xl border ${
                  nicknameAvailable === true
                    ? "border-green-500"
                    : nicknameAvailable === false
                    ? "border-red-500"
                    : "border-slate-700/60"
                } bg-[#101736] px-4 py-3 text-slate-100 placeholder:text-slate-500 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/30`}
                maxLength={20}
              />
              <button
                type="button"
                onClick={checkNickname}
                disabled={nicknameChecking || !nickname.trim()}
                className="rounded-2xl bg-indigo-600 px-4 py-3 text-sm text-slate-50 hover:bg-indigo-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
              >
                {nicknameChecking ? "확인중..." : "중복검사"}
              </button>
            </div>
            {nicknameError && (
              <p className="mt-1 text-xs text-red-400">{nicknameError}</p>
            )}
            {nicknameAvailable === true && (
              <p className="mt-1 text-xs text-green-400">
                사용 가능한 닉네임입니다.
              </p>
            )}
          </div>

          {/* 이메일 */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm text-slate-300 mb-2"
            >
              이메일
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full rounded-2xl border border-slate-700/60 bg-[#101736] px-4 py-3 text-slate-100 placeholder:text-slate-500 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/30"
            />
          </div>

          {/* 인증번호 + 버튼 */}
          <div>
            <label htmlFor="code" className="block text-sm text-slate-300 mb-2">
              인증번호
            </label>
            <div className="flex gap-2">
              <input
                id="code"
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="인증번호 입력"
                className={`flex-1 rounded-2xl border ${
                  otpVerified ? "border-green-500" : "border-slate-700/60"
                } bg-[#101736] px-4 py-3 text-slate-100 placeholder:text-slate-500 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/30`}
                disabled={!otpSent}
              />
              <button
                type="button"
                onClick={otpSent ? verifyOtp : sendOtp}
                disabled={
                  sendingOtp ||
                  verifyingOtp ||
                  !email ||
                  (otpSent && !code.trim())
                }
                className="rounded-2xl bg-indigo-600 px-4 py-3 text-sm text-slate-50 hover:bg-indigo-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
              >
                {sendingOtp
                  ? "발송중..."
                  : verifyingOtp
                  ? "확인중..."
                  : otpSent
                  ? "인증하기"
                  : "전송하기"}
              </button>
            </div>
            {otpError && (
              <p className="mt-1 text-xs text-red-400">{otpError}</p>
            )}
            {otpSent && !otpVerified && (
              <p className="mt-1 text-xs text-blue-400">
                이메일로 발송된 인증번호를 입력해주세요.
              </p>
            )}
            {otpVerified && (
              <p className="mt-1 text-xs text-green-400">
                인증이 완료되었습니다.
              </p>
            )}
          </div>

          {/* 비밀번호 */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm text-slate-300 mb-2"
            >
              비밀번호
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => handlePasswordChange(e.target.value)}
              placeholder="영문 소문자 + 숫자 필수 (8자 이상)"
              className={`w-full rounded-2xl border ${
                passwordError ? "border-red-500" : "border-slate-700/60"
              } bg-[#101736] px-4 py-3 text-slate-100 placeholder:text-slate-500 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/30`}
            />
            <p className="mt-1 text-xs text-slate-500">
              영문 소문자 + 숫자 필수, 기호 선택
            </p>
            {passwordError && (
              <p className="mt-1 text-xs text-red-400">{passwordError}</p>
            )}
          </div>

          {/* 비밀번호 확인 */}
          <div>
            <label
              htmlFor="password2"
              className="block text-sm text-slate-300 mb-2"
            >
              비밀번호 확인
            </label>
            <input
              id="password2"
              type="password"
              value={password2}
              onChange={(e) => handlePassword2Change(e.target.value)}
              placeholder="비밀번호 확인"
              className={`w-full rounded-2xl border ${
                password2Error ? "border-red-500" : "border-slate-700/60"
              } bg-[#101736] px-4 py-3 text-slate-100 placeholder:text-slate-500 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/30`}
            />
            {password2Error && (
              <p className="mt-1 text-xs text-red-400">{password2Error}</p>
            )}
          </div>

          {/* 버튼 */}
          <button
            type="submit"
            disabled={busy}
            className="w-full mt-3 rounded-2xl bg-indigo-600 py-4 text-center text-base text-slate-50 hover:bg-indigo-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {busy ? "처리 중..." : "생성하기"}
          </button>
        </form>
      </div>
    </div>
  );
}
