"use client";

import { useEffect, useState } from "react";
import ConstellationCanvas from "../../components/constellationCanvas";
import CalendarView from "../../components/calendarView";

type Point = { x: number; y: number };
type Star = {
  starCode: string; // 별자리 영어 이름
  name_ko: string; // 별자리 한글 이름
  startDay: string; // "MM-DD"
  endDay: string; // "MM-DD"
  primaryMonth: string; // 별자리 해당 월
  points: Point[]; // 별자리 좌표
  edges: number[][]; // 하나의 별자리에서 별들을 이은 선
  pathIndex: number[]; //startDay-endDay
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

  useEffect(() => {
    // 컴포넌트가 마운트되거나 d가 바뀔 때 실행되는 사이드이펙트
    // 언마운트 이후 setState 방지용 플래그,
    // 비동기 통신(fetch)이 끝나기 전에 컴포넌트가 언마운트될 수도 있는데,
    // 그 경우 setState를 호출하면 React에서 경고
    // 따라서 alive를 두어서 “이 컴포넌트가 아직 살아있는지” 확인하고, 죽었다면(false) state 변경을 무시
    let alive = true;

    fetch("/mock/star.json")
      .then((res) => {
        // HTTP 응답 객체 처리
        // 200대가 아니면 에러로 처리
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json(); // 응답 본문을 JSON으로 파싱(비동기)
      })
      .then((json: Star[]) => {
        // 파싱된 JSON 데이터(Star 배열)를 받음
        // 이미 언마운트되었으면 더 진행하지 않음
        if (!alive) return;

        // d(Date)를 "MM-DD" 문자열로 변환 (예: "02-15")
        const key = mmdd(date);

        // 오늘 날짜(key)가 포함되는 별자리 하나를 찾음
        const picked =
          json.find((s) => inRange(key, s.startDay, s.endDay)) ?? null;
        // 찾은 별자리를 state에 저장(없으면 null)
        setStar(picked);
      })
      // 네트워크/파싱 에러 발생 시, 아직 살아있다면 에러 메시지 저장
      .catch((err) => alive && setErr(String(err)));

    return () => {
      // 클린업 함수: 언마운트되거나 다음 이펙트 실행 직전에 호출
      // 이후에 도착하는 비동기 작업이 setState 못 하게 막음
      alive = false;
    };
  }, [date]);

  return (
    <main className="min-h-[100svh] px-5 pt-6">
      <h2 className="text-white/90 text-[16px] mb-3">
        이달의 별자리 : {star?.name_ko ?? "로딩 중…"} <br />
        {/* {clickDate가 속해있는 기간을 가져와야함} */}
        기간 : {clickDate ? `${star?.startDay}~${star?.endDay}` : "로딩 중…"}
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
