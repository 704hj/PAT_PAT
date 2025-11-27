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

      const { data, error: fetchError } = await supabase
        .from("user_profile")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (fetchError) {
        throw new Error(fetchError.message);
      }

      setProfile(data);
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

