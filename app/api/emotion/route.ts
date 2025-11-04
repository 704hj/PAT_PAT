import {
  Errors,
  jsonError,
  jsonOk,
  makeRequestId,
  mapSupabaseError,
} from "@/app/api/_lib";
import { createServerSupabaseClient } from "@/app/utils/supabase/server";

export async function GET() {
  const requestId = makeRequestId();
  try {
    const supabase = await createServerSupabaseClient();

    const { data, error } = await supabase.from("emotion").select("*");

    if (error) throw mapSupabaseError(error);
    if (!data?.length) throw Errors.notFound("No emotion found");
    const filtered = data.map(({ emotion_id, ...rest }) => rest);

    return jsonOk(filtered, { count: data.length }, requestId);
  } catch (err) {
    return jsonError(err as Error, requestId);
  }
}
