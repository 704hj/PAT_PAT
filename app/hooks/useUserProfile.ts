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

      // JOIN을 사용해서 한 번에 조회
      const { data, error: fetchError } = await supabase
        .from("users")
        .select(
          `
          user_id,
          auth_user_id,
          email,
          user_profile (
            nickname,
            created_at,
            updated_at
          )
        `
        )
        .eq("auth_user_id", user.id)
        .single();

      if (fetchError) {
        console.error("[useUserProfile] Fetch error:", fetchError);
        throw new Error(fetchError.message);
      }

      if (!data) {
        console.error("[useUserProfile] User not found");
        throw new Error("User not found");
      }

      console.log("[useUserProfile] Users data:", data);

      // user_profile이 배열로 올 수 있으므로 처리
      const profileData = Array.isArray(data.user_profile)
        ? data.user_profile[0]
        : data.user_profile;

      if (!profileData) {
        console.error(
          "[useUserProfile] Profile not found for user_id:",
          data.user_id
        );
        throw new Error("Profile not found");
      }

      // 프로필 데이터에 user_id 포함
      const profile = {
        user_id: data.user_id,
        ...profileData,
      };

      console.log("[useUserProfile] Profile loaded:", profile);
      setProfile(profile);
    } catch (err) {
      console.error("[useUserProfile] Error:", err);
      setError(err instanceof Error ? err : new Error("Unknown error"));
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
