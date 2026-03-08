import { createServerSupabaseClientReadOnly } from "@/utils/supabase/server";

export async function GET() {
  try {
    const supabase = await createServerSupabaseClientReadOnly();

    const { data, error } = await supabase
      .from("constellation_master")
      .select(
        "constellation_id, code, name_ko, start_mmdd_tx, end_mmdd_tx, primary_month, points, edges, path_index, created_at"
      )
      .order("constellation_id");

    if (error) return Response.json([], { status: 500 });
    if (!data?.length) return Response.json([]);

    const mapped = data.map((item) => ({
      constellation_id: item.constellation_id,
      code: item.code,
      star_code: item.code,
      zodiac_code: item.code,
      name_ko: item.name_ko,
      start_mmdd_tx: item.start_mmdd_tx,
      start_day: item.start_mmdd_tx,
      start_mmdd: item.start_mmdd_tx,
      end_mmdd_tx: item.end_mmdd_tx,
      end_day: item.end_mmdd_tx,
      end_mmdd: item.end_mmdd_tx,
      primary_month: item.primary_month,
      points: item.points,
      edges: item.edges,
      path_index: item.path_index,
      created_at: item.created_at,
    }));

    return Response.json(mapped);
  } catch (err) {
    return Response.json([], { status: 500 });
  }
}
