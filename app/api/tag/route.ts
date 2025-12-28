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

    const { data, error } = await supabase.from("tag").select("*");

    if (error) throw mapSupabaseError(error);
    if (!data?.length) throw Errors.notFound("No tag found");
    const filtered = data.map(({ id, ...rest }) => rest);

    return jsonOk(filtered, { count: data.length }, requestId);
  } catch (err) {
    return jsonError(err as Error, requestId);
  }
}
