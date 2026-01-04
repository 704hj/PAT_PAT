"use client";

import { fetcher } from "@/lib/fetcher";
import { useDebouncedValue } from "@/shared/hooks/useDebounce";
import { useMemo, useState } from "react";
import useSWR from "swr";
type ViewMode = "list" | "calendar";

export function useDiaryList() {
  const today = useMemo(() => new Date().toISOString().slice(0, 10), []);
  const todayMonth = useMemo(() => new Date().toISOString().slice(0, 7), []);
  // 선택한 날짜 (YYYY-MM-DD)
  const [selectedDate, setSelectedDate] = useState<string>(today);
  // 선택한 달 (YYYY-MM)
  const [selectedMonth, setSelectedMonth] = useState<string>(todayMonth);
  // 일기 검색
  const [q, setQ] = useState("");
  const debouncedQ = useDebouncedValue(q, 300);

  // 뷰 모드
  const [view, setView] = useState<ViewMode>("list");

  // 월별 일기
  const {
    data: diaryMonthData,
    error: diaryMonthError,
    isLoading: diaryMonthLoading,
    mutate: mutateDiaryMonth,
  } = useSWR(
    `/api/diary-archive?month=${selectedMonth}&q=${encodeURIComponent(
      debouncedQ
    )}`,
    fetcher,
    {
      revalidateOnFocus: true,
    }
  );
  return {
    // state
    selectedDate,
    setSelectedDate,
    selectedMonth,
    setSelectedMonth,

    // month
    diaryMonthData,
    diaryMonthLoading,

    q,
    setQ,

    view,
    setView,
  };
}
