/*
 * 서버에서 세션 교환
 *  > 콜백 = 로그인 끝나고 돌아오는 자리
 *  > 세션 교환을 해줘야 로그인 상태가 됨
 */

// app/lumi/auth/callback/route.ts
import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

const AFTER_LOGIN = "/lumi/home";
const SIGNIN = "/lumi/auth/signin";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const origin = url.origin;
  const code = url.searchParams.get("code");
  const oauthErr =
    url.searchParams.get("error") ?? url.searchParams.get("error_description");

  // 1) OAuth 단계에서 에러가 붙어 돌아온 경우 → 로그인 페이지로
  if (oauthErr) {
    return NextResponse.redirect(new URL(`${SIGNIN}?error=oauth`, origin));
  }

  // 2) code 자체가 없으면 잘못 진입 → 로그인 페이지로
  if (!code) {
    return NextResponse.redirect(
      new URL(`${SIGNIN}?error=missing_code`, origin)
    );
  }

  // 3) 세션 교환
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value ?? null;
        },
        set(name: string, value: string, options: any) {
          cookieStore.set({ name, value, ...options });
        },
        remove(name: string, options: any) {
          cookieStore.set({ name, value: "", ...options });
        },
      },
    }
  );

  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) {
    // 교환 실패 → 로그인 페이지로
    return NextResponse.redirect(
      new URL(`${SIGNIN}?error=exchange_failed`, origin)
    );
  }

  // 4) 성공 → 실제 존재하는 페이지로 (예: /lumi/home)
  return NextResponse.redirect(new URL(AFTER_LOGIN, origin));
}
