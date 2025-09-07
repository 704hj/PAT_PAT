import {
  Errors,
  jsonError,
  jsonOk,
  makeRequestId,
  mapSupabaseError,
} from "@/app/api/_lib";
import { supabase } from "@/app/lib/supabase/client";

export async function GET() {
  const requestId = makeRequestId();
  try {
    const { data, error } = await supabase.from("constellation").select("*");

    if (error) throw mapSupabaseError(error);
    if (!data?.length) throw Errors.notFound("No constellation found");

    return jsonOk(data, { count: data.length }, requestId);
  } catch (err) {
    return jsonError(err as Error, requestId);
  }
}
