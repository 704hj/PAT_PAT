"use client";

import { useUserProfile } from "@/app/hooks/useUserProfile";
import Image from "next/image";
import { useMemo } from "react";
import MoodSelector from "../../components/moodSelector";

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

export default function HomePage() {
  // 공통 훅으로 세션 + 프로필 정보 한 번에 가져오기
  const { profile, loading } = useUserProfile();

  const today = useMemo(() => {
    const d = new Date();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    const wk = ["일", "월", "화", "수", "목", "금", "토"][d.getDay()];
    return `${mm}.${dd} (${wk})`;
  }, []);

  // 샘플 최근 기록 데이터 (연동 전까지 임시)
  const recent = [
    {
      id: 1,
      type: "good",
      text: "햇살이 좋아서 산책했어요",
      time: "오늘 14:20",
    },
    {
      id: 2,
      type: "release",
      text: "회의 스트레스 흘려보냄",
      time: "어제 22:10",
    },
  ];

  // 로딩 중이면 로딩 UI 표시
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full overflow-auto items-start px-4 pt-14">
      <div
        className="inline-flex items-center gap-1 px-2 py-1 
                  bg-[#676D82] rounded-2xl border border-white/50 w-auto mb-5"
      >
        <img src="/images/icon/common/star.svg" className="w-4 h-4" />
        <span className="text-white text-sm">Star</span>
        <span className="text-white text-sm">{"0"}</span>
      </div>
      <div className="relative w-full h-[80px]">
        <div className="absolute bottom-0 left-0 flex flex-row items-center gap-20">
          <div className="text-white text-xl leading-tight">
            <span>루미님,</span>
            <br />
            <span>오늘의 감정을 기록해주세요.</span>
          </div>

          <Image
            src="/images/icon/lumi/lumi_main.svg"
            alt="lumi"
            width={70}
            height={90}
          />
        </div>
      </div>
      <div className="flex flex-row items-center justify-between bg-[#192440] text-white w-full px-6 py-7 rounded-xl mt-10">
        <span className="whitespace-pre text-[15px]">
          {"기억하고 싶은 순간이 있었나요?\n별빛 아래에 편히 적어보아요."}
        </span>
        <button className="bg-[#657FC2] py-2 px-6 rounded-xl text-[16px]">
          기록하기
        </button>
      </div>
      <div className="flex flex-col w-full mt-5">
        <div className="flex w-full bg-[#C1CEF1] rounded-t-2xl items-center justify-center ">
          <Image
            src="/images/icon/lumi/lumi_book.svg"
            alt="lumi"
            width={120}
            height={200}
          />
        </div>
        <div className="w-full flex flex-row items-center justify-between bg-[#192440] rounded-b-2xl text-white px-7 py-5 ">
          <div className="tracking-tight leading-[1.3]">
            <span className="text-[16px]">
              일주일 동안 기록을 확인할 수 있어요.
            </span>
            <br />
            <span className="text-[12px] text-[#A6A6A6]">
              평균적으로 기쁨의 날이 많아요.
            </span>
          </div>

          <div className="flex items-center justify-center rounded-full bg-[#657FC2] w-[46px] h-[46px]">
            <Image
              src="/images/icon/common/arrow.svg"
              alt="arrow"
              width={20}
              height={20}
            />
          </div>
        </div>
      </div>
      <MoodSelector />
    </div>
  );
}
