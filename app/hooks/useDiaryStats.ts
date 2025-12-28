"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/app/utils/supabase/client";
import { useAuth } from "./useAuth";

interface DiaryStats {
  totalStars: number;
  totalWorries: number;
  recentDiaries: RecentDiary[];
  weeklyMood: string | null; // 이번 주 가장 많은 감정
}

interface RecentDiary {
  diary_id: number;
  diary_type: "star" | "worry";
  content: string;
  created_at: string;
  emotion_name?: string;
}

interface UseDiaryStatsReturn {
  stats: DiaryStats | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

/**
 * 로그인한 사용자의 일기 통계를 가져오는 훅
 */
export function useDiaryStats(): UseDiaryStatsReturn {
  const { user, loading: authLoading } = useAuth({ required: true });
  const [stats, setStats] = useState<DiaryStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchStats = async () => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // 1. users 테이블에서 user_id 가져오기
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("user_id")
        .eq("auth_user_id", user.id)
        .single();

      if (userError || !userData) {
        console.error("[useDiaryStats] User not found:", userError);
        setStats({
          totalStars: 0,
          totalWorries: 0,
          recentDiaries: [],
          weeklyMood: null,
        });
        setLoading(false);
        return;
      }

      const userId = userData.user_id;

      // 2. 별(star) 개수 조회
      let starCount = 0;
      const { count: starCountResult, error: starError } = await supabase
        .from("diary")
        .select("*", { count: "exact", head: true })
        .eq("user_id", userId)
        .eq("diary_type", "star");
      
      if (starError) {
        console.error("[useDiaryStats] star 조회 에러:", starError);
        setError(new Error(`별 개수 조회 실패: ${starError.message}`));
      } else {
        starCount = starCountResult || 0;
      }

      // 3. 걱정(worry) 개수 조회
      let worryCount = 0;
      const { count: worryCountResult, error: worryError } = await supabase
        .from("diary")
        .select("*", { count: "exact", head: true })
        .eq("user_id", userId)
        .eq("diary_type", "worry");
      
      if (worryError) {
        console.error("[useDiaryStats] worry 조회 에러:", worryError);
        setError(new Error(`걱정 개수 조회 실패: ${worryError.message}`));
      } else {
        worryCount = worryCountResult || 0;
      }

      // 4. 최근 일기 5개 조회
      let recentDiaries: RecentDiary[] = [];
      const { data: recentData, error: recentError } = await supabase
        .from("diary")
        .select(`
          diary_id,
          diary_type,
          content,
          created_at
        `)
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(5);

      if (recentError) {
        console.error("[useDiaryStats] 최근 일기 조회 에러:", recentError);
        setError(new Error(`최근 일기 조회 실패: ${recentError.message}`));
      } else if (recentData) {
        recentDiaries = recentData.map((d: any) => ({
          diary_id: d.diary_id,
          diary_type: d.diary_type,
          content: d.content || "",
          created_at: d.created_at,
          emotion_name: undefined,
        }));
      }

      // 감정 분석은 일단 스킵 (테이블 구조 확인 후 추가)
      const weeklyMood: string | null = null;

      // 결과 설정
      setStats({
        totalStars: starCount,
        totalWorries: worryCount,
        recentDiaries,
        weeklyMood,
      });
    } catch (err) {
      console.error("[useDiaryStats] 예상치 못한 에러:", err);
      const errorMessage = err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다.";
      setError(new Error(errorMessage));
      // 에러가 발생해도 기본값으로 설정 (UI가 깨지지 않도록)
      setStats({
        totalStars: 0,
        totalWorries: 0,
        recentDiaries: [],
        weeklyMood: null,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authLoading) return;
    fetchStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id, authLoading]);

  return {
    stats,
    loading: authLoading || loading,
    error,
    refetch: fetchStats,
  };
}

