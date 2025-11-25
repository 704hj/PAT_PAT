export interface TGradientProps {
  shape: "linear" | "radial";
  angle?: number;
  stops: {
    color: string;
    offset: number;
  }[];
}

export interface TShapeProps {
  gradient: TGradientProps;
  width: number;
  height: number;
}

export interface TLetterBtnProps {
  id: string;
  baseSize: number;
  xLimit: number;
  yLimit: number;
  //   gradient: TGradientProps;
  onClick: (id: string) => void;
  positions: TPositionProps[];
}

export interface TLetterProps {
  id: string;
  imageURL: string | null;
  content: string;
}

export interface TFormProps extends TLetterProps {
  createdDate: string;
  contact: string | null;
}

export interface TPositionProps {
  x: number;
  y: number;
  size?: number;
}
// app/(view)/lumi/types/star.ts
export type TPoint = { x: number; y: number };

export type TStar = {
  star_code: string; // ex) "capricorn"
  name_ko: string; // ex) "염소자리"
  start_day: string; // "MM-DD"
  end_day: string; // "MM-DD"
  primary_month: string; // ex) "01"
  points: TPoint[];
  edges: number[][];
  path_index: number[];
};
