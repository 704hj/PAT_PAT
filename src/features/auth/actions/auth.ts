"use server";

import { createServerSupabaseClientReadOnly } from "@/utils/supabase/server";

export async function getAuthSessionAction() {
  const supabase = await createServerSupabaseClientReadOnly();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { ok: false as const };
  }

  return {
    ok: true as const,
    user, // auth.users 정보
  };
}
