import { createServerSupabaseClient } from "@/utils/supabase/server"; // 너 프로젝트 경로에 맞게
import { NextResponse } from "next/server";

type Polarity = "POSITIVE" | "NEGATIVE" | "UNSET";

function parseCsv(s: string | null) {
  if (!s) return [];
  return s
    .split(",")
    .map((v) => v.trim())
    .filter(Boolean);
}

export async function GET(req: Request) {
  const supabase = await createServerSupabaseClient();
  const { searchParams } = new URL(req.url);

  // 1) 로그인 체크
  const {
    data: { user: authUser },
    error: authErr,
  } = await supabase.auth.getUser();

  if (authErr || !authUser) {
    return NextResponse.json(
      { ok: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  // 2) public.users에서 user_id 매핑
  const { data: profile, error: profileErr } = await supabase
    .from("users")
    .select("user_id")
    .eq("auth_user_id", authUser.id)
    .maybeSingle();

  if (profileErr || !profile?.user_id) {
    return NextResponse.json(
      { ok: false, message: "User profile not found" },
      { status: 404 }
    );
  }
  const userId = profile.user_id as number;

  // 3) query params
  const url = new URL(req.url);
  const month = url.searchParams.get("month"); // YYYY-MM
  const date = url.searchParams.get("date"); // YYYY-MM-DD
  const q = (url.searchParams.get("q") || "").trim();
  const polarity = url.searchParams.get("polarity") as Polarity | null;
  const tagIds = parseCsv(url.searchParams.get("tag_ids"));
  const limit = Math.min(Number(url.searchParams.get("limit") || 20), 50);
  const cursor = url.searchParams.get("cursor"); // created_at cursor (ISO)

  // 4) diary 기본 쿼리
  //    - tags까지 같이 가져오기: diary_tags(tag:tag_id(tag_id,tag_name))
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

  // month 필터: entry_date로 자르는 게 제일 깔끔
  if (month && /^\d{4}-\d{2}$/.test(month)) {
    const [y, m] = month.split("-").map(Number);
    const start = new Date(Date.UTC(y, m - 1, 1));
    const end = new Date(Date.UTC(y, m, 1)); // 다음달 1일
    query = query.gte("entry_date", start.toISOString().slice(0, 10));
    query = query.lt("entry_date", end.toISOString().slice(0, 10));
  }

  if (date && /^\d{4}-\d{2}-\d{2}$/.test(date)) {
    query = query.eq("entry_date", date);
  }

  if (q) {
    // 단순 검색(원하면 FTS로 업그레이드 가능)
    query = query.ilike("content", `%${q}%`);
  }

  if (polarity && ["POSITIVE", "NEGATIVE", "UNSET"].includes(polarity)) {
    query = query.eq("emotion_polarity", polarity);
  }

  // cursor pagination: created_at 기준 (무한 스크롤)
  if (cursor) {
    query = query.lt("created_at", cursor);
  }

  const { data: diaries, error: diaryErr } = await query;
  if (diaryErr) {
    return NextResponse.json(
      { ok: false, message: diaryErr.message },
      { status: 500 }
    );
  }

  // 5) tagIds 필터(서브쿼리가 제일 좋지만, Supabase query 제한 때문에 2단계로 처리)
  //    - MVP: 서버에서 한번 더 필터링
  let filtered = diaries ?? [];
  if (tagIds.length > 0) {
    filtered = filtered.filter((d: any) => {
      const have = new Set(
        (d.diary_tags ?? []).map((x: any) => x.tag?.tag_id).filter(Boolean)
      );
      // AND 조건(전부 포함). OR 원하면 some으로 변경
      return tagIds.every((id) => have.has(id));
    });
  }

  // 6) 응답 형태 정리
  const items = filtered.map((d: any) => ({
    diary_id: d.diary_id,
    entry_date: d.entry_date,
    content: d.content,
    emotion_polarity: d.emotion_polarity,
    emotion_intensity: d.emotion_intensity,
    created_at: d.created_at,
    updated_at: d.updated_at,
    tags: (d.diary_tags ?? [])
      .map((x: any) => x.tag)
      .filter(Boolean)
      .map((t: any) => ({ tag_id: t.tag_id, tag_name: t.tag_name })),
  }));

  const nextCursor =
    items.length > 0 ? (filtered[filtered.length - 1] as any).created_at : null;

  return NextResponse.json({
    ok: true,
    data: {
      items,
      nextCursor,
    },
  });
}
