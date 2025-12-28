"use client";

import { useRouter } from "next/navigation";

interface UseSignUpPageReturn {
  handleEmailSignup: () => void;
  handleGoToSignIn: () => void;
}

export function useSignUpPage(): UseSignUpPageReturn {
  const router = useRouter();

  const handleEmailSignup = () => {
    router.push("/lumi/auth/email");
  };

  const handleGoToSignIn = () => {
    router.push("/lumi/auth/signin");
  };

  return {
    handleEmailSignup,
    handleGoToSignIn,
  };
}

