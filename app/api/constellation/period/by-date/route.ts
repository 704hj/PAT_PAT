import { createServerSupabaseClientReadOnly } from "@/app/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const date = searchParams.get("date"); // YYYY-MM-DD

  if (!date) {
    return NextResponse.json(
      { ok: false, error: "missing_date" },
      { status: 400 }
    );
  }

  const supabase = await createServerSupabaseClientReadOnly();

  const { data, error } = await supabase
    .from("constellation_period")
    .select("period_id, constellation_id, start_date, end_date")
    .lte("start_date", date)
    .gte("end_date", date)
    .single();

  if (error || !data) {
    return NextResponse.json(
      { ok: false, error: "period_not_found" },
      { status: 404 }
    );
  }

  return NextResponse.json({ ok: true, data });
}
