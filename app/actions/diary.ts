"use server";

import { createServerSupabaseClient } from "@/app/utils/supabase/server";

type CreateDiaryInput = {
  entry_date: string;
  polarity: "POSITIVE" | "NEGATIVE" | "UNSET";
  content: string;
  tag_ids?: string[];
  diary_id?: number; // 수정 모드일 때 기존 diary_id
};

export async function createDiaryAction(input: CreateDiaryInput) {
  const supabase = await createServerSupabaseClient();

  const { data: auth } = await supabase.auth.getUser();
  if (!auth?.user)
    return { ok: false as const, error: "unauthorized" as const };

  try {
    // 1. auth_user_id로 user_id 가져오기
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("user_id")
      .eq("auth_user_id", auth.user.id)
      .single();

    if (userError || !userData) {
      return { ok: false as const, error: "User not found" };
    }

    // 2. polarity를 diary_type으로 변환
    const diaryType =
      input.polarity === "NEGATIVE" ? "worry" : "star";

    let diaryId: number;

    // 3. 수정 모드인지 확인 (diary_id가 있으면 UPDATE)
    if (input.diary_id) {
      // 기존 일기 업데이트
      const { data: diaryData, error: diaryError } = await supabase
        .from("diary")
        .update({
          diary_type: diaryType,
          content: input.content,
          updated_at: new Date().toISOString(),
        })
        .eq("diary_id", input.diary_id)
        .eq("user_id", userData.user_id) // 본인 것만 수정 가능
        .select("diary_id")
        .single();

      if (diaryError || !diaryData) {
        return { ok: false as const, error: diaryError?.message || "Failed to update diary" };
      }

      diaryId = diaryData.diary_id;

      // 기존 태그 삭제 후 새로 추가
      await supabase
        .from("diary_tag")
        .delete()
        .eq("diary_id", diaryId);
    } else {
      // 새 일기 생성
      const { data: diaryData, error: diaryError } = await supabase
        .from("diary")
        .insert({
          user_id: userData.user_id,
          diary_type: diaryType,
          content: input.content,
          visibility: "private",
        })
        .select("diary_id")
        .single();

      if (diaryError || !diaryData) {
        return { ok: false as const, error: diaryError?.message || "Failed to create diary" };
      }

      diaryId = diaryData.diary_id;
    }

    // 4. tag_ids가 있으면 diary_tag 테이블에 INSERT
    if (input.tag_ids && input.tag_ids.length > 0) {
      const diaryTags = input.tag_ids.map((tagId) => ({
        diary_id: diaryId,
        tag_id: parseInt(tagId, 10), // tag_id는 integer
      }));

      const { error: tagError } = await supabase
        .from("diary_tag")
        .insert(diaryTags);

      if (tagError) {
        console.error("Failed to insert tags:", tagError);
        // 태그 삽입 실패해도 일기는 생성된 것으로 처리
      }
    }

    return { ok: true as const, data: { diary_id: diaryId } };
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    return { ok: false as const, error: errorMessage };
  }
}
