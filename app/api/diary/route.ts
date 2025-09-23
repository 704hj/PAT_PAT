// app/api/diary/route.ts
import {
  jsonError,
  jsonOk,
  makeRequestId,
  mapSupabaseError,
} from "@/app/api/_lib";
import { createServerSupabaseClient } from "@/app/utils/supabase/server";

export async function GET(req: Request) {
  const requestId = makeRequestId();
  const url = new URL(req.url);
  const page = Math.max(1, parseInt(url.searchParams.get("page") || "1", 10));
  const limit = Math.min(
    50,
    Math.max(1, parseInt(url.searchParams.get("limit") || "10", 10))
  );
  const type = url.searchParams.get("type"); // 'star' | 'worry' | null
  const from = url.searchParams.get("from"); // 'YYYY-MM-DD' | null
  const to = url.searchParams.get("to"); // 'YYYY-MM-DD' | null

  try {
    const supabase = await createServerSupabaseClient();

    let qb = supabase
      .from("diary")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false });

    if (type === "star" || type === "worry") qb = qb.eq("diary_type", type);
    // if (from) qb = qb.gte("created_at", dayjs(from).startOf("day").toISOString());
    // if (to) qb = qb.lte("created_at", dayjs(to).endOf("day").toISOString());

    const fromIdx = (page - 1) * limit;
    const toIdx = fromIdx + limit - 1;
    qb = qb.range(fromIdx, toIdx);

    const { data, error, count } = await qb;

    if (error) throw mapSupabaseError(error);

    return jsonOk(data ?? [], { page, limit, total: count ?? 0 }, requestId);
  } catch (err) {
    return jsonError(err as Error, requestId);
  }
}
