"use client";

import { fetcher } from "@/app/api/_lib/fetcher";
import { useEffect, useMemo, useState } from "react";
import useSWR from "swr";

export function useDiaryList() {
  const today = useMemo(() => new Date().toISOString().slice(0, 10), []);
  const todayMonth = useMemo(() => new Date().toISOString().slice(0, 7), []);
  // 선택한 날짜 (YYYY-MM-DD)
  const [selectedDate, setSelectedDate] = useState<string>(today);
  // 선택한 달 (YYYY-MM)
  const [selectedMonth, setSelectedMonth] = useState<string>(todayMonth);

  // 하루 일기
  // const {
  //   data: diaryData,
  //   error: diaryError,
  //   isLoading: diaryLoading,
  //   mutate: mutateDiary,
  // } = useSWR(`/api/diary?date=${selectedDate}`, fetcher, {
  //   revalidateOnFocus: true,
  // });

  // 월별 일기
  const {
    data: diaryMonthData,
    error: diaryMonthError,
    isLoading: diaryMonthLoading,
    mutate: mutateDiaryMonth,
  } = useSWR(`/api/diary?month=${selectedMonth}`, fetcher, {
    revalidateOnFocus: true,
  });

  useEffect(() => {
    mutateDiaryMonth();
  }, [selectedDate]);

  useEffect(() => {
    console.log("diaryMonthData ", diaryMonthData);
  }, [diaryMonthData]);

  return {
    // state
    selectedDate,
    setSelectedDate,
    selectedMonth,
    setSelectedMonth,

    // month
    diaryMonthData,
    diaryMonthLoading,
  };
}
