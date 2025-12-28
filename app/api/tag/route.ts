import {
  jsonError,
  jsonOk,
  makeRequestId,
  mapSupabaseError,
} from "@/app/api/_lib";
import { createServerSupabaseClientReadOnly } from "@/app/utils/supabase/server";

export async function GET() {
  const requestId = makeRequestId();
  try {
    const supabase = await createServerSupabaseClientReadOnly();

    const { data, error } = await supabase
      .from("tag")
      .select("tag_id, tag_name, tag_type, order_no, is_active")
      .eq("is_active", true)
      .order("order_no", { ascending: true, nullsFirst: false })
      .order("tag_name", { ascending: true });

    if (error) throw mapSupabaseError(error);

    return jsonOk(data, { count: data.length }, requestId);
  } catch (err) {
    return jsonError(err as Error, requestId);
  }
}
