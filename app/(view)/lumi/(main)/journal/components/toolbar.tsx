"use client";

import { EntryType, Mood } from "../page";

export function Toolbar({
  month,
  setMonth,
  q,
  setQ,
  type,
  setType,
  mood,
  setMood,
}: {
  month: string;
  setMonth: (v: string) => void;
  q: string;
  setQ: (v: string) => void;
  type: "all" | EntryType;
  setType: (v: "all" | EntryType) => void;
  mood: Mood | "all";
  setMood: (v: Mood | "all") => void;
}) {
  return (
    <>
      {/* 월 + 검색 */}
      <div className="mt-3 grid grid-cols-12 gap-2">
        <div className="col-span-5">
          <div className="h-11 flex items-center gap-2 rounded-[12px] px-3 bg-white/6 border border-white/12">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              className="text-white/70"
            >
              <path
                d="M7 3v2M17 3v2M3 8h18M5 12h14M5 16h10"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            </svg>
            <input
              type="month"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              className="w-full bg-transparent text-white/90 text-[13.5px] outline-none [color-scheme:dark]"
            />
          </div>
        </div>
        <div className="col-span-7">
          <div className="h-11 flex items-center gap-2 rounded-[12px] px-3 bg-white/6 border border-white/12">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              className="text-white/70"
            >
              <path
                d="M11 4a7 7 0 1 1 0 14 7 7 0 0 1 0-14Zm8 14-3.65-3.65"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            </svg>
            <input
              placeholder="키워드, 태그 검색"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="w-full bg-transparent text-white/90 text-[13.5px] outline-none placeholder:text-white/45"
            />
          </div>
        </div>
      </div>

      {/* 퀵 필터 */}
      <div className="mt-2 flex flex-wrap gap-2">
        <Chip
          active={type === "all"}
          onClick={() => setType("all")}
          label="전체"
        />
        <Chip
          active={type === "star"}
          onClick={() => setType("star")}
          label="오늘의 별"
        />
        <Chip
          active={type === "release"}
          onClick={() => setType("release")}
          label="걱정 내려놓기"
        />
        <div className="mx-1 h-5 w-px bg-white/10" />
        <Chip
          active={mood === "all"}
          onClick={() => setMood("all")}
          label="모든 기분"
        />
        {(
          [
            "happy",
            "contentment",
            "joy",
            "excited",
            "love",
            "anger",
            "sad",
            "anxious",
          ] as Mood[]
        ).map((m) => (
          <Chip
            key={m}
            active={mood === m}
            onClick={() => setMood(m)}
            label={labelMood(m)}
          />
        ))}
      </div>
    </>
  );
}

function Chip({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={[
        "h-8 px-3 rounded-full text-[12.5px] border transition",
        active
          ? "bg-cyan-300/15 border-cyan-300/40 text-white"
          : "bg-white/6 border-white/12 text-white/80 hover:border-white/20",
      ].join(" ")}
    >
      {label}
    </button>
  );
}

function labelMood(m: Mood) {
  switch (m) {
    case "happy":
      return "기쁨";
    case "joy":
      return "즐거움";
    case "love":
      return "사랑";
    case "excited":
      return "설렘";
    case "contentment":
      return "만족";
    case "anger":
      return "화남";
    case "sad":
      return "슬픔";
    case "anxious":
      return "불안";
  }
}
