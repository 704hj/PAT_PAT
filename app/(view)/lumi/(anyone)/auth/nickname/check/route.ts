// app/lumi/auth/nickname/check/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

function createAnonServerClient() {
  const store = cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: async (n) => (await store).get(n)?.value,
        set: () => {},
        remove: () => {},
      },
    }
  );
}

export async function POST(req: NextRequest) {
  const { nickname } = await req.json();
  if (!nickname || nickname.trim().length < 2) {
    return NextResponse.json(
      { ok: false, message: "닉네임은 2자 이상이어야 합니다." },
      { status: 400 }
    );
  }

  const supabase = createAnonServerClient();

  const { data, error } = await supabase
    .from("user_profile")
    .select("nickname")
    .eq("nickname", nickname.trim())
    .maybeSingle();

  if (error) {
    return NextResponse.json(
      { ok: false, message: "서버 오류" },
      { status: 500 }
    );
  }
  if (data) {
    return NextResponse.json({
      ok: false,
      message: "이미 사용 중인 닉네임입니다.",
    });
  }
  return NextResponse.json({ ok: true, message: "사용 가능한 닉네임입니다." });
}
