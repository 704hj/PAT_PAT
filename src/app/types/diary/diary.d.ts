type TEmotion = {
  polarity: string;
  emotion: string;
  emotion_ko: string;
};

type TTag = {
  tag_id: string;
  tag_name: string;
};

type Journal = {
  id: string;
  date: string; // YYYY-MM-DD
  content: string;
  tags?: string[];
  pinned?: boolean;
};

type TDiaryItem = {
  content: string;
  created_at: string;
  diary_id: string;
  emotion_intensity: 3;
  emotion_polarity: number;
  entry_date: string;
  tags: TTag[];
  updated_at: string;
};
