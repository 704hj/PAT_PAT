"use client";

import Link from "next/link";
import { useMemo, useRef, useState, useEffect, useCallback } from "react";
import { Toolbar } from "./components/toolbar";
import { StickyMonthHeader } from "./components/stickyMonthHeader";
import { JournalCard } from "./components/journalCard";
import { useInfiniteJournal } from "@/app/hooks/ui/useInfiniteJournal";

export type EntryType = "star" | "release";
export type Mood =
  | "contentment"
  | "excited"
  | "happy"
  | "joy"
  | "love"
  | "anger"
  | "sad"
  | "anxious";

export type Journal = {
  id: string;
  date: string; // "2025-08-24"
  time: string; // "21:40"
  type: EntryType;
  mood: Mood | null;
  text: string;
  tags?: string[];
  pinned?: boolean;
};

export default function JournalPage() {
  // ---- 필터 상태 ----
  const [q, setQ] = useState("");
  const [type, setType] = useState<"all" | EntryType>("all");
  const [mood, setMood] = useState<Mood | "all">("all");
  const [month, setMonth] = useState<string>(() => {
    const d = new Date();
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    return `${yyyy}-${mm}`;
  });

  // ---- 데이터 ----
  const {
    items,
    hasMore,
    loadMore,
    togglePin,
    removeItem,
    shareItem,
    loading,
  } = useInfiniteJournal();

  // ---- 필터링 + 정렬 ----
  const filtered = useMemo(() => {
    const byMonth = items.filter((e) => e.date.startsWith(month));
    const byType =
      type === "all" ? byMonth : byMonth.filter((e) => e.type === type);
    const byMood =
      mood === "all" ? byType : byType.filter((e) => e.mood === mood);
    const byQ = q.trim()
      ? byMood.filter((e) =>
          `${e.text} ${(e.tags ?? []).join(" ")}`
            .toLowerCase()
            .includes(q.toLowerCase())
        )
      : byMood;

    // pinned 우선, 최신순
    return byQ.sort((a, b) => {
      if (!!b.pinned !== !!a.pinned) return Number(b.pinned) - Number(a.pinned);
      const d = b.date.localeCompare(a.date);
      return d !== 0 ? d : b.time.localeCompare(a.time);
    });
  }, [items, month, type, mood, q]);

  // ---- 날짜 그룹 ----
  const grouped = useMemo(() => {
    const map: Record<string, Journal[]> = {};
    for (const item of filtered) (map[item.date] ||= []).push(item);
    return Object.entries(map).sort((a, b) => b[0].localeCompare(a[0]));
  }, [filtered]);

  // ---- 스티키 헤더 ----
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [stickyLabel, setStickyLabel] = useState<string>("");

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const headers = Array.from(
      el.querySelectorAll<HTMLElement>('[data-date-header="1"]')
    );
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort(
            (a, b) => a.boundingClientRect.top - b.boundingClientRect.top
          )[0];
        if (visible) {
          setStickyLabel(visible.target.getAttribute("data-label") || "");
        } else {
          if (headers[0])
            setStickyLabel(headers[0].getAttribute("data-label") || "");
        }
      },
      // 스티키 헤더 높이(약 48px)보다 조금 여유를 두고 조정
      { root: el, rootMargin: "0px 0px -85% 0px", threshold: [0, 1] }
    );
    headers.forEach((h) => io.observe(h));
    return () => io.disconnect();
  }, [grouped]);

  // ---- 무한 스크롤 ----
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const onIntersect = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      if (entries.some((e) => e.isIntersecting) && hasMore && !loading)
        loadMore();
    },
    [hasMore, loading, loadMore]
  );
  useEffect(() => {
    const s = sentinelRef.current;
    if (!s) return;
    const io = new IntersectionObserver(onIntersect, {
      root: containerRef.current,
      threshold: 0.1,
    });
    io.observe(s);
    return () => io.disconnect();
  }, [onIntersect]);

  return (
    <main className="relative min-h-[100svh] overflow-hidden">
      {/* 배경 */}
      <div
        aria-hidden
        className="absolute inset-0 -z-20 bg-[radial-gradient(100%_70%_at_50%_100%,#0b1d4a_0%,#091430_48%,#070f24_100%)]"
      />
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_center,transparent_60%,rgba(0,0,0,0.28))]"
      />

      {/* 컨테이너 */}
      <section className="relative mx-auto w-full max-w-[480px] px-5">
        {/* 헤더 + 툴바 (하단 간격 표준화) */}
        <header className="pt-6 pb-3">
          <div className="flex items-center justify-between">
            <h1 className="text-white text-[20px] font-semibold tracking-tight">
              기록
            </h1>
            <Link
              href="/lumi/stats"
              className="text-white/80 text-[13px] underline underline-offset-4 hover:text-white transition"
            >
              통계
            </Link>
          </div>

          {/* 툴바와의 간격 균형 */}
          <Toolbar
            month={month}
            setMonth={setMonth}
            q={q}
            setQ={setQ}
            type={type}
            setType={setType}
            mood={mood}
            setMood={setMood}
          />
        </header>

        {/* 스티키 헤더 (상단 여백/분리선 통일) */}
        <StickyMonthHeader month={month} label={stickyLabel} />

        {/* 리스트: 명시적 높이 계산(상단영역 ~ 바텀 네비 여유) */}
        <div
          ref={containerRef}
          className="
            mt-3
            overflow-y-auto
            pr-1
            space-y-6
            h-[calc(100svh-56px-48px-12px-24px)] 
            /* 56: header 상단패딩 포함 대략치, 48: 스티키, 12: 헤더/리스트 간격, 24: 하단 여백 */
            will-change-transform
          "
        >
          {grouped.length === 0 && <EmptyState />}

          {grouped.map(([date, items]) => (
            <section key={date} className="mt-5">
              <DateHeader date={date} />
              <ul className="mt-2 space-y-2.5">
                {items.map((e) => (
                  <li key={e.id}>
                    <JournalCard
                      e={e}
                      onPin={() => togglePin(e.id)}
                      onDelete={() => removeItem(e.id)}
                      onShare={() => shareItem(e.id)}
                    />
                  </li>
                ))}
              </ul>
            </section>
          ))}

          {/* 더보기/로딩 센티넬 */}
          <div
            ref={sentinelRef}
            className="h-10 flex items-center justify-center"
          >
            {loading && (
              <span className="text-white/60 text-[12px]">불러오는 중…</span>
            )}
            {!hasMore && !loading && (
              <span className="text-white/40 text-[12px]">
                마지막 기록이에요
              </span>
            )}
          </div>
        </div>

        {/* 하단 안전영역 여백 */}
        <div style={{ height: "max(16px, env(safe-area-inset-bottom))" }} />
      </section>
    </main>
  );
}

/* 날짜 헤더 */
function DateHeader({ date }: { date: string }) {
  const d = new Date(date);
  const label = `${d.getMonth() + 1}.${String(d.getDate()).padStart(2, "0")} (${
    ["일", "월", "화", "수", "목", "금", "토"][d.getDay()]
  })`;
  return (
    <div
      data-date-header="1"
      data-label={label}
      className="flex items-center justify-between"
    >
      <h3 className="text-white text-[14px] font-semibold tracking-[-0.01em]">
        {label}
      </h3>
    </div>
  );
}

/* 비었을 때 */
function EmptyState() {
  return (
    <div className="rounded-[16px] border border-dashed border-white/12 bg-white/4 px-5 py-10 text-center">
      <div className="mx-auto w-12 h-12 rounded-2xl bg-white/6 border border-white/12 flex items-center justify-center">
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          className="opacity-90 text-white/85"
        >
          <path
            d="M12 3.8l2.2 4.5 5 .7-3.6 3.6.8 5-4.4-2.3-4.4 2.3.8-5L4.8 9l5-.7L12 3.8z"
            fill="currentColor"
          />
        </svg>
      </div>
      <p className="mt-3 text-white/85 text-[14px]">아직 기록이 없어요.</p>
      <p className="text-white/60 text-[12.5px]">
        오늘의 별을 만들어 첫 기록을 남겨보세요.
      </p>
      <Link
        href="/lumi/write"
        className="inline-flex items-center gap-1.5 mt-4 h-10 px-3 rounded-[10px] text-[13px] font-medium text-white
                   bg-[linear-gradient(180deg,#18326f_0%,#0b1d4a_100%)] border border-white/14 hover:brightness-[1.03)]"
      >
        기록하러 가기
        <svg width="14" height="14" viewBox="0 0 24 24">
          <path
            d="M9 5l7 7-7 7"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            fill="none"
          />
        </svg>
      </Link>
    </div>
  );
}
