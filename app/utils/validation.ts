/**
 * 비밀번호 검증: 영 소문자(필수) + 숫자(필수) + 기호(선택)
 * 8자 이상
 */
export function validatePassword(pwd: string): { valid: boolean; message: string } {
  if (pwd.length < 8) {
    return { valid: false, message: "비밀번호는 8자 이상이어야 합니다." };
  }

  const hasLowercase = /[a-z]/.test(pwd);
  const hasNumber = /\d/.test(pwd);
  // 허용 문자: 영 소문자, 숫자, 기호(!@#$%^&*()_+-=[]{}|;':\",./<>?)
  const hasOnlyValidChars = /^[a-z0-9!@#$%^&*()_+\-=\[\]{}|;':",./<>?]+$/.test(pwd);

  if (!hasLowercase) {
    return { valid: false, message: "영문 소문자를 포함해야 합니다." };
  }
  if (!hasNumber) {
    return { valid: false, message: "숫자를 포함해야 합니다." };
  }
  if (!hasOnlyValidChars) {
    return { valid: false, message: "영문 소문자, 숫자, 기호만 사용할 수 있습니다." };
  }

  return { valid: true, message: "" };
}

/**
 * 이메일 형식 검증
 */
export function validateEmail(email: string): boolean {
  return /\S+@\S+\.\S+/.test(email);
}

