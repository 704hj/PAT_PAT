"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/app/utils/supabase/client";
import type { User } from "@supabase/supabase-js";

interface UseAuthOptions {
  redirectTo?: string; // 로그인 안 되어 있을 때 이동할 경로
  required?: boolean; // true면 로그인 필수, false면 선택적
}

interface UseAuthReturn {
  user: User | null;
  loading: boolean;
  session: any | null;
}

/**
 * 인증 상태를 관리하는 공통 훅
 * 
 * @example
 * // 로그인 필수 페이지
 * const { user, loading } = useAuth({ required: true })
 * if (loading) return <div>Loading...</div>
 * 
 * @example
 * // 로그인 선택적 페이지
 * const { user } = useAuth({ required: false })
 */
export function useAuth(options: UseAuthOptions = {}): UseAuthReturn {
  const {
    redirectTo = "/lumi/auth/signin",
    required = true,
  } = options;

  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkAuth() {
      try {
        const { data, error } = await supabase.auth.getSession();

        if (error) {
          console.error("[useAuth] Session check error:", error);
          setLoading(false);
          return;
        }

        // 세션 없음
        if (!data.session) {
          if (required) {
            // 로그인 필수인 경우 → 로그인 페이지로 리다이렉트
            router.replace(redirectTo);
          } else {
            // 로그인 선택적인 경우 → 그냥 로딩 끝
            setLoading(false);
          }
          return;
        }

        // 세션 있음
        setSession(data.session);
        setUser(data.session.user);
        setLoading(false);
      } catch (err) {
        console.error("[useAuth] Unexpected error:", err);
        setLoading(false);
      }
    }

    checkAuth();

    // 세션 변경 감지 (로그아웃 등)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setSession(session);
        setUser(session.user);
      } else {
        setSession(null);
        setUser(null);
        if (required) {
          router.replace(redirectTo);
        }
      }
    });

    // 클린업
    return () => {
      subscription.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [required, redirectTo]);

  return { user, loading, session };
}

