// src/app/api/diary/route.ts
import {
  Polarity,
  queryDiaries,
} from "@/features/diary-archive/server/queryDiaries";
import { NextResponse } from "next/server";

function parseCsv(s: string | null) {
  if (!s) return [];
  return s
    .split(",")
    .map((v) => v.trim())
    .filter(Boolean);
}

export async function GET(req: Request) {
  const url = new URL(req.url);

  const month = url.searchParams.get("month"); // YYYY-MM
  const date = url.searchParams.get("date"); // YYYY-MM-DD
  const q = (url.searchParams.get("q") || "").trim();
  const polarity = url.searchParams.get("polarity") as Polarity | null;
  const tagIds = parseCsv(url.searchParams.get("tag_ids"));
  const limit = url.searchParams.get("limit");
  const cursor = url.searchParams.get("cursor"); // created_at ISO

  try {
    const { items, nextCursor } = await queryDiaries({
      month,
      date,
      q,
      polarity,
      tagIds,
      limit: limit ? Number(limit) : undefined,
      cursor,
    });

    return NextResponse.json({
      ok: true,
      data: { items, nextCursor },
    });
  } catch (e: any) {
    const msg = e?.message || "Unknown error";

    if (msg === "Unauthorized") {
      return NextResponse.json({ ok: false, message: msg }, { status: 401 });
    }
    if (msg === "User profile not found") {
      return NextResponse.json({ ok: false, message: msg }, { status: 404 });
    }

    return NextResponse.json({ ok: false, message: msg }, { status: 500 });
  }
}
