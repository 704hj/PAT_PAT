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

    const { data: auth, error: authErr } = await supabase.auth.getUser();
    if (authErr || !auth?.user) throw Errors.unauthorized();

    const { data, error } = await supabase
      .from('user_constellation_period')
      .select('entry_count, positive_count, negative_count, has_light, glow_level, first_entry_at, last_entry_at')
      .eq('auth_user_id', auth.user.id)
      .eq('period_id', periodId)
      .maybeSingle();

    if (error) throw mapSupabaseError(error);

    return jsonOk(
      data ?? {
        entry_count: 0,
        positive_count: 0,
        negative_count: 0,
        has_light: false,
        glow_level: 0,
        first_entry_at: null,
        last_entry_at: null,
      },
      null,
      requestId,
    );
  } catch (err) {
    return jsonError(err as Error, requestId);
  }
}
