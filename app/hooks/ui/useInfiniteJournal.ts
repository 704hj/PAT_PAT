"use client";

import { Journal } from "@/app/(view)/lumi/(main)/diary/page";
import { useCallback, useEffect, useRef, useState } from "react";

/** 데모용 페이징 소스 (API 연결 부분 교체) */
function mockFetch(
  page: number,
  size: number,
  seed: string
): Promise<Journal[]> {
  return new Promise((res) => {
    setTimeout(() => {
      const base = 50 * page;
      const now = new Date();
      const pad = (n: number) => String(n).padStart(2, "0");

      const out: Journal[] = Array.from({ length: size }).map((_, i) => {
        const day = Math.max(1, 24 - ((base + i) % 10));
        const date = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(
          day
        )}`;
        const uid = `${seed}-${page}-${i}`; // ★ 시드 + 페이지 + 인덱스

        return {
          id: uid, // ★ 고유 key
          date,
          time: `${pad(9 + ((base + i) % 10))}:${pad(((base + i) * 7) % 60)}`,
          type: i % 3 === 0 ? "release" : "star",
          mood: (
            [
              "happy",
              "contentment",
              "joy",
              "excited",
              "love",
              "anger",
              "sad",
              "anxious",
            ] as const
          )[(base + i) % 8],
          text:
            i % 3 === 0
              ? "물결에 흘려보내고 나니 마음이 조금 가벼워졌다."
              : "작은 순간이었지만 고마운 마음이 들었다.",
          tags: i % 2 ? ["일", "산책"] : ["관계"],
          pinned: false,
        };
      });

      res(out);
    }, 400);
  });
}

export function useInfiniteJournal() {
  const [page, setPage] = useState(0);
  const [items, setItems] = useState<Journal[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const initOnce = useRef(false); // ★ 초기 1회 로드 가드
  const instanceSeed = useRef(Math.random().toString(36).slice(2)); // ★ 훅 인스턴스 시드

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    const next = await mockFetch(page + 1, 20, instanceSeed.current); // ★ 시드 전달
    setItems((prev) => [...prev, ...next]);
    setPage((p) => p + 1);
    if (next.length < 20) setHasMore(false);
    setLoading(false);
  }, [page, loading, hasMore]);

  useEffect(() => {
    if (initOnce.current) return;
    initOnce.current = true;
    loadMore();
  }, [loadMore]);

  // 액션들 동일…
  const togglePin = (id: string) => {
    setItems((prev) =>
      prev.map((it) => (it.id === id ? { ...it, pinned: !it.pinned } : it))
    );
  };
  const removeItem = (id: string) =>
    setItems((prev) => prev.filter((it) => it.id !== id));
  const shareItem = async (id: string) => {
    /* … */
  };

  return {
    items,
    hasMore,
    loadMore,
    togglePin,
    removeItem,
    shareItem,
    loading,
  };
}
