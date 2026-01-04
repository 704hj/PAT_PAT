"use client";

import { fetcher } from "@/lib/fetcher";
import useSWR from "swr";

export function useHomeSummary() {
  return useSWR("/api/home/summary", fetcher, {
    revalidateOnFocus: true, // 앱 돌아왔을 때 갱신
  });
}
