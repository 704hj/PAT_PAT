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
  time: string; // HH:mm
  text: string;
  tags?: string[];
  pinned?: boolean;
};
