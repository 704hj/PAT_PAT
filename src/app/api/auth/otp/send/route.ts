import { createSupabaseAdminClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      return NextResponse.json(
        { ok: false, message: "올바른 이메일을 입력해주세요." },
        { status: 400 }
      );
    }

    const supabase = await createSupabaseAdminClient();
  } catch (error: any) {
    console.error("OTP 발송 예외:", error);
    return NextResponse.json(
      { ok: false, message: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
