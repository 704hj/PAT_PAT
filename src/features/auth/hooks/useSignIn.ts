"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/utils/supabase/client";
import { validateEmail } from "@/utils/validation";
import { checkEmailProviders } from "@/utils/auth/providerCheck";

interface UseSignInReturn {
  // 상태
  email: string;
  password: string;
  loading: boolean;
  error: string | null;
  canSubmit: boolean; // 버튼 활성화 여부

  // 액션
  setEmail: (email: string) => void;
  setPassword: (password: string) => void;
  signIn: () => Promise<boolean>;
  clearError: () => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
}

/**
 * 로그인 훅
 */
export function useSignIn(): UseSignInReturn {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const signIn = async (): Promise<boolean> => {
    // 유효성 검사
    if (!email || !validateEmail(email)) {
      setError("올바른 이메일을 입력해주세요.");
      return false;
    }

    if (!password || password.length < 8) {
      setError("비밀번호는 8자 이상이어야 합니다.");
      return false;
    }

    setLoading(true);
    setError(null);

    try {
      // Provider 확인: Email 로그인 시도 전에 다른 provider로 가입되어 있는지 확인
      const providerCheck = await checkEmailProviders(email);
      if (!providerCheck.canUseEmail) {
        setError(
          providerCheck.errorMessage ||
            "이미 다른 방법으로 가입된 이메일입니다."
        );
        setLoading(false);
        return false;
      }

      // Provider 확인 통과 후 로그인 진행
      const { data, error: signInError } =
        await supabase.auth.signInWithPassword({
          email,
          password,
        });

      if (signInError) {
        console.log("[useSignIn] Sign in error:", signInError);
        // Supabase 에러 메시지 한글화 및 구체화
        if (signInError.message.includes("Invalid login credentials")) {
          // 계정 존재 여부 확인
          try {
            console.log("[useSignIn] Checking if email exists:", email);
            const checkResponse = await fetch("/api/auth/check-email", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ email }),
            });

            console.log(
              "[useSignIn] Check response status:",
              checkResponse.status
            );

            if (checkResponse.ok) {
              const checkData = await checkResponse.json();
              console.log("[useSignIn] Check data:", checkData);

              // exists가 undefined일 수 있으므로 명시적으로 확인
              if (checkData && checkData.exists === true) {
                // 계정은 존재하지만 비밀번호가 틀린 경우
                const errorMsg = "다시 로그인을 시도하여 주세요.";
                console.log(
                  "[useSignIn] Setting error (password wrong):",
                  errorMsg
                );
                setError(errorMsg);
              } else {
                // 계정이 존재하지 않는 경우
                const errorMsg = "존재하지 않는 계정입니다. 다시 확인해주세요.";
                console.log(
                  "[useSignIn] Setting error (account not found):",
                  errorMsg
                );
                setError(errorMsg);
              }
            } else {
              // API 호출 실패 시 일반적인 메시지
              const errorText = await checkResponse.text().catch(() => "");
              console.error(
                "[useSignIn] Check API failed:",
                checkResponse.status,
                errorText
              );
              setError("이메일 또는 비밀번호가 올바르지 않습니다.");
            }
          } catch (checkErr: any) {
            // API 호출 실패 시 일반적인 메시지
            console.error("[useSignIn] Check API error:", checkErr);
            setError("이메일 또는 비밀번호가 올바르지 않습니다.");
          }
        } else if (signInError.message.includes("Email not confirmed")) {
          setError("이메일 인증이 필요합니다.");
        } else {
          setError(signInError.message);
        }
        return false;
      }

      if (data.session) {
        // 로그인 성공 - 홈으로 이동
        router.push("/home");
        return true;
      }

      setError("로그인에 실패했습니다.");
      return false;
    } catch (err: any) {
      console.error("[useSignIn] Error:", err);
      setError(err.message || "로그인 중 오류가 발생했습니다.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => setError(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await signIn();
  };

  // 버튼 활성화 조건: 이메일과 비밀번호가 모두 입력되어야 함
  const canSubmit = Boolean(
    email.trim() &&
      password.trim() &&
      validateEmail(email) &&
      password.length >= 8 &&
      !loading
  );

  return {
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
  };
}
