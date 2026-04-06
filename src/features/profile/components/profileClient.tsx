'use client';

import { supabase } from '@/utils/supabase/client';
import { useAuth } from '@/features/auth/hooks/useAuth';
import ErrorModal from '@/features/common/ErrorModal';
import {
  deleteAccountAction,
  updateBirthDateAction,
  updateNicknameAction,
} from '@/features/profile/actions/profile.actions';
import ProfileSkeleton from '@/features/profile/components/skeleton';
import { useUserProfile } from '@/features/profile/hooks/useUserProfile';
import { profileKeys } from '@/features/profile/queries/profile';
import { getZodiacNameKo, getZodiacSeasonRange, getZodiacSign, loadTemplates, resolveZodiacByDate } from '@/lib/zodiac';
import GlassCard from '@/shared/components/glassCard';
import ZodiacBadge from '@/shared/components/ZodiacBadge';
import { useQueryClient, useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function ProfileClientPage() {
  const router = useRouter();
  const { user } = useAuth({ required: true });
  const { data, isLoading, isError, error } = useUserProfile();
  const qc = useQueryClient();

  const [nickInput, setNickInput] = useState('');
  const [editingNick, setEditingNick] = useState(false);
  const [nickPending, setNickPending] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [deletePending, setDeletePending] = useState(false);
  const [logoutPending, setLogoutPending] = useState(false);
  const [editingBirth, setEditingBirth] = useState(false);
  const [birthInput, setBirthInput] = useState('');
  const [birthPending, setBirthPending] = useState(false);

  const handleLogout = async () => {
    if (logoutPending) return;
    setLogoutPending(true);
    await supabase.auth.signOut();
    router.replace('/start');
  };

  const handleDeleteAccount = async () => {
    if (deletePending) return;
    setDeletePending(true);
    const res = await deleteAccountAction();
    setDeletePending(false);
    if (res.ok) {
      router.replace('/start');
    }
  };

  const birthDate = data?.profile.birth_date
    ? new Date(data.profile.birth_date)
    : null;
  const birthZodiac = birthDate
    ? getZodiacNameKo(getZodiacSign(birthDate))
    : null;

  const { data: templates } = useQuery({
    queryKey: ['zodiac-templates'],
    queryFn: loadTemplates,
    staleTime: Infinity,
  });

  const birthTemplate = birthDate && templates
    ? resolveZodiacByDate(birthDate, templates)
    : null;

  const birthSignKey = birthDate ? getZodiacSign(birthDate) : null;
  const birthSeason = birthDate && birthSignKey
    ? getZodiacSeasonRange(new Date(), birthSignKey)
    : null;

  const { data: birthSeasonStats } = useQuery({
    queryKey: ['birth-season-stats', birthSeason?.start?.toISOString()],
    queryFn: async () => {
      if (!birthSeason) return null;
      const dateStr = birthSeason.start.toISOString().split('T')[0];
      const periodRes = await fetch(`/api/constellation/period/by-date?date=${dateStr}`);
      if (!periodRes.ok) return null;
      const periodJson = await periodRes.json();
      const periodId = periodJson.data?.period_id;
      if (!periodId) return null;

      const progressRes = await fetch(`/api/constellation/period/${periodId}/progress`);
      if (!progressRes.ok) return null;
      const progressJson = await progressRes.json();
      return {
        periodId,
        totalDays: birthSeason.daysCount,
        ...(progressJson.data ?? { entry_count: 0, positive_count: 0, negative_count: 0 }),
      };
    },
    enabled: !!birthSeason,
    staleTime: 1000 * 60 * 30,
  });

  const openBirthEdit = () => {
    setBirthInput(data?.profile.birth_date ?? '');
    setEditingBirth(true);
  };

  const saveBirthDate = async () => {
    if (!birthInput || birthPending) return;
    setBirthPending(true);
    const res = await updateBirthDateAction(birthInput);
    setBirthPending(false);
    if (res.ok) {
      setEditingBirth(false);
      await qc.invalidateQueries({ queryKey: profileKeys.all });
    }
  };

  const openNickEdit = () => {
    setNickInput(data?.profile.nickname ?? '');
    setEditingNick(true);
  };

  const saveNickname = async () => {
    if (!nickInput.trim() || nickPending) return;
    setNickPending(true);
    const res = await updateNicknameAction(nickInput.trim());
    setNickPending(false);
    if (res.ok) {
      setEditingNick(false);
      await qc.invalidateQueries({ queryKey: profileKeys.all });
    }
  };

  if (isLoading) {
    return <ProfileSkeleton />;
  }

  if (isError) {
    const code = (error as any)?.code;
    if (code === 'AUTH_UNAUTHORIZED') {
      router.replace('/start');
      return null;
    }
    return (
      <main className="relative min-h-[100svh] overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-0 -z-20 bg-[radial-gradient(100%_70%_at_50%_100%,#0b1d4a_0%,#091430_48%,#070f24_100%)]"
        />
        <ErrorModal
          description={error?.message ?? '프로필을 불러오지 못했어요.'}
          onClose={() => router.push('/home')}
        />
      </main>
    );
  }

  return (
    <main className="relative min-h-[100svh] overflow-hidden">
      {/* 배경 */}
      <div
        aria-hidden
        className="absolute inset-0 -z-20 bg-[radial-gradient(100%_70%_at_50%_100%,#0b1d4a_0%,#091430_48%,#070f24_100%)]"
      />
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_center,transparent_60%,rgba(0,0,0,0.28))]"
      />

      {/* 컨테이너 */}
      <section className="relative mx-auto w-full max-w-[480px] px-5">
        {/* 헤더 */}
        <header className="pt-6 pb-3 flex items-center justify-between">
          <h1 className="text-white text-[20px] font-semibold tracking-tight">
            내 정보
          </h1>
        </header>

        {/* 콘텐츠 */}
        <div className="space-y-5 pb-[88px]">
          {/* 프로필 + 간단 지표 */}
          <GlassCard className="p-4">
            <div className="flex items-center gap-3.5">
              <div className="relative w-[64px] h-[64px] rounded-2xl bg-white/8 border border-white/12 overflow-hidden flex items-center justify-center">
                <img
                  src="/images/icon/lumi/lumi_main.svg"
                  alt="루미"
                  className="w-[56px] h-[56px] object-contain"
                />
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(255,255,255,0.12),transparent_60%)]"
                />
              </div>
              <div className="min-w-0">
                <p className="text-white/90 text-[15px] leading-snug truncate">
                  안녕하세요, {data?.profile.nickname || '별빛 기록가'}님 ✨
                </p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  <Badge>총 {data?.totalDiaries ?? 0}개 기록</Badge>
                  {birthTemplate && birthZodiac && (
                    <ZodiacBadge
                      nameKo={birthZodiac}
                      points={birthTemplate.points}
                      edges={birthTemplate.edges}
                    />
                  )}
                </div>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-3 divide-x divide-white/10 rounded-[12px] overflow-hidden border border-white/10">
              <StatCell
                label="좋았던 날"
                value={String(data?.totalStars ?? 0)}
              />
              <StatCell
                label="힘들었던 날"
                value={String(data?.totalWorries ?? 0)}
              />
              <StatCell
                label="기록한 별들"
                value={String(data?.totalDiaries ?? 0)}
              />
            </div>
          </GlassCard>

          {/* 계정 */}
          <GlassCard className="p-1.5">
            <SectionTitle>계정</SectionTitle>
            {editingNick ? (
              <div className="px-4 py-3 flex items-center gap-2 border-t border-white/8">
                <span className="text-white/90 text-[14px] shrink-0">
                  닉네임
                </span>
                <input
                  className="flex-1 min-w-0 bg-white/6 border border-white/20 rounded-lg px-2 py-1 text-[14px] text-white placeholder:text-white/30 focus:outline-none focus:border-white/40"
                  value={nickInput}
                  onChange={(e) => setNickInput(e.target.value)}
                  maxLength={20}
                  autoFocus
                  onKeyDown={(e) => e.key === 'Enter' && saveNickname()}
                />
                <button
                  onClick={saveNickname}
                  disabled={nickPending || !nickInput.trim()}
                  className="shrink-0 text-[12px] text-white/85 px-2.5 py-1.5 rounded-lg bg-white/10 border border-white/15 disabled:opacity-40"
                >
                  {nickPending ? '저장 중' : '저장'}
                </button>
                <button
                  onClick={() => setEditingNick(false)}
                  className="shrink-0 text-[12px] text-white/55"
                >
                  취소
                </button>
              </div>
            ) : (
              <SettingRow
                label="닉네임"
                desc={data?.profile.nickname}
                right={
                  <button
                    onClick={openNickEdit}
                    className="text-[12px] text-white/60 px-2.5 py-1.5 rounded-lg bg-white/6 border border-white/10 hover:bg-white/10 transition"
                  >
                    수정
                  </button>
                }
              />
            )}
            {editingBirth ? (
              <div className="px-4 py-3 flex items-center gap-2 border-t border-white/8">
                <span className="text-white/90 text-[14px] shrink-0">생일</span>
                <input
                  type="date"
                  className="flex-1 min-w-0 bg-white/6 border border-white/20 rounded-lg px-2 py-1 text-[14px] text-white focus:outline-none focus:border-white/40 [color-scheme:dark]"
                  value={birthInput}
                  onChange={(e) => setBirthInput(e.target.value)}
                  autoFocus
                />
                <button
                  onClick={saveBirthDate}
                  disabled={birthPending || !birthInput}
                  className="shrink-0 text-[12px] text-white/85 px-2.5 py-1.5 rounded-lg bg-white/10 border border-white/15 disabled:opacity-40"
                >
                  {birthPending ? '저장 중' : '저장'}
                </button>
                <button
                  onClick={() => setEditingBirth(false)}
                  className="shrink-0 text-[12px] text-white/55"
                >
                  취소
                </button>
              </div>
            ) : (
              <SettingRow
                label="생일"
                desc={
                  data?.profile.birth_date
                    ? `${data.profile.birth_date} · ${birthZodiac}`
                    : '설정되지 않음'
                }
                right={
                  <button
                    onClick={openBirthEdit}
                    className="text-[12px] text-white/60 px-2.5 py-1.5 rounded-lg bg-white/6 border border-white/10 hover:bg-white/10 transition"
                  >
                    {data?.profile.birth_date ? '수정' : '설정'}
                  </button>
                }
              />
            )}
            <SettingRow label="이메일" desc={user?.email || '이메일 없음'} />
            <SettingRow
              label="로그인 방식"
              right={
                <div className="flex items-center gap-2">
                  {user?.app_metadata?.provider === 'kakao' && (
                    <IdP pill="KAKAO" />
                  )}
                  {user?.app_metadata?.provider === 'google' && (
                    <IdP pill="Google" />
                  )}
                  {user?.app_metadata?.provider === 'email' && (
                    <IdP pill="Email" />
                  )}
                  {!user?.app_metadata?.provider && <IdP pill="Email" />}
                </div>
              }
            />
            {/* <SettingLink
              href="/lumi/account/security"
              label="보안 설정"
              desc="비밀번호/2단계 인증"
            /> */}
          </GlassCard>

          {/* 환경설정 */}
          {/* <GlassCard className="p-1.5">
            <SectionTitle>환경설정</SectionTitle>
            <ToggleRow
              label="알림"
              desc="저녁 9시에 기록 리마인드"
              value={notifOn}
              onChange={setNotifOn}
            />
            <ToggleRow
              label="사운드"
              desc="보내기/별 만들기 사운드"
              value={soundOn}
              onChange={setSoundOn}
            />
            <ToggleRow
              label="비공개 모드"
              desc="공유 시 닉네임/프로필 숨김"
              value={privateMode}
              onChange={setPrivateMode}
            />
          </GlassCard> */}

          {/* 데이터 */}
          {/* <GlassCard className="p-1.5">
            <SectionTitle>데이터</SectionTitle>
            <SettingLink
              href="/lumi/data/export"
              label="데이터 내보내기"
              desc="CSV · 텍스트 백업"
            />
            <SettingLink
              href="/lumi/data/backup"
              label="iCloud/Drive 백업"
              desc="자동 백업 설정"
            />
            <SettingLink
              href="/lumi/data/import"
              label="가져오기"
              desc="다른 앱에서 이동"
            />
          </GlassCard> */}

          {/* 나의 별자리 컬렉션 */}
          {birthZodiac && birthSeasonStats && (
            <GlassCard className="p-5">
              <div className="flex items-center gap-2 mb-4">
                <p className="text-white/85 text-[14px] font-medium">
                  나의 별자리 · {birthZodiac}
                </p>
                {birthSeasonStats.entry_count > 0 &&
                  birthSeasonStats.entry_count / birthSeasonStats.totalDays >= 0.8 && (
                    <span className="px-1.5 py-0.5 rounded-full text-[9px] bg-purple-400/15 text-purple-300/80 border border-purple-400/25">
                      수집 완료
                    </span>
                  )}
              </div>

              {/* 통계 */}
              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="text-center p-2 rounded-xl bg-white/4">
                  <p className="text-white text-[18px] font-semibold">
                    {birthSeasonStats.entry_count}
                  </p>
                  <p className="text-white/50 text-[11px] mt-0.5">
                    / {birthSeasonStats.totalDays}일
                  </p>
                </div>
                <div className="text-center p-2 rounded-xl bg-white/4">
                  <p className="text-blue-300 text-[18px] font-semibold">
                    {birthSeasonStats.positive_count ?? 0}
                  </p>
                  <p className="text-white/50 text-[11px] mt-0.5">좋았던 날</p>
                </div>
                <div className="text-center p-2 rounded-xl bg-white/4">
                  <p className="text-orange-300 text-[18px] font-semibold">
                    {birthSeasonStats.negative_count ?? 0}
                  </p>
                  <p className="text-white/50 text-[11px] mt-0.5">힘들었던 날</p>
                </div>
              </div>

              {/* 진행률 바 */}
              <div
                className="relative w-full rounded-full overflow-hidden"
                style={{ height: 4, background: 'rgba(255,255,255,0.07)' }}
              >
                <div
                  className="absolute top-0 bottom-0 w-px"
                  style={{ left: '80%', background: 'rgba(255,255,255,0.35)' }}
                />
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${Math.min(
                      Math.round(
                        (birthSeasonStats.entry_count / birthSeasonStats.totalDays) * 100
                      ),
                      100
                    )}%`,
                    background:
                      'linear-gradient(90deg, rgba(255,200,60,0.7), rgba(255,170,40,0.85))',
                    boxShadow: '0 0 8px rgba(255,190,50,0.4)',
                  }}
                />
              </div>
              <div className="flex justify-between mt-1.5">
                <span className="text-white/45 text-[9px]">
                  {Math.round(
                    (birthSeasonStats.entry_count / birthSeasonStats.totalDays) * 100
                  )}
                  %
                </span>
                <span className="text-white/35 text-[9px]">80% 달성 시 수집</span>
              </div>
            </GlassCard>
          )}

          {/* 지원 */}
          <GlassCard className="p-1.5">
            <SectionTitle>지원</SectionTitle>
            <SettingLink
              href="/lumi/help"
              label="도움말"
              desc="자주 묻는 질문"
            />
            <SettingLink
              href="/lumi/contact"
              label="문의하기"
              desc="피드백 보내기"
            />
            <SettingLink href="/privacy" label="이용약관 · 개인정보" />
          </GlassCard>

          {/* 세션/위험영역 */}
          {deleteConfirm ? (
            <div className="rounded-[12px] border border-red-400/20 bg-red-500/8 p-4 space-y-3">
              <p className="text-[13.5px] text-red-300/90 leading-snug">
                정말로 계정을 삭제할까요?
                <br />
                모든 기록과 별이 영구적으로 사라져요.
              </p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setDeleteConfirm(false)}
                  className="h-10 rounded-[10px] text-[13px] text-white/80 bg-white/8 border border-white/12"
                >
                  취소
                </button>
                <button
                  onClick={handleDeleteAccount}
                  disabled={deletePending}
                  className="h-10 rounded-[10px] text-[13px] font-medium text-red-300 bg-red-500/15 border border-red-400/30 disabled:opacity-40"
                >
                  {deletePending ? '삭제 중...' : '삭제하기'}
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4">
              <button
                type="button"
                onClick={handleLogout}
                disabled={logoutPending}
                className="w-full h-11 rounded-[12px] text-[13px] font-medium text-white/85 bg-white/6 border border-white/12 hover:bg-white/10 transition disabled:opacity-40"
              >
                {logoutPending ? '로그아웃 중...' : '로그아웃'}
              </button>
              <button
                type="button"
                onClick={() => setDeleteConfirm(true)}
                className="text-[12px] text-white/25 hover:text-red-300/60 transition"
              >
                계정 삭제
              </button>
            </div>
          )}

          {/* 하단 여백(Safe area) */}
          <div style={{ height: 'max(16px, env(safe-area-inset-bottom))' }} />
        </div>
      </section>
    </main>
  );
}

function SettingRow({
  label,
  desc,
  right,
}: {
  label: string;
  desc?: string;
  right?: React.ReactNode;
}) {
  return (
    <div className="px-4 py-3.5 flex items-center justify-between border-t border-white/8 first:border-t-0">
      <div className="min-w-0">
        <div className="text-white/90 text-[14px]">{label}</div>
        {desc && <div className="text-white/60 text-[12px] mt-0.5">{desc}</div>}
      </div>
      {right}
    </div>
  );
}

function SettingLink({
  href,
  label,
  desc,
}: {
  href: string;
  label: string;
  desc?: string;
}) {
  return (
    <Link
      href={href}
      className="px-4 py-3.5 flex items-center justify-between border-t border-white/8 first:border-t-0 group"
    >
      <div className="min-w-0">
        <div className="text-white/90 text-[14px] group-hover:text-white transition">
          {label}
        </div>
        {desc && <div className="text-white/60 text-[12px] mt-0.5">{desc}</div>}
      </div>
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        className="text-white/70 group-hover:text-white transition"
      >
        <path
          d="M9 5l7 7-7 7"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          fill="none"
        />
      </svg>
    </Link>
  );
}

function ToggleRow({
  label,
  desc,
  value,
  onChange,
}: {
  label: string;
  desc?: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <SettingRow
      label={label}
      desc={desc}
      right={
        value ? (
          <button
            type="button"
            title="switch"
            role="switch"
            aria-checked="true"
            aria-label={label}
            onClick={() => onChange(!value)}
            className="h-7 w-[46px] rounded-full border transition relative bg-cyan-300/25 border-cyan-300/50"
          >
            <span
              aria-hidden
              className="absolute top-1/2 -translate-y-1/2 h-5 w-5 rounded-full bg-white shadow transition left-[26px]"
            />
          </button>
        ) : (
          <button
            type="button"
            title="switch"
            role="switch"
            aria-checked="false"
            aria-label={label}
            onClick={() => onChange(!value)}
            className="h-7 w-[46px] rounded-full border transition relative bg-white/6 border-white/12"
          >
            <span
              aria-hidden
              className="absolute top-1/2 -translate-y-1/2 h-5 w-5 rounded-full bg-white shadow transition left-[4px]"
            />
          </button>
        )
      }
    />
  );
}

function IdP({ pill }: { pill: 'KAKAO' | 'Google' | 'Email' }) {
  return (
    <span className="px-2.5 h-7 inline-flex items-center rounded-full text-[12px] bg-white/6 text-white/80 border border-white/12">
      {pill}
    </span>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="px-4 pt-3">
      <h2 className="text-white/85 text-[13px] font-semibold tracking-[-0.01em]">
        {children}
      </h2>
    </div>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="px-2.5 h-6 inline-flex items-center rounded-full text-[11px] bg-white/6 text-white/85 border border-white/10">
      {children}
    </span>
  );
}

function StatCell({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white/6">
      <div className="p-3 text-center">
        <div className="text-white text-[18px] font-semibold">{value}</div>
        <div className="text-white/65 text-[12px] mt-0.5">{label}</div>
      </div>
    </div>
  );
}
