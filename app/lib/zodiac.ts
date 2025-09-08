// app/lib/zodiac.ts
export type Pt = { x: number; y: number };

export type ZodiacTemplate = {
  zodiac_code: string;
  name_ko: string;
  start_mmdd: string; // 'MM-DD'
  end_mmdd: string; // 'MM-DD'
  primary_month?: string;
  // ✅ 새 JSON 구조
  points: Pt[];
  path_index?: number[]; // 없으면 [0..points.length-1]
  edges?: [number, number][];
};

export async function loadTemplates(): Promise<ZodiacTemplate[]> {
  const res = await fetch("/api/star", { cache: "no-store" });
  if (!res.ok) throw new Error("failed to load starAPI");
  return res.json();
}

export function inRange(mmdd: string, start: string, end: string) {
  return start <= end
    ? mmdd >= start && mmdd <= end
    : mmdd >= start || mmdd <= end;
}

export function resolveZodiacByDate(date: Date, list: ZodiacTemplate[]) {
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  const mmdd = `${mm}-${dd}`;
  return list.find((z) => inRange(mmdd, z.start_mmdd, z.end_mmdd)) ?? list[0];
}

/* ---------- polyline sampling ---------- */
function buildMeta(points: Pt[]) {
  const seg: number[] = [];
  const acc: number[] = [0];
  let total = 0;
  for (let i = 0; i < points.length - 1; i++) {
    const dx = points[i + 1].x - points[i].x;
    const dy = points[i + 1].y - points[i].y;
    const L = Math.hypot(dx, dy);
    seg.push(L);
    total += L;
    acc.push(total);
  }
  return { seg, acc, total };
}

function sampleAt(points: Pt[], seg: number[], acc: number[], s: number): Pt {
  let i = 0;
  while (i < seg.length && acc[i + 1] < s) i++;
  if (i >= seg.length) return points[points.length - 1];
  const t = seg[i] === 0 ? 0 : (s - acc[i]) / seg[i];
  return {
    x: points[i].x + (points[i + 1].x - points[i].x) * t,
    y: points[i].y + (points[i + 1].y - points[i].y) * t,
  };
}

export function samplePolyline(
  points: Pt[] | undefined | null,
  N: number
): Pt[] {
  if (!points || points.length === 0) {
    return Array.from({ length: Math.max(0, N) }, () => ({ x: 0, y: 0 }));
  }
  if (points.length < 2 || N <= 1) {
    const first = points[0] ?? { x: 0, y: 0 };
    return Array.from({ length: Math.max(0, N) }, () => first);
  }
  const { seg, acc, total } = buildMeta(points);
  return Array.from({ length: N }, (_, k) =>
    sampleAt(points, seg, acc, total * (k / Math.max(1, N - 1)))
  );
}

export function daysInMonth(year: number, month1to12: number) {
  return new Date(year, month1to12, 0).getDate();
}

export function expandToDays(
  points: Pt[] | undefined,
  pathIndex: number[] | undefined,
  days: number
): Pt[] {
  if (!points || points.length === 0) return Array(days).fill({ x: 0, y: 0 });
  const path = (
    pathIndex && pathIndex.length > 0 ? pathIndex : points.map((_, i) => i)
  )
    .map((i) => points[i])
    .filter(Boolean);
  return samplePolyline(path, days);
}

/* ---- localStorage mock (그대로) ---- */
export type StarRecord = {
  dayIndex: number; // 0-based
  moodKey: string;
  intensity: number; // 1~5
  text: string;
  tags: string[];
  isSpecial: boolean;
};

export function loadMonthStarsMock(
  userId: string,
  year: number,
  month: number
): StarRecord[] {
  if (typeof window === "undefined") return [];
  const key = `stars:${userId}:${year}-${String(month).padStart(2, "0")}`;
  try {
    return JSON.parse(localStorage.getItem(key) || "[]");
  } catch {
    return [];
  }
}

export function saveMonthStarsMock(
  userId: string,
  year: number,
  month: number,
  list: StarRecord[]
) {
  if (typeof window === "undefined") return;
  const key = `stars:${userId}:${year}-${String(month).padStart(2, "0")}`;
  localStorage.setItem(key, JSON.stringify(list));
}

export function upsertStarMock(
  userId: string,
  date: Date,
  data: Omit<StarRecord, "dayIndex">
) {
  const y = date.getFullYear();
  const m = date.getMonth() + 1;
  const d = date.getDate();
  const dayIndex = d - 1;
  const list = loadMonthStarsMock(userId, y, m);
  const i = list.findIndex((r) => r.dayIndex === dayIndex);
  const rec: StarRecord = { dayIndex, ...data };
  if (i >= 0) list[i] = rec;
  else list.push(rec);
  saveMonthStarsMock(userId, y, m, list);
  return rec;
}
