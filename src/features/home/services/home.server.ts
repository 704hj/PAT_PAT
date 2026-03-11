import 'server-only';

import { Errors, mapSupabaseError } from '@/lib';
import { createServerSupabaseClientReadOnly } from '@/utils/supabase/server';
import { HomeSummarySchema } from '../schemas/home.schema';

export async function getHomeSummaryServer(): Promise<HomeSummary> {
  const supabase = await createServerSupabaseClientReadOnly();

  const { data, error: authErr } = await supabase.auth.getUser();
  const authUser = data.user;
  if (authErr || !authUser) throw Errors.unauthorized();

  const { data: profile, error: profileErr } = await supabase
    .from('users')
    .select('user_id, auth_user_id, email, nickname')
    .eq('auth_user_id', authUser.id)
    .is('deleted_at', null)
    .single();

  if (profileErr) {
    // PGRST116: users 테이블에 레코드 없음 → 회원가입 미완료 상태
    if (profileErr.code === 'PGRST116') throw Errors.unauthorized('signup_incomplete');
    throw mapSupabaseError(profileErr);
  }
  if (!profile) throw Errors.unauthorized('signup_incomplete');

  // 1. 기준 날짜 설정 (KST 기준)
  const now = new Date();
  const nowKst = new Date(now.getTime() + 9 * 60 * 60 * 1000);

  // KST 기준 이번 주 월요일/일요일 날짜 (YYYY-MM-DD)
  const kstDay = nowKst.getUTCDay(); // 0=일, 1=월 ... 6=토
  const mondayKst = new Date(nowKst);
  mondayKst.setUTCDate(nowKst.getUTCDate() - ((kstDay + 6) % 7));
  const weekStartKst = mondayKst.toISOString().split('T')[0];

  const sundayKst = new Date(mondayKst);
  sundayKst.setUTCDate(mondayKst.getUTCDate() + 6);
  const weekEndKst = sundayKst.toISOString().split('T')[0];

  // KST 기준 오늘 날짜 (YYYY-MM-DD)
  const todayKst = nowKst.toISOString().split('T')[0];

  // 2. 비동기 작업을 병렬로 실행 (속도 향상)
  const [starRes, diaryWeekRes, diaryTodayRes, collectedRes] = await Promise.all([
    // 이번 주 별 개수 (created_at 기준, 월~일 00:00~23:59 KST)
    supabase
      .from('star')
      .select('star_id', { count: 'exact', head: true })
      .gte('created_at', `${weekStartKst}T00:00:00+09:00`)
      .lte('created_at', `${weekEndKst}T23:59:59+09:00`)
      .eq('auth_user_id', authUser.id),

    // 이번 주 일기 개수 (entry_date 기준, KST 월~일)
    supabase
      .from('diary')
      .select('diary_id', { count: 'exact', head: true })
      .gte('entry_date', weekStartKst)
      .lte('entry_date', weekEndKst)
      .eq('auth_user_id', authUser.id)
      .is('deleted_at', null),

    // 오늘 일기 작성 여부
    supabase
      .from('diary')
      .select('diary_id')
      .eq('entry_date', todayKst)
      .eq('auth_user_id', authUser.id)
      .is('deleted_at', null),

    // 수집된 별자리 수 (entry_count / 총일수 >= 0.8)
    supabase.rpc('get_collected_constellation_count', { p_auth_user_id: authUser.id }),
  ]);

  // 3. 에러 핸들링
  if (starRes.error) throw mapSupabaseError(starRes.error);
  if (diaryWeekRes.error) throw mapSupabaseError(diaryWeekRes.error);
  if (diaryTodayRes.error) throw mapSupabaseError(diaryTodayRes.error);
  if (collectedRes.error) throw mapSupabaseError(collectedRes.error);

  // 4. 데이터 결과 조합
  const homeData = {
    profile: { nickname: profile.nickname, email: profile.email },
    starCount: starRes.count ?? 0,
    diaryCount: diaryWeekRes.count ?? 0,
    isDiary: (diaryTodayRes.data?.length ?? 0) > 0,
    diaryId: diaryTodayRes.data?.[0]?.diary_id,
    collectedCount: (collectedRes.data as number) ?? 0,
  };

  // 런타임 검증 (DB 데이터 이상/컬럼 타입 이상 즉시 감지)
  return HomeSummarySchema.parse(homeData);
}
