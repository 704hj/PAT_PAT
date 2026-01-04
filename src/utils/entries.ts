"use client";

import { supabase } from "@/utils/supabase/client";
import { toDateString } from "@/lib/zodiac";

export type Entry = {
  date: string; // "YYYY-MM-DD"
  content: string;
  createdAt?: string;
  updatedAt?: string;
  diary_id?: number;
  diary_type?: "star" | "worry"; // 추가: diary_type
  tag_ids?: number[]; // 추가: 태그 ID 배열
};

/**
 * 날짜 범위의 글들을 로드
 */
export async function loadEntriesByRange(
  start: Date,
  end: Date
): Promise<Record<string, Entry>> {
  try {
    const { data: auth } = await supabase.auth.getUser();
    if (!auth?.user) {
      console.error("User not authenticated");
      return {};
    }

    // users 테이블에서 user_id 가져오기
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("user_id")
      .eq("auth_user_id", auth.user.id)
      .single();

    if (userError || !userData) {
      console.error("User not found:", userError);
      return {};
    }

    const startStr = toDateString(start);
    const endStr = toDateString(end);

    // diary 테이블에서 날짜 범위로 조회
    const { data: diaries, error } = await supabase
      .from("diary")
      .select("diary_id, content, created_at, updated_at")
      .eq("user_id", userData.user_id)
      .gte("created_at", startStr)
      .lte("created_at", endStr)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Failed to load entries:", error);
      return {};
    }

    // Record<dateString, Entry> 형태로 변환
    const result: Record<string, Entry> = {};
    diaries?.forEach((diary) => {
      const date = new Date(diary.created_at);
      const dateStr = toDateString(date);
      result[dateStr] = {
        date: dateStr,
        content: diary.content || "",
        createdAt: diary.created_at,
        updatedAt: diary.updated_at,
        diary_id: diary.diary_id,
      };
    });

    return result;
  } catch (error) {
    console.error("Error loading entries:", error);
    return {};
  }
}

/**
 * 특정 날짜의 글 가져오기
 */
export async function getEntryByDate(
  dateString: string
): Promise<Entry | null> {
  try {
    const { data: auth } = await supabase.auth.getUser();
    if (!auth?.user) {
      return null;
    }

    // users 테이블에서 user_id 가져오기
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("user_id")
      .eq("auth_user_id", auth.user.id)
      .single();

    if (userError || !userData) {
      return null;
    }

    // 해당 날짜의 일기 조회 (날짜 범위로)
    const startDate = new Date(dateString);
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(dateString);
    endDate.setHours(23, 59, 59, 999);

    // diary_type 컬럼이 없는 경우 대비
    type DiaryRow = {
      diary_id: number;
      content: string | null;
      created_at: string;
      updated_at: string | null;
      diary_type?: string;
    };

    let selectFields = "diary_id, content, created_at, updated_at, diary_type";
    let { data: diariesData, error } = await supabase
      .from("diary")
      .select(selectFields)
      .eq("user_id", userData.user_id)
      .gte("created_at", startDate.toISOString())
      .lte("created_at", endDate.toISOString())
      .order("created_at", { ascending: false })
      .limit(1);

    let diaries: DiaryRow[] | null = diariesData as unknown as
      | DiaryRow[]
      | null;

    // diary_type 컬럼이 없는 경우 fallback
    if (
      error &&
      (error.code === "42703" || error.message.includes("does not exist"))
    ) {
      console.warn(
        "[getEntryByDate] diary_type column not found, using fallback"
      );
      const { data: diariesFallback, error: errorFallback } = await supabase
        .from("diary")
        .select("diary_id, content, created_at, updated_at")
        .eq("user_id", userData.user_id)
        .gte("created_at", startDate.toISOString())
        .lte("created_at", endDate.toISOString())
        .order("created_at", { ascending: false })
        .limit(1);

      if (!errorFallback && diariesFallback) {
        // diary_type이 없는 경우 기본값 추가
        diaries = (diariesFallback as unknown as DiaryRow[]).map((d) => ({
          ...d,
          diary_type: "star", // 기본값
        }));
        error = null;
      }
    }

    if (error || !diaries || diaries.length === 0) {
      return null;
    }

    const diary = diaries[0];

    // 태그 가져오기
    const { data: diaryTags } = await supabase
      .from("diary_tag")
      .select("tag_id")
      .eq("diary_id", diary.diary_id);

    const tagIds = diaryTags?.map((dt) => dt.tag_id) || [];

    return {
      date: dateString,
      content: diary.content || "",
      createdAt: diary.created_at,
      updatedAt: diary.updated_at || undefined, // null을 undefined로 변환
      diary_id: diary.diary_id,
      diary_type: (diary.diary_type || "star") as "star" | "worry" | undefined, // 기본값
      tag_ids: tagIds,
    };
  } catch (error) {
    console.error("Error getting entry:", error);
    return null;
  }
}
