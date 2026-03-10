import { Errors, jsonError, jsonOk, makeRequestId, mapSupabaseError } from '@/lib';
import { createServerSupabaseClientReadOnly } from '@/utils/supabase/server';
import { NextRequest } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ periodId: string }> },
) {
  const requestId = makeRequestId();
  try {
    const { periodId: periodIdStr } = await params;
    const periodId = Number(periodIdStr);

    if (!Number.isFinite(periodId)) throw Errors.invalid('유효하지 않은 periodId');

    const supabase = await createServerSupabaseClientReadOnly();

    const { data, error } = await supabase
      .from('constellation_period_day_point')
      .select('day_index, x, y')
      .eq('period_id', periodId)
      .order('day_index', { ascending: true });

    if (error) throw mapSupabaseError(error);

    return jsonOk(data ?? [], { count: data?.length ?? 0 }, requestId);
  } catch (err) {
    return jsonError(err as Error, requestId);
  }
}
