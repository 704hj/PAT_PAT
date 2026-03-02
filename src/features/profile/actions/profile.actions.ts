'use server';

import { mapSupabaseError } from '@/lib';
import { withAuthAction } from '@/lib/actions/withAuthAction';
import { ProfileSchema } from '../schemas/profile.schema';

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
