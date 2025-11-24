"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import ActionButton from "./component/actionBtn";
import GlassCard from "../../components/glassCard";
import { supabase } from "@/app/utils/supabase/client";
import { useRouter } from "next/navigation";

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
  const router = useRouter();
  //세션에서 가져오는 닉네임
  const [nickName, setNickName] = useState("");

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

  //session 값 가져오기
  useEffect(() => {
    async function loadSession() {
      const { data, error } = await supabase.auth.getSession();

      //세션 분기
      if (error) {
        return;
      }

      //세션 없는 경우
      if (!data.session) {
        //로그인 페이지로 이동
        router.replace("/lumi/auth/signin");
      }

      //세션 있음
      const user = data.session?.user;

      //유저 프로필 조회
      const { data: profileData } = await supabase
        .from("user_profile")
        .select("*")
        .eq("user_id", user?.id)
        .single();

      //상태 저장
      setNickName(profileData);
    }

    loadSession();
  }, []);

  return (
    <div className="relative min-h-[100svh] overflow-hidden">
      {/* 9:16 안전영역 */}
      <section className="relative mx-auto w-full max-w-[480px] aspect-[9/16] px-5">
        {/* 헤더: 날짜 + 인사 */}
        <header className="pt-6">
          <div className="text-white/70 text-sm">{today}</div>
          <h1 className="mt-1 text-white text-[20px] font-semibold tracking-tight">
            오늘의 감정, 밤하늘에
          </h1>
        </header>

        {/* 히어로: 캐릭터 + 카피 */}
        <div className="mt-5">
          <GlassCard className="p-4">
            <div className="flex items-center gap-4">
              !!!{nickName}
              <img
                src="/images/icon/3d.png"
                alt="루미"
                className="w-[64px] h-[64px] object-contain"
              />
              <div className="min-w-0">
                <p className="text-white/90 text-[15px] leading-snug">
                  밤하늘에 가볍게 기록해보세요.
                </p>
                <p className="text-white/70 text-[13px] mt-0.5">
                  루미가 곁에서 함께할게요.
                </p>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* 퀵 액션 */}
        <div className="mt-4 grid grid-cols-2 gap-3">
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

        {/* 오늘의 상태(간단 지표) */}
        <div className="mt-4">
          <GlassCard className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-white/80 text-[14px]">오늘의 기록</div>
                <div className="text-white text-[24px] font-semibold mt-1">
                  0 / 1
                </div>
              </div>
              {/* <Link
                href="/lumi/stats"
                className="text-white/80 text-[13px] underline underline-offset-4 hover:text-white transition"
              >
                통계 보기
              </Link> */}
              <div className="text-white/80 text-[13px] underline underline-offset-4 hover:text-white transition">
                통계 보기
              </div>
            </div>
            <div className="mt-3 h-px bg-white/10" />
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="px-2.5 py-1 rounded-full text-[12px] bg-white/8 text-white/85 border border-white/10">
                연속 기록 3일
              </span>
              <span className="px-2.5 py-1 rounded-full text-[12px] bg-white/8 text-white/85 border border-white/10">
                이번 주 목표 5/7
              </span>
            </div>
          </GlassCard>
        </div>

        {/* 최근 기록 */}
        <div className="mt-4">
          <GlassCard className="p-0">
            <div className="flex items-center justify-between px-4 pt-4">
              <h2 className="text-white text-[16px] font-semibold">
                최근 기록
              </h2>
              <Link
                href="/lumi/journal"
                className="text-white/80 text-[13px] hover:text-white transition"
              >
                전체 보기
              </Link>
            </div>
            <ul className="mt-2">
              {recent.map((r) => (
                <li
                  key={r.id}
                  className="px-4 py-3 flex items-start gap-3 border-t border-white/8 first:border-t-0"
                >
                  <div
                    className={[
                      "mt-0.5 h-2.5 w-2.5 rounded-full",
                      r.type === "good" ? "bg-cyan-300/90" : "bg-white/60",
                    ].join(" ")}
                  />
                  <div className="min-w-0">
                    <p className="text-white/90 text-[14px] truncate">
                      {r.text}
                    </p>
                    <p className="text-white/60 text-[12px] mt-0.5">{r.time}</p>
                  </div>
                </li>
              ))}
              {recent.length === 0 && (
                <li className="px-4 py-6">
                  <p className="text-white/70 text-[14px]">
                    아직 기록이 없어요. 오늘의 별을 만들어 보세요.
                  </p>
                </li>
              )}
            </ul>
          </GlassCard>
        </div>

        {/* 루미 팁 (작은 배너) */}
        <div className="mt-4">
          <GlassCard className="px-4 py-3">
            <p className="text-white/85 text-[14px]">
              팁 · 힘든 감정은 “걱정 내려놓기”에서 짧게 비워보세요. 길게 쓰지
              않아도 충분해요.
            </p>
          </GlassCard>
        </div>
      </section>
    </div>
  );
}
