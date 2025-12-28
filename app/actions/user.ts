import { createServerSupabaseClientReadOnly } from "../utils/supabase/server";

export async function getUserProfileAction() {
  const supabase = await createServerSupabaseClientReadOnly();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false as const };

  const { data } = await supabase
    .from("users")
    .select(
      "user_id, auth_user_id, email, nickname, signup_method, created_at, updated_at, deleted_at"
    )
    .eq("auth_user_id", user.id)
    .single();

  return { ok: true as const, data };
}
