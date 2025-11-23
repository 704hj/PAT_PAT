"use client";

import Link from "next/link";
import { useMemo } from "react";
import ActionButton from "./component/actionBtn";
import GlassCard from "../../components/glassCard";
import Image from "next/image";
import MoodSelector from "../../components/moodSelector";

export default function HomePage() {
  const today = useMemo(() => {
    const d = new Date();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    const wk = ["일", "월", "화", "수", "목", "금", "토"][d.getDay()];
    return `${mm}.${dd} (${wk})`;
  }, []);

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
