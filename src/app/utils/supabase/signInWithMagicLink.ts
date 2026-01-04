"use server";

import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/app/utils/supabase/server";

export async function signInWithEmail(
  formData: FormData,
  nextPath: string = "/home"
) {
  const supabase = await createServerSupabaseClient();

  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");

  if (!email || !password)
    return { ok: false, message: "이메일/비밀번호를 입력해주세요." };

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { ok: false, message: error.message };
  }

  redirect(nextPath);
}
