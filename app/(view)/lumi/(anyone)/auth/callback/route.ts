import { createServerSupabaseClient } from "@/app/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

const AFTER_LOGIN = "/lumi/home";
const SIGNIN = "/lumi/auth/signin";
const SAFE_PATHS = new Set([AFTER_LOGIN, "/"]); // 허용 리다이렉트 경로

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const origin = url.origin;
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");

  const oauthErr =
    url.searchParams.get("error") ?? url.searchParams.get("error_description");
  const next = url.searchParams.get("next"); // (선택) 돌아갈 경로

  // 1) OAuth 단계 에러
  if (oauthErr) {
    return NextResponse.redirect(new URL(`${SIGNIN}?error=oauth`, origin), {
      status: 303,
    });
  }
  // 2) code 없음
  if (!code) {
    return NextResponse.redirect(
      new URL(`${SIGNIN}?error=missing_code`, origin),
      { status: 303 }
    );
  }

  // 3) 서버 클라이언트
  const supabase = await createServerSupabaseClient();

  // 4) 세션 교환 (user/session 반환됨)
  const { data, error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) {
    console.error("OAuth exchange error:", error.message);
    // 교환 실패 → 로그인 페이지로
    return NextResponse.redirect(
      new URL(`${SIGNIN}?error=exchange_failed`, origin),
      { status: 303 }
    );
  }

  // 5) 사용자 정보로 users upsert
  const user = data.user;
  if (user) {
    const provider = (user.app_metadata?.provider as string) ?? "kakao";
    const nickname =
      (user.user_metadata?.name as string) ??
      (user.user_metadata?.nickname as string) ??
      null;
    const avatar =
      (user.user_metadata?.avatar_url as string) ??
      (user.user_metadata?.picture as string) ??
      null;

    const { error: upsertErr } = await supabase.from("users").upsert(
      {
        auth_user_id: user.id,
        email: user.email ?? null,
        signup_method: provider, // 'kakao' 등
        // profile_image: avatar, // 테이블에 있으면 추가
        // nickname,              // 테이블에 있으면 추가
        updated_at: new Date().toISOString(),
      },
      { onConflict: "auth_user_id" }
    );

    if (upsertErr) {
      console.error("[auth/callback] users upsert failed:", upsertErr.message);
    }
  }

  const targetPath = next && SAFE_PATHS.has(next) ? next : AFTER_LOGIN;
  return NextResponse.redirect(new URL(targetPath, origin), { status: 303 });
}
