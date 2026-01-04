"use client";

import { useRouter } from "next/navigation";

interface UseSignUpPageReturn {
  handleEmailSignup: () => void;
  handleGoToSignIn: () => void;
}

export function useSignUpPage(): UseSignUpPageReturn {
  const router = useRouter();

  const handleEmailSignup = () => {
    router.push("/auth/email");
  };

  const handleGoToSignIn = () => {
    router.push("/auth/signin");
  };

  return {
    handleEmailSignup,
    handleGoToSignIn,
  };
}
