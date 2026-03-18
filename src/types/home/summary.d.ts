type HomeSummary = {
  profile: { nickname: string; email: string };
  starCount: number;
  weekDiaries: {
    diary_id: string;
    entry_date: string;
    content: string;
    emotion_polarity: string;
    emotion_intensity: number | null;
  }[];
  isDiary: boolean;
  diaryId?: string;
  collectedCount: number;
  periodDiaryCount: number;
  periodTotalDays: number;
};
