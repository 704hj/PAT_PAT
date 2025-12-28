"use client";

import { fetcher } from "@/app/api/_lib/fetcher";
import { useMemo } from "react";
import useSWR from "swr";

export function useDiaryWrite() {
  const {
    data: tagData,
    error: tagError,
    isLoading: tagLoading,
    mutate: mutateTags,
  } = useSWR("/api/tag", fetcher, {
    revalidateOnFocus: true,
  });

  return {
    tags: tagData?.data ?? [], // ← 실제 태그 배열
    tagLoading,
    mutateTags,
  };
}
