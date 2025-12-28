import {
  Errors,
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

    const { data, error } = await supabase.from("constellation").select("*");

    if (error) throw mapSupabaseError(error);
    if (!data?.length) throw Errors.notFound("No constellation found");

    return jsonOk(data, { count: data.length }, requestId);
  } catch (err) {
    return jsonError(err as Error, requestId);
  }
}
