import { createSupabaseAdminClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { email, token } = await req.json();

    if (!email || !token) {
      return NextResponse.json(
        { ok: false, message: "이메일과 인증코드를 입력해주세요." },
        { status: 400 }
      );
    }

    const supabase = await createSupabaseAdminClient();
  } catch (error) {
    console.error("OTP 검증 예외:", error);
    return NextResponse.json(
      { ok: false, message: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
