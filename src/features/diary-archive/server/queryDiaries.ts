import "server-only";

import { createServerSupabaseClient } from "@/utils/supabase/server";

export type Polarity = "POSITIVE" | "NEGATIVE" | "UNSET";

export type QueryDiariesParams = {
  /** YYYY-MM */
  month?: string | null;
  /** YYYY-MM-DD */
  date?: string | null;
  /** 검색어 */
  q?: string | null;
  polarity?: Polarity | null;
  /** ["1","2"] 형태 (string 권장: querystring에서 그대로 받기 쉬움) */
  tagIds?: string[];
  /** 1~50 */
  limit?: number;
  /** created_at ISO cursor */
  cursor?: string | null;
};

export type DiaryTag = { tag_id: string; tag_name: string };

export type DiaryListItem = {
  diary_id: string | number;
  entry_date: string;
  content: string;
  emotion_polarity: Polarity;
  emotion_intensity: number | null;
  created_at: string;
  updated_at: string | null;
  tags: DiaryTag[];
};

export type QueryDiariesResult = {
  items: DiaryListItem[];
  nextCursor: string | null;
};

function isYYYYMM(v: string) {
  return /^\d{4}-\d{2}$/.test(v);
}

function isYYYYMMDD(v: string) {
  return /^\d{4}-\d{2}-\d{2}$/.test(v);
}

function clampLimit(v: unknown, fallback = 20) {
  const n = Number(v ?? fallback);
  if (Number.isNaN(n)) return fallback;
  return Math.min(Math.max(n, 1), 50);
}

/**
 * diaries 조회 공통 함수 (Server-only)
 * - 인증(로그인) + user_id 매핑
 * - month/date/q/polarity/cursor/limit 필터
 * - tags 조인 포함
 * - tagIds는 Supabase 쿼리 제한 때문에 서버에서 2단계 필터링(MVP)
 */

export async function queryDiaries(
  params: QueryDiariesParams
): Promise<QueryDiariesResult> {
  const supabase = await createServerSupabaseClient();

  // 1) 로그인 체크
  const {
    data: { user: authUser },
    error: authErr,
  } = await supabase.auth.getUser();

  if (authErr || !authUser) {
    // route.ts / action 쪽에서 공통 처리할 수 있게 Error throw
    throw new Error("Unauthorized");
  }

  // 2) public.users에서 user_id 매핑
  const { data: profile, error: profileErr } = await supabase
    .from("users")
    .select("user_id")
    .eq("auth_user_id", authUser.id)
    .maybeSingle();

  if (profileErr || !profile?.user_id) {
    throw new Error("User profile not found");
  }

  const userId = profile.user_id as number;

  const month = params.month ?? null;
  const date = params.date ?? null;
  const q = (params.q ?? "").trim();
  const polarity = params.polarity ?? null;
  const tagIds = params.tagIds ?? [];
  const limit = clampLimit(params.limit, 20);
  const cursor = params.cursor ?? null;

  // 3) diary 기본 쿼리 (tags join 포함)
  let query = supabase
    .from("diary")
    .select(
      `
        diary_id,
        entry_date,
        content,
        emotion_polarity,
        emotion_intensity,
        created_at,
        updated_at,
        diary_tags:diary_tags (
          tag:tag_id (
            tag_id,
            tag_name
          )
        )
      `
    )
    .eq("user_id", userId)
    .is("deleted_at", null)
    .order("entry_date", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(limit);

  // month 필터 (entry_date 기준)
  if (month && isYYYYMM(month)) {
    const [y, m] = month.split("-").map(Number);
    const start = new Date(Date.UTC(y, m - 1, 1));
    const end = new Date(Date.UTC(y, m, 1)); // 다음 달 1일

    query = query
      .gte("entry_date", start.toISOString().slice(0, 10))
      .lt("entry_date", end.toISOString().slice(0, 10));
  }

  // date 필터
  if (date && isYYYYMMDD(date)) {
    query = query.eq("entry_date", date);
  }

  // content 검색
  if (q) {
    query = query.ilike("content", `%${q}%`);
  }

  // polarity 필터
  if (polarity && ["POSITIVE", "NEGATIVE", "UNSET"].includes(polarity)) {
    query = query.eq("emotion_polarity", polarity);
  }

  // cursor pagination: created_at 기준
  if (cursor) {
    query = query.lt("created_at", cursor);
  }

  const { data: diaries, error: diaryErr } = await query;
  if (diaryErr) {
    throw new Error(diaryErr.message);
  }

  // 4) tagIds 필터 (MVP: 서버에서 후처리)
  let filtered: any[] = diaries ?? [];
  if (tagIds.length > 0) {
    const tagSet = new Set(tagIds.map(String));
    filtered = filtered.filter((d: any) => {
      const have = new Set(
        (d.diary_tags ?? [])
          .map((x: any) => String(x?.tag?.tag_id))
          .filter(Boolean)
      );
      // AND 조건(모든 tag 포함). OR 조건이면 some으로 변경
      for (const id of tagSet) {
        if (!have.has(id)) return false;
      }
      return true;
    });
  }

  // 5) 응답 형태 정리
  const items: DiaryListItem[] = filtered.map((d: any) => ({
    diary_id: d.diary_id,
    entry_date: d.entry_date,
    content: d.content,
    emotion_polarity: d.emotion_polarity,
    emotion_intensity: d.emotion_intensity,
    created_at: d.created_at,
    updated_at: d.updated_at,
    tags: (d.diary_tags ?? [])
      .map((x: any) => x?.tag)
      .filter(Boolean)
      .map((t: any) => ({
        tag_id: String(t.tag_id),
        tag_name: String(t.tag_name),
      })),
  }));

  const nextCursor =
    items.length > 0
      ? String((filtered[filtered.length - 1] as any).created_at)
      : null;

  return { items, nextCursor };
}
