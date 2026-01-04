"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/app/utils/supabase/client";
import { useAuth } from "./useAuth";

interface UserProfile {
  user_id: string;
  nickname?: string;
  profile_image?: string;
  // 필요한 다른 필드 추가
  [key: string]: any;
}

interface UseUserProfileReturn {
  profile: UserProfile | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

/**
 * 현재 로그인한 사용자의 프로필 정보를 가져오는 훅
 * useAuth와 함께 사용하여 인증 + 프로필 정보를 모두 가져옴
 *
 * @example
 * const { user, loading: authLoading } = useAuth()
 * const { profile, loading: profileLoading } = useUserProfile()
 *
 * if (authLoading || profileLoading) return <Loading />
 * return <div>{profile?.nickname}</div>
 */
export function useUserProfile(): UseUserProfileReturn {
  const { user, loading: authLoading } = useAuth({ required: true });
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchProfile = async () => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      console.log(
        "[useUserProfile] Fetching profile for auth_user_id:",
        user.id
      );

      // 1. users 테이블에서 user_id 가져오기
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("user_id, auth_user_id, email")
        .eq("auth_user_id", user.id)
        .single();

      if (userError || !userData) {
        console.error("[useUserProfile] User not found:", userError);
        setError(new Error(`사용자 조회 실패: ${userError?.message || "User not found"}`));
        // 에러가 발생해도 기본 프로필 설정 (UI가 깨지지 않도록)
        setProfile({
          user_id: "",
          nickname: user?.user_metadata?.nickname || "사용자",
        });
        setLoading(false);
        return;
      }

      // 2. user_profile 테이블에서 프로필 정보 가져오기
      let profileData = null;
      const { data: profileDataResult, error: profileError } = await supabase
        .from("user_profile")
        .select("nickname, created_at, updated_at")
        .eq("user_id", userData.user_id)
        .single();

      // 프로필이 없어도 에러로 처리하지 않음 (신규 사용자일 수 있음)
      if (profileError) {
        // PGRST116은 "no rows returned" 에러 (프로필이 없는 경우)
        // PGRST205는 "table not found" 에러 (테이블이 없는 경우)
        if (profileError.code === "PGRST116") {
          // 프로필이 없는 경우 - 정상
          console.log("[useUserProfile] Profile not found (new user)");
        } else if (profileError.code === "PGRST205") {
          // 테이블이 없는 경우 - 배포 환경 스키마 문제
          console.warn("[useUserProfile] user_profile table not found:", profileError);
        } else {
          console.warn("[useUserProfile] Profile fetch error:", profileError);
        }
      } else {
        profileData = profileDataResult;
      }

      console.log("[useUserProfile] Users data:", userData);
      console.log("[useUserProfile] Profile data:", profileData);

      // 프로필 데이터에 user_id 포함 (프로필이 없어도 기본값 사용)
      const profile = {
        ...profileData,
        user_id: userData.user_id,
        nickname: profileData?.nickname || user?.user_metadata?.nickname || "사용자",
      };

      console.log("[useUserProfile] Profile loaded:", profile);
      setProfile(profile);
    } catch (err) {
      console.error("[useUserProfile] 예상치 못한 에러:", err);
      const errorMessage = err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다.";
      setError(new Error(errorMessage));
      // 에러가 발생해도 기본 프로필 설정
      setProfile({
        user_id: "",
        nickname: user?.user_metadata?.nickname || "사용자",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authLoading) return;
    fetchProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id, authLoading]);

  return {
    profile,
    loading: authLoading || loading,
    error,
    refetch: fetchProfile,
  };
}
