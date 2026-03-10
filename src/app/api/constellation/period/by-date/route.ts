import { Errors, jsonError, jsonOk, makeRequestId, mapSupabaseError } from '@/lib';
import { createServerSupabaseClientReadOnly } from '@/utils/supabase/server';
import { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  const requestId = makeRequestId();
  try {
    const date = req.nextUrl.searchParams.get('date');

    if (!date) throw Errors.invalid('date 파라미터가 필요합니다');

    const supabase = await createServerSupabaseClientReadOnly();

    const { data, error } = await supabase
      .from('constellation_period')
      .select(
        'period_id, constellation_id, start_date, end_date, constellation_master!constellation_id(name_ko, code)',
      )
      .lte('start_date', date)
      .gte('end_date', date)
      .single();

    if (error) throw mapSupabaseError(error);
    if (!data) throw Errors.notFound('해당 날짜의 별자리 시즌을 찾을 수 없습니다');

    return jsonOk(data, null, requestId);
  } catch (err) {
    return jsonError(err as Error, requestId);
  }
}
