import {
  Errors,
  jsonError,
  jsonOk,
  makeRequestId,
  mapSupabaseError,
} from "@/lib";
import { createServerSupabaseClientReadOnly } from "@/utils/supabase/server";

export async function GET() {
  const requestId = makeRequestId();
  try {
    const supabase = await createServerSupabaseClientReadOnly();

    const { data, error } = await supabase
      .from("constellation_master")
      .select("constellation_id, code, name_ko, start_mmdd_tx, end_mmdd_tx, primary_month, points, edges, path_index")
      .order("constellation_id");

    if (error) throw mapSupabaseError(error);
    if (!data?.length) throw Errors.notFound("No constellation found");

    return jsonOk(data, { count: data.length }, requestId);
  } catch (err) {
    return jsonError(err as Error, requestId);
  }
}
