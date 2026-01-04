"use client";

import { fetcher } from "@/app/lib/fetcher";
import { useMemo } from "react";
import useSWR from "swr";

export function useDiaryEdit() {
  const {
    data: tagData,
    error: tagError,
    isLoading: tagLoading,
    mutate: mutateTags,
  } = useSWR("/api/tag", fetcher, {
    revalidateOnFocus: true,
  });

  const today = useMemo(() => new Date().toISOString().slice(0, 10), []);

  const {
    data: diaryData,
    error: diaryError,
    isLoading: diaryLoading,
    mutate: muteDiary,
  } = useSWR(`/api/diary?date=${today}`, fetcher, {
    revalidateOnFocus: true,
  });

  return {
    tags: tagData?.data ?? [],
    tagLoading,
    mutateTags,
    diaryData,
    diaryLoading,
    muteDiary,
  };
}
