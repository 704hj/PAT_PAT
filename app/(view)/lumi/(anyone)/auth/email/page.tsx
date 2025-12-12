"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/app/utils/supabase/client";

export default function EmailLogin() {
  const router = useRouter();

  // 상태 관리
  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");

  // 검증 상태
  const [nicknameChecking, setNicknameChecking] = useState(false);
  const [nicknameAvailable, setNicknameAvailable] = useState<boolean | null>(
    null
  );
  const [nicknameError, setNicknameError] = useState("");
  const [sendingOtp, setSendingOtp] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [verifyingOtp, setVerifyingOtp] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [otpError, setOtpError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [password2Error, setPassword2Error] = useState("");
  const [busy, setBusy] = useState(false);

  // 비밀번호 검증: 소문자 영어 + 숫자 혼용
  const validatePassword = (pwd: string): boolean => {
    const hasLowercase = /[a-z]/.test(pwd);
    const hasNumber = /\d/.test(pwd);
    const isValidLength = pwd.length >= 8;
    const hasOnlyValidChars = /^[a-z0-9]+$/.test(pwd);
    return hasLowercase && hasNumber && isValidLength && hasOnlyValidChars;
  };

  // 닉네임 중복검사
  const checkNickname = async () => {
    if (!nickname.trim() || nickname.trim().length < 2) {
      setNicknameError("닉네임은 2자 이상이어야 합니다.");
      setNicknameAvailable(false);
      return;
    }

    setNicknameChecking(true);
    setNicknameError("");

    try {
      const res = await fetch("/lumi/auth/nickname/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nickname: nickname.trim() }),
      });

      // HTTP 오류 먼저 체크
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.message || `서버 오류(${res.status})`);
      }

      const data = await res.json();

      if (data.ok) {
        setNicknameAvailable(true);
        setNicknameError("");
      } else {
        setNicknameAvailable(false);
        setNicknameError(data.message || "이미 사용 중인 닉네임입니다.");
      }
    } catch (error: any) {
      console.error("닉네임 중복검사 오류:", error);
      setNicknameAvailable(false);
      setNicknameError(error.message || "서버 오류가 발생했습니다.");
    } finally {
      setNicknameChecking(false);
    }
  };

  // 인증번호 발송 (Supabase 클라이언트 API 사용)
  const sendOtp = async () => {
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setOtpError("올바른 이메일을 입력해주세요.");
      return;
    }

    setSendingOtp(true);
    setOtpError("");

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: true,
        },
      });

      if (error) {
        setOtpError(error.message);
        setOtpSent(false);
      } else {
        setOtpSent(true);
        setOtpError("");
      }
    } catch (error) {
      console.error("OTP 발송 오류:", error);
      setOtpError("인증번호 발송에 실패했습니다.");
      setOtpSent(false);
    } finally {
      setSendingOtp(false);
    }
  };

  // 인증번호 확인
  const verifyOtp = async () => {
    if (!code || code.trim().length === 0) {
      setOtpError("인증번호를 입력해주세요.");
      return;
    }

    setVerifyingOtp(true);
    setOtpError("");

    try {
      const { data, error } = await supabase.auth.verifyOtp({
        email,
        token: code.trim(),
        type: "email",
      });

      if (error) {
        setOtpError("인증번호가 올바르지 않습니다.");
        setOtpVerified(false);
      } else {
        setOtpVerified(true);
        setOtpError("");
      }
    } catch (error) {
      console.error("OTP 검증 오류:", error);
      setOtpError("인증번호 검증에 실패했습니다.");
      setOtpVerified(false);
    } finally {
      setVerifyingOtp(false);
    }
  };

  // 비밀번호 실시간 검증
  const handlePasswordChange = (value: string) => {
    setPassword(value);
    if (value.length > 0 && !validatePassword(value)) {
      setPasswordError(
        "비밀번호는 8자 이상, 소문자 영어와 숫자를 혼용해야 합니다."
      );
    } else {
      setPasswordError("");
    }
  };

  // 비밀번호 확인 실시간 검증
  const handlePassword2Change = (value: string) => {
    setPassword2(value);
    if (value.length > 0 && value !== password) {
      setPassword2Error("비밀번호가 일치하지 않습니다.");
    } else {
      setPassword2Error("");
    }
  };

  // 폼 제출
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 검증들 동일...
    if (!nicknameAvailable) {
      setNicknameError("닉네임 중복검사를 완료해주세요.");
      return;
    }
    if (!otpVerified) {
      setOtpError("인증번호 확인을 완료해주세요.");
      return;
    }
    if (!validatePassword(password)) {
      setPasswordError("비밀번호 형식을 확인해주세요.");
      return;
    }
    if (password !== password2) {
      setPassword2Error("비밀번호가 일치하지 않습니다.");
      return;
    }

    setBusy(true);
    try {
      // 서버 API를 통해 비밀번호 설정 (Admin API 사용)
      const response = await fetch("/lumi/auth/password/set", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          password,
          nickname: nickname.trim(),
        }),
      });

      const result = await response.json();

      if (!result.ok) {
        throw new Error(result.message || "회원가입에 실패했습니다.");
      }

      // 완료 - 홈으로 이동
      router.push("/lumi/home");
    } catch (error: any) {
      console.error("회원가입 오류:", error);
      setPasswordError(error.message || "회원가입에 실패했습니다.");
    } finally {
      setBusy(false);
    }
  };

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
                onChange={(e) => {
                  setNickname(e.target.value);
                  setNicknameAvailable(null);
                  setNicknameError("");
                }}
                placeholder="별빛의 사용자 이름"
                className={`w-auto rounded-2xl border ${
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
              onChange={(e) => {
                setEmail(e.target.value);
                setOtpSent(false);
                setOtpVerified(false);
                setOtpError("");
              }}
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
                onChange={(e) => {
                  setCode(e.target.value);
                  setOtpVerified(false);
                  setOtpError("");
                }}
                placeholder="인증번호 입력"
                className={`w-auto rounded-2xl border ${
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
              placeholder="소문자 영어 + 숫자 혼용 (8자 이상)"
              className={`w-full rounded-2xl border ${
                passwordError ? "border-red-500" : "border-slate-700/60"
              } bg-[#101736] px-4 py-3 text-slate-100 placeholder:text-slate-500 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/30`}
            />
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
