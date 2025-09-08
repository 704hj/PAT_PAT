import { NextResponse } from "next/server";

export function ok<T>(data: T, status = 200) {
  return NextResponse.json({ ok: true, data }, { status });
}

export function fail(message: string, status = 400, detail?: any) {
  return NextResponse.json(
    { ok: false, error: { message, detail } },
    { status }
  );
}
