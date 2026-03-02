'use server';

import { mapSupabaseError } from '@/lib';
import { withAuthAction } from '@/lib/actions/withAuthAction';
import { createSupabaseAdminClient } from '@/utils/supabase/server';
import { ProfileSchema } from '../schemas/profile.schema';

export async function deleteAccountAction() {
  return withAuthAction(async ({ authUser }) => {
    const adminSupabase = await createSupabaseAdminClient();
    const { error } = await adminSupabase.auth.admin.deleteUser(authUser.id);
    if (error) throw mapSupabaseError(error);
  });
}

export async function updateNicknameAction(nickname: string) {
  return withAuthAction(async ({ supabase, authUser }) => {
    const { error } = await supabase
      .from('users')
      .update({ nickname })
      .eq('auth_user_id', authUser.id)
      .is('deleted_at', null);

    if (error) throw mapSupabaseError(error);
  });
}

export async function getProfileAction() {
  return withAuthAction(async ({ supabase, authUser }) => {
    const [profileRes, starsRes, worriesRes, totalRes] = await Promise.all([
      supabase
        .from('users')
        .select('nickname, email')
        .eq('auth_user_id', authUser.id)
        .is('deleted_at', null)
        .single(),

      supabase
        .from('diary')
        .select('diary_id', { count: 'exact', head: true })
        .eq('auth_user_id', authUser.id)
        .eq('emotion_polarity', 'POSITIVE'),

      supabase
        .from('diary')
        .select('diary_id', { count: 'exact', head: true })
        .eq('auth_user_id', authUser.id)
        .eq('emotion_polarity', 'NEGATIVE'),

      supabase
        .from('diary')
        .select('diary_id', { count: 'exact', head: true })
        .eq('auth_user_id', authUser.id),
    ]);

    if (profileRes.error) throw mapSupabaseError(profileRes.error);

    return ProfileSchema.parse({
      profile: profileRes.data,
      totalStars: starsRes.count ?? 0,
      totalWorries: worriesRes.count ?? 0,
      totalDiaries: totalRes.count ?? 0,
    });
  });
}
