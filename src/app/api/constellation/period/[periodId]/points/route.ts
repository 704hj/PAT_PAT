import { createServerSupabaseClientReadOnly } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ periodId: string }> }
) {
  const { periodId: periodIdStr } = await params;

  const periodId = Number(periodIdStr);
  if (!Number.isFinite(periodId)) {
    return NextResponse.json(
      { ok: false, error: "invalid_period_id" },
      { status: 400 }
    );
  }

  const supabase = await createServerSupabaseClientReadOnly();

  const { data, error } = await supabase
    .from("constellation_period_day_point")
    .select("day_index, x, y")
    .eq("period_id", periodId)
    .order("day_index", { ascending: true });

  if (error) {
    return NextResponse.json(
      { ok: false, error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true, data });
}
