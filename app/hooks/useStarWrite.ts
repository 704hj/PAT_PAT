"use client";

import { createDiaryAction } from "@/app/actions/diary";
import { getEntryByDate } from "@/app/utils/entries";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

export type MoodKey = "calm" | "okay" | "good" | "tough";
export type Polarity = "POSITIVE" | "NEGATIVE" | "UNSET";

export const MOODS: Array<{
  key: MoodKey;
  label: string;
  helper?: string;
  polarity: Polarity;
  img: string;
}> = [
  {
    key: "calm",
    label: "편안",
    polarity: "POSITIVE",
    img: "/images/icon/emotion/pos/happy.png",
  },
  {
    key: "okay",
    label: "무난",
    polarity: "UNSET",
    img: "/images/icon/emotion/pos/joy.png",
  },
  {
    key: "good",
    label: "만족",
    polarity: "POSITIVE",
    img: "/images/icon/emotion/pos/love.png",
  },
  {
    key: "tough",
    label: "버거움",
    polarity: "NEGATIVE",
    img: "/images/icon/emotion/neg/anger.png",
  },
];

export const LIMIT = 200;
export const MAX_TAGS = 3;

export function intensityLabel(v: number) {
  if (v <= 2) return "잔잔해요";
  if (v === 3) return "조금 느껴져요";
  return "꽤 컸어요";
}

function clampTags(next: string[]) {
  // 중복 제거 + 최대 3개
  const uniq = Array.from(new Set(next));
  return uniq.slice(0, MAX_TAGS);
}

interface UseStarWriteProps {
  editDate?: string; // 수정 모드일 때 날짜 (YYYY-MM-DD)
}

interface UseStarWriteReturn {
  // 상태
  mood: MoodKey | null;
  intensity: number;
  text: string;
  tagOpen: boolean;
  selectedTags: string[];
  isSubmitting: boolean;
  loading: boolean;
  selectedMood: typeof MOODS[0] | undefined;
  canSubmit: boolean;

  // 액션
  setMood: (mood: MoodKey | null) => void;
  setIntensity: (intensity: number) => void;
  setText: (text: string) => void;
  setTagOpen: (open: boolean) => void;
  toggleTag: (tagId: string) => void;
  submit: () => Promise<void>;
}

export function useStarWrite({ editDate }: UseStarWriteProps = {}): UseStarWriteReturn {
  const router = useRouter();

  const [mood, setMood] = useState<MoodKey | null>(null);
  const [intensity, setIntensity] = useState<number>(3);
  const [text, setText] = useState("");
  const [tagOpen, setTagOpen] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [existingDiaryId, setExistingDiaryId] = useState<number | undefined>(undefined);
  const [loading, setLoading] = useState(!!editDate); // 수정 모드면 로딩 시작

  const selectedMood = useMemo(() => MOODS.find((m) => m.key === mood), [mood]);

  const canSubmit = useMemo(() => {
    // MVP 기준: 텍스트만 필수로 두고(200자), 감정은 선택 가능
    return text.trim().length > 0 && !isSubmitting;
  }, [text, isSubmitting]);

  // 수정 모드: 기존 글 로드
  useEffect(() => {
    if (!editDate) return;

    const loadExistingEntry = async () => {
      setLoading(true);
      try {
        const entry = await getEntryByDate(editDate);
        if (entry) {
          // 내용 채우기
          setText(entry.content || "");
          setExistingDiaryId(entry.diary_id);

          // diary_type으로 mood 추론
          if (entry.diary_type === "worry") {
            setMood("tough"); // NEGATIVE
          } else if (entry.diary_type === "star") {
            // star는 POSITIVE이지만 어떤 mood인지 알 수 없으므로 기본값
            // 일단 "calm"으로 설정 (나중에 emotion 테이블 연동 시 수정 가능)
            setMood("calm");
          }

          // 태그 채우기
          if (entry.tag_ids && entry.tag_ids.length > 0) {
            setSelectedTags(entry.tag_ids.map((id) => String(id)));
          }
        }
      } catch (error) {
        console.error("Failed to load existing entry:", error);
      } finally {
        setLoading(false);
      }
    };

    loadExistingEntry();
  }, [editDate]);

  const toggleTag = (tagId: string) => {
    setSelectedTags((prev) => {
      const exists = prev.includes(tagId);
      const next = exists
        ? prev.filter((t) => t !== tagId)
        : clampTags([...prev, tagId]);
      return next;
    });
  };

  const submit = async () => {
    if (!canSubmit || !selectedMood) return;
    setIsSubmitting(true);
    try {
      const res = await createDiaryAction({
        entry_date: editDate || new Date().toISOString().split("T")[0],
        polarity: selectedMood?.polarity,
        content: text,
        tag_ids: selectedTags,
        diary_id: existingDiaryId, // 수정 모드일 때 기존 diary_id 전달
      });

      console.log("res ", res);
      if (res.ok) router.replace("/lumi/starLoad");
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    mood,
    intensity,
    text,
    tagOpen,
    selectedTags,
    isSubmitting,
    loading,
    selectedMood,
    canSubmit,
    setMood,
    setIntensity,
    setText,
    setTagOpen,
    toggleTag,
    submit,
  };
}

