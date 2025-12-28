"use server";
import { makeRequestId } from "@/app/api/_lib";
import { createServerSupabaseClientReadOnly } from "@/app/utils/supabase/server";

type CreateDiaryInput = {
  entry_date: string;
  polarity: "POSITIVE" | "NEGATIVE" | "UNSET";
  content: string;
  intensity: number;
  tag_ids?: string[]; // uuid[]
};

export async function createDiaryAction(input: CreateDiaryInput) {
  const supabase = await createServerSupabaseClientReadOnly();
  const requestId = makeRequestId();

  const { data: auth } = await supabase.auth.getUser();
  if (!auth?.user)
    return { ok: false as const, error: "unauthorized" as const };

  try {
    const { data, error } = await supabase.rpc("create_diary_entry", {
      p_auth_user_id: auth.user.id,
      p_entry_date: input.entry_date,
      p_polarity: input.polarity,
      p_content: input.content,
      p_emotion_intensity: input.intensity,
      p_tag_ids: input.tag_ids ?? [],
    });

    if (error) return { ok: false as const, error: error.message };
    return { ok: true as const, data };
  } catch (err) {
    return {
      ok: false,
      code: "INTERNAL_ERROR",
      message: (err as Error).message,
      requestId,
    };
  }
}
