"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/app/utils/supabase/client";
import { useAuth } from "./useAuth";

interface UserProfile {
  user_id: number; // users.user_id bigint
  auth_user_id: string; // users.auth_user_id uuid
  email: string | null;
  nickname: string | null;
  profile_image: string | null;
  signup_method: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;

  // 필요하면 추가 필드
  [key: string]: any;
}

interface UseUserProfileReturn {
  profile: UserProfile | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export function useUserProfile(): UseUserProfileReturn {
  const { user, loading: authLoading } = useAuth({ required: true });
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchProfile = async () => {
    if (!user?.id) {
      setProfile(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      console.log(
        "[useUserProfile] Fetching users row for auth_user_id:",
        user.id
      );

      const { data, error: fetchError } = await supabase
        .from("users")
        .select(
          `
          user_id,
          auth_user_id,
          email,
          nickname,
          signup_method,
          created_at,
          updated_at,
          deleted_at
        `
        )
        .eq("auth_user_id", user.id)
        .is("deleted_at", null) // soft delete 쓸 거면 유지, 아니면 제거 가능
        .single();

      if (fetchError) {
        console.error("[useUserProfile] Fetch error:", fetchError);
        throw new Error(fetchError.message);
      }

      if (!data) {
        throw new Error("User not found");
      }

      console.log("[useUserProfile] Loaded users profile:", data);
      setProfile(data as UserProfile);
    } catch (err) {
      console.error("[useUserProfile] Error:", err);
      setError(err instanceof Error ? err : new Error("Unknown error"));
      setProfile(null);
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
