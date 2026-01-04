import { NextRequest, NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/utils/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email || typeof email !== "string") {
      return NextResponse.json({ exists: false }, { status: 400 });
    }

    // Admin API를 사용하여 이메일 존재 여부 확인
    const adminClient = await createSupabaseAdminClient();

    // 이메일로 사용자 조회
    const { data, error } = await adminClient.auth.admin.listUsers({
      page: 1,
      perPage: 1000,
    });

    if (error) {
      console.error("[check-email] Admin API error:", error);
      // 에러 발생 시 계정이 없다고 가정 (보안상 안전)
      return NextResponse.json({ exists: false });
    }

    // 이메일로 사용자 찾기
    const userExists = data.users.some(
      (user) => user.email?.toLowerCase() === email.toLowerCase()
    );

    return NextResponse.json({ exists: userExists });
  } catch (err: any) {
    console.error("[check-email] Error:", err);
    // 에러 발생 시 계정이 없다고 가정
    return NextResponse.json({ exists: false });
  }
}
