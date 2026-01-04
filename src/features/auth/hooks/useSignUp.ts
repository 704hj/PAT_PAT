"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/utils/supabase/client";
import { validatePassword, validateEmail } from "@/utils/validation";
import { checkEmailProviders } from "@/utils/auth/providerCheck";

interface UseSignUpReturn {
  // 폼 상태
  nickname: string;
  email: string;
  code: string;
  password: string;
  password2: string;

  // 검증 상태
  nicknameChecking: boolean;
  nicknameAvailable: boolean | null;
  nicknameError: string;
  sendingOtp: boolean;
  otpSent: boolean;
  verifyingOtp: boolean;
  otpVerified: boolean;
  otpError: string;
  passwordError: string;
  password2Error: string;
  busy: boolean;

  // 액션
  setNickname: (value: string) => void;
  setEmail: (value: string) => void;
  setCode: (value: string) => void;
  setPassword: (value: string) => void;
  setPassword2: (value: string) => void;
  checkNickname: () => Promise<void>;
  sendOtp: () => Promise<void>;
  verifyOtp: () => Promise<void>;
  handlePasswordChange: (value: string) => void;
  handlePassword2Change: (value: string) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
}

/**
 * 회원가입 훅
 */
export function useSignUp(): UseSignUpReturn {
  const router = useRouter();

  // 폼 상태
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

  // 닉네임 변경 핸들러
  const handleNicknameChange = (value: string) => {
    setNickname(value);
    setNicknameAvailable(null);
    setNicknameError("");
  };

  // 이메일 변경 핸들러
  const handleEmailChange = (value: string) => {
    setEmail(value);
    setOtpSent(false);
    setOtpVerified(false);
    setOtpError("");
  };

  // 인증코드 변경 핸들러
  const handleCodeChange = (value: string) => {
    setCode(value);
    setOtpVerified(false);
    setOtpError("");
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
      const res = await fetch("/api/auth/nickname/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nickname: nickname.trim() }),
      });

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

  // 인증번호 발송
  const sendOtp = async () => {
    if (!email || !validateEmail(email)) {
      setOtpError("올바른 이메일을 입력해주세요.");
      return;
    }

    setSendingOtp(true);
    setOtpError("");

    try {
      // Provider 확인: Email 가입 시도 전에 다른 provider로 가입되어 있는지 확인
      const providerCheck = await checkEmailProviders(email);
      if (!providerCheck.canUseEmail) {
        setOtpError(
          providerCheck.errorMessage ||
            "이미 다른 방법으로 가입된 이메일입니다."
        );
        setSendingOtp(false);
        return;
      }

      // Provider 확인 통과 후 OTP 발송 진행
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
      const { error } = await supabase.auth.verifyOtp({
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
    if (value.length > 0) {
      const { valid, message } = validatePassword(value);
      setPasswordError(valid ? "" : message);
    } else {
      setPasswordError("");
    }
    // 비밀번호 확인도 다시 검증
    if (password2.length > 0 && value !== password2) {
      setPassword2Error("비밀번호가 일치하지 않습니다.");
    } else {
      setPassword2Error("");
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

    // 검증
    if (!nicknameAvailable) {
      setNicknameError("닉네임 중복검사를 완료해주세요.");
      return;
    }
    if (!otpVerified) {
      setOtpError("인증번호 확인을 완료해주세요.");
      return;
    }
    const { valid, message } = validatePassword(password);
    if (!valid) {
      setPasswordError(message);
      return;
    }
    if (password !== password2) {
      setPassword2Error("비밀번호가 일치하지 않습니다.");
      return;
    }

    setBusy(true);
    try {
      const response = await fetch("/api/auth/password/set", {
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
      router.push("/home");
    } catch (error: any) {
      console.error("회원가입 오류:", error);
      setPasswordError(error.message || "회원가입에 실패했습니다.");
    } finally {
      setBusy(false);
    }
  };

  return {
    // 폼 상태
    nickname,
    email,
    code,
    password,
    password2,

    // 검증 상태
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

    // 액션
    setNickname: handleNicknameChange,
    setEmail: handleEmailChange,
    setCode: handleCodeChange,
    setPassword: handlePasswordChange,
    setPassword2: handlePassword2Change,
    checkNickname,
    sendOtp,
    verifyOtp,
    handlePasswordChange,
    handlePassword2Change,
    handleSubmit,
  };
}
