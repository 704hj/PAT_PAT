"use client";

import Link from "next/link";
import Image from "next/image";
import ActionButton from "./component/actionBtn";
import GlassCard from "../../components/glassCard";
import MoodSelector from "../../components/moodSelector";
import { useUserProfile } from "@/app/hooks/useUserProfile";
import { useDiaryStats } from "@/app/hooks/useDiaryStats";

function IconStar() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" className="opacity-90">
      <path
        d="M12 3.8l2.2 4.5 5 0.7-3.6 3.6 0.8 5-4.4-2.3-4.4 2.3 0.8-5L4.8 9l5-0.7L12 3.8z"
        fill="currentColor"
      />
    </svg>
  );
}

function IconRelease() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="opacity-90"
    >
      <path
        d="M3 12h12M9 6l6 6-6 6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}

// 날짜 포맷 함수
function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

  if (diffHours < 1) return "방금 전";
  if (diffHours < 24) return `${diffHours}시간 전`;

  const diffDays = Math.floor(diffHours / 24);
  if (diffDays === 1) return "어제";
  if (diffDays < 7) return `${diffDays}일 전`;

  return `${date.getMonth() + 1}.${date.getDate()}`;
}

export default function HomePage() {
  // 공통 훅으로 세션 + 프로필 정보 한 번에 가져오기
  const { profile, loading: profileLoading } = useUserProfile();
  const { stats, loading: statsLoading } = useDiaryStats();

  const loading = profileLoading || statsLoading;


  // 로딩 중이면 로딩 UI 표시
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full min-h-screen overflow-auto px-4 pt-14 pb-24 gap-5">
      {/* 스타 뱃지 */}
      <div
        className="inline-flex items-center gap-1.5 px-3 py-1.5 
                  bg-[#676D82] rounded-2xl border border-white/50 w-fit"
      >
        <img
          title="star"
          src="/images/icon/common/star.svg"
          alt="star"
          className="w-4 h-4"
        />
        <span className="text-white text-sm font-medium">Star</span>
        <span className="text-yellow-300 text-sm font-bold">
          {stats?.totalStars ?? 0}
        </span>
      </div>

      {/* 히어로 섹션: 캐릭터 + 인사 */}
      <div className="flex items-start gap-4">
        <Image
          src="/images/icon/lumi/lumi_main.svg"
          alt="루미"
          width={70}
          height={90}
          className="flex-shrink-0"
        />
        <GlassCard className="p-4 flex-1">
          <p className="text-white/90 text-[15px] leading-snug">
            {profile?.nickname || "루미"}님, 밤하늘에 가볍게 기록해보세요.
          </p>
          <p className="text-white/70 text-[13px] mt-1">
            루미가 곁에서 함께할게요.
          </p>
        </GlassCard>
      </div>

      {/* 퀵 액션 버튼 */}
      <div className="grid grid-cols-2 gap-3">
        <ActionButton
          href="/lumi/write"
          label="오늘의 별 만들기"
          variant="solid"
          icon={<IconStar />}
        />
        <ActionButton
          href="/lumi/release"
          label="걱정 내려놓기"
          variant="glass"
          icon={<IconRelease />}
        />
      </div>

      {/* 기록하기 카드 */}
      <div className="flex flex-row items-center justify-between bg-[#192440] text-white w-full px-6 py-5 rounded-xl">
        <span className="whitespace-pre-line text-[15px] leading-relaxed">
          {"기억하고 싶은 순간이 있었나요?\n별빛 아래에 편히 적어보아요."}
        </span>
        <Link
          href="/lumi/write"
          className="bg-[#657FC2] py-2 px-5 rounded-xl text-[15px] flex-shrink-0 ml-4 hover:bg-[#5570b5] transition-colors"
        >
          기록하기
        </Link>
      </div>

      {/* 최근 기록 */}
      {stats?.recentDiaries && stats.recentDiaries.length > 0 && (
        <div className="flex flex-col gap-3">
          <h3 className="text-white/80 text-sm font-medium">최근 기록</h3>
          <div className="flex flex-col gap-2">
            {stats.recentDiaries.slice(0, 3).map((diary) => (
              <div
                key={diary.diary_id}
                className="flex items-center gap-3 bg-white/5 backdrop-blur-sm rounded-xl px-4 py-3 border border-white/10"
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    diary.diary_type === "star"
                      ? "bg-yellow-500/20"
                      : "bg-blue-500/20"
                  }`}
                >
                  {diary.diary_type === "star" ? (
                    <span className="text-yellow-400">⭐</span>
                  ) : (
                    <span className="text-blue-400">💭</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white/90 text-sm truncate">
                    {diary.content}
                  </p>
                  <p className="text-white/50 text-xs mt-0.5">
                    {diary.emotion_name && (
                      <span className="mr-2">{diary.emotion_name}</span>
                    )}
                    {formatDate(diary.created_at)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 일주일 기록 카드 */}
      <Link href="/lumi/journal" className="flex flex-col w-full">
        <div className="flex w-full bg-[#C1CEF1] rounded-t-2xl items-center justify-center py-4">
          <Image
            src="/images/icon/lumi/lumi_book.svg"
            alt="루미 책"
            width={120}
            height={160}
          />
        </div>
        <div className="w-full flex flex-row items-center justify-between bg-[#192440] rounded-b-2xl text-white px-5 py-4">
          <div className="tracking-tight leading-snug">
            <span className="text-[15px]">
              일주일 동안 기록을 확인할 수 있어요.
            </span>
            <br />
            <span className="text-[12px] text-[#A6A6A6]">
              {stats?.weeklyMood
                ? `이번 주는 "${stats.weeklyMood}" 감정이 많아요.`
                : stats?.totalStars === 0
                ? "아직 기록이 없어요. 첫 별을 만들어보세요!"
                : "기록을 분석하고 있어요."}
            </span>
          </div>
          <div className="flex items-center justify-center rounded-full bg-[#657FC2] w-[42px] h-[42px] flex-shrink-0 ml-3">
            <Image
              src="/images/icon/common/arrow.svg"
              alt="arrow"
              width={18}
              height={18}
            />
          </div>
        </div>
      </Link>

      {/* 감정 선택 */}
      <MoodSelector />
    </div>
  );
}
