type HomeSummary = {
  profile: { nickname: string; email: string };
  starCount: number;
  weekDiaryDates: string[];
  isDiary: boolean;
  diaryId?: string;
  collectedCount: number;
};
