type TEmotion = {
  polarity: string;
  emotion: string;
  emotion_ko: string;
};

type TTag = {
  polarity: string;
  name: string;
  name_ko: string;
};

type Journal = {
  id: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  text: string;
  tags?: string[];
  pinned?: boolean;
};
