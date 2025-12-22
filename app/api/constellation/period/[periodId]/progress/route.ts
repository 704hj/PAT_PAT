import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/app/utils/supabase/server";

export const dynamic = "force-dynamic"; // (선택) 캐시/정적화 간섭 방지

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ periodId: string }> } // ✅ 여기 중요
) {
  const { periodId: periodIdStr } = await params; // ✅ 반드시 await
  const periodId = Number(periodIdStr);

  if (!Number.isFinite(periodId)) {
    return NextResponse.json(
      { ok: false, error: "invalid_period_id" },
      { status: 400 }
    );
  }

  const supabase = await createServerSupabaseClient();

  // 인증
  const { data: auth, error: authErr } = await supabase.auth.getUser();
  if (authErr || !auth?.user) {
    return NextResponse.json(
      { ok: false, error: "unauthorized" },
      { status: 401 }
    );
  }

  // 내부 user_id 조회
  const { data: userRow, error: userErr } = await supabase
    .from("users")
    .select("user_id")
    .eq("auth_user_id", auth.user.id)
    .is("deleted_at", null)
    .single();

  if (userErr || !userRow) {
    return NextResponse.json(
      { ok: false, error: "user_not_found" },
      { status: 404 }
    );
  }

  // entry_count 조회 (없으면 0)
  const { data, error } = await supabase
    .from("user_constellation_period")
    .select("entry_count")
    .eq("user_id", userRow.user_id)
    .eq("period_id", periodId)
    .maybeSingle();

  if (error) {
    return NextResponse.json(
      { ok: false, error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true, entry_count: data?.entry_count ?? 0 });
}
