"use client";

import Link from "next/link";
import ActionButton from "./component/actionBtn";
import GlassCard from "../../components/glassCard";
import { useUserProfile } from "@/app/hooks/useUserProfile";

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
import Image from "next/image";
import MoodSelector from "../../components/moodSelector";

export default function HomePage() {
  // 공통 훅으로 세션 + 프로필 정보 한 번에 가져오기
  const { profile, loading } = useUserProfile();


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
        className="inline-flex items-center gap-1 px-3 py-1.5 
                  bg-[#676D82] rounded-2xl border border-white/50 w-fit"
      >
        <img
          title="star"
          src="/images/icon/common/star.svg"
          alt="star"
          className="w-4 h-4"
        />
        <span className="text-white text-sm">Star</span>
        <span className="text-white text-sm">0</span>
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
        <button className="bg-[#657FC2] py-2 px-5 rounded-xl text-[15px] flex-shrink-0 ml-4">
          기록하기
        </button>
      </div>

      {/* 일주일 기록 카드 */}
      <div className="flex flex-col w-full">
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
              평균적으로 기쁨의 날이 많아요.
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
      </div>

      {/* 감정 선택 */}
      <MoodSelector />
    </div>
  );
}
