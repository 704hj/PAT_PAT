/**
 * 이메일의 provider 확인 및 검증 유틸리티
 */

export type Provider = "google" | "kakao" | "password";

interface CheckProvidersResult {
  providers: Provider[];
  hasGoogle: boolean;
  hasKakao: boolean;
  hasPassword: boolean;
  canUseEmail: boolean; // Email 로그인/가입 가능 여부
  errorMessage: string | null; // 차단 시 안내 메시지
}

/**
 * 이메일의 provider 목록을 확인하고, Email 로그인/가입 가능 여부를 판단
 */
export async function checkEmailProviders(email: string): Promise<CheckProvidersResult> {
  try {
    const response = await fetch("/api/auth/check-providers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      // API 실패 시 안전하게 처리 (가입 이력이 없는 것으로 간주)
      return {
        providers: [],
        hasGoogle: false,
        hasKakao: false,
        hasPassword: false,
        canUseEmail: true,
        errorMessage: null,
      };
    }

    const data = await response.json();
    const providers = (data.providers || []) as Provider[];

    const hasGoogle = providers.includes("google");
    const hasKakao = providers.includes("kakao");
    const hasPassword = providers.includes("password");

    // Google 또는 Kakao로 가입되어 있으면 Email 사용 불가
    if (hasGoogle) {
      return {
        providers,
        hasGoogle: true,
        hasKakao: false,
        hasPassword: false,
        canUseEmail: false,
        errorMessage: "이미 Google로 가입된 이메일입니다. Google로 로그인해 주세요.",
      };
    }

    if (hasKakao) {
      return {
        providers,
        hasGoogle: false,
        hasKakao: true,
        hasPassword: false,
        canUseEmail: false,
        errorMessage: "이미 Kakao로 가입된 이메일입니다. Kakao로 로그인해 주세요.",
      };
    }

    // Password provider만 있거나 가입 이력이 없으면 Email 사용 가능
    return {
      providers,
      hasGoogle: false,
      hasKakao: false,
      hasPassword,
      canUseEmail: true,
      errorMessage: null,
    };
  } catch (error) {
    console.error("[checkEmailProviders] Error:", error);
    // 에러 발생 시 안전하게 처리 (가입 이력이 없는 것으로 간주)
    return {
      providers: [],
      hasGoogle: false,
      hasKakao: false,
      hasPassword: false,
      canUseEmail: true,
      errorMessage: null,
    };
  }
}

