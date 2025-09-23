"use client";

import { useEffect, useState } from "react";
import CalendarView from "../../components/calendarView";
import ConstellationCanvas from "../../components/constellationCanvas";

type Point = { x: number; y: number };
type Star = {
  star_code: string; // 별자리 영어 이름
  name_ko: string; // 별자리 한글 이름
  start_day: string; // "MM-DD"
  end_day: string; // "MM-DD"
  primary_month: string; // 별자리 해당 월
  points: Point[]; // 별자리 좌표
  edges: number[][]; // 하나의 별자리에서 별들을 이은 선
  path_index: number[]; //startDay-endDay
};

function mmdd(date: Date) {
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${mm}-${day}`;
}

// 별자리 날짜 범위 포함 여부 (연도 경계 처리)
function inRange(target: string, start: string, end: string) {
  if (start <= end) return target >= start && target <= end; // 일반 범위
  // 연도 걸치는 범위(예: 12-22 ~ 01-19)
  return target >= start || target <= end;
}

export default function Page() {
  //달력에서 사용자가 선택한 날짜
  const [clickDate, setClickDate] = useState("아직 선택하지 않았습니다.");

  //Date객체 실제 계산용
  const [nowDate, setNowDate] = useState<Date | null>(null);

  // 예: 2025-02-15 → 물병자리 기간
  // const date = new Date(2025, 11, 15);
  const date = nowDate ?? new Date();

  const [star, setStar] = useState<Star | null>(null);

  const [err, setErr] = useState<string | null>(null);

  const [stars, setStars] = useState<Star[]>([]);

  // useEffect(() => {
  //   async function fetchConstellations() {
  //     try {
  //       const res = await fetch("/api/constellation");
  //       const json = await res.json();

  //       if (!json.ok) {
  //         // 실패 처리
  //         setErr(`[${json.code}] ${json.message}`);
  //         return;
  //       }

  //       const stars = json.data;
  //       setStars(stars);
  //     } catch (err) {
  //       setErr("네트워크 오류가 발생했어요.");
  //     } finally {
  //     }
  //   }
  //   fetchConstellations();
  // }, []); // 최초 1회만

  useEffect(() => {
    fetch("/api/star")
      .then((res) => res.json())
      .then(setStars)
      .catch((err) => setErr(String(err)));
  }, []); // 최초 1회만

  useEffect(() => {
    console.log("stars###", stars);
    console.log("date##", date);
    console.log("nowDate###", nowDate);

    if (stars.length === 0) return;

    const key = mmdd(nowDate ?? new Date());
    const picked =
      stars.find((s) => inRange(key, s.start_day, s.end_day)) ?? null;

    setStar(picked);
  }, [nowDate, stars]);

  return (
    <main className="min-h-[100svh] px-5 pt-6">
      <h2 className="text-white/90 text-[16px] mb-3">
        이달의 별자리 : {star?.name_ko ?? "로딩 중…"} <br />
        {/* {clickDate가 속해있는 기간을 가져와야함} */}
        기간 : {clickDate ? `${star?.start_day}~${star?.end_day}` : "로딩 중…"}
        <br />
        {/* ko-KR : 2025. 2. 15 */}
        선택한 날짜 :{" "}
        {nowDate
          ? nowDate.toLocaleDateString("ko-KR")
          : "아직 선택하지 않았습니다."}
      </h2>
      {/* 부모(Page)에서 nowDate state 관리, CalendarView는 선택 시 setNowDate 호출 */}
      <CalendarView onSelectDate={setNowDate} />
      <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
        <ConstellationCanvas userId="demoUser" date={date} star={star} />
      </div>
      {err && (
        <p className="text-red-400 text-sm mt-2">데이터 로드 실패: {err}</p>
      )}
    </main>
  );
}
