"use server";

import { createServerSupabaseClientReadOnly } from "@/app/utils/supabase/server";
export type HomeProfile = Pick<
  UserProfile,
  "user_id" | "auth_user_id" | "email" | "nickname"
>;
export type HomeSummaryResult =
  | {
      ok: true;
      data: {
        profile: HomeProfile;
        starCount: number;
        diaryCount: number;
      };
    }
  | {
      ok: false;
      reason: "UNAUTHORIZED" | "PROFILE_NOT_FOUND";
    };

export async function getHomeAction(): Promise<HomeSummaryResult> {
  const supabase = await createServerSupabaseClientReadOnly();

  // 1) 세션 확인
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { ok: false, reason: "UNAUTHORIZED" };
  }

  // 2) profile 조회 (필수)
  const { data: profile, error: profileError } = await supabase
    .from("users")
    .select("user_id, auth_user_id, email, nickname")
    .eq("auth_user_id", user.id)
    .is("deleted_at", null)
    .single();

  if (profileError || !profile) {
    return { ok: false, reason: "PROFILE_NOT_FOUND" };
  }

  // 3) profile.user_id 기반 star count
  const { count: starCount } = await supabase
    .from("star")
    .select("star_id", { count: "exact", head: true })
    .eq("user_id", profile.user_id);

  // 4) profile.user_id 기반  이번주 diary 개수
  const { count: diaryCount } = await supabase
    .from("diary")
    .select("diary_id", { count: "exact", head: true })
    .eq("user_id", profile.user_id)
    .gte(
      "created_at",
      new Date(
        new Date().setDate(
          new Date().getDate() - ((new Date().getDay() + 6) % 7)
        )
      ).toISOString()
    );

  return {
    ok: true,
    data: {
      profile,
      starCount: starCount ?? 0,
      diaryCount: diaryCount ?? 0,
    },
  };
}
