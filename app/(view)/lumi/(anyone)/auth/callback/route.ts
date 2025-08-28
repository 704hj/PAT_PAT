// import { createSupabaseClient } from "@/app/utils/supabase/client";
// import { NextResponse } from "next/server";

// /*
//  * 서버에서 세션 교환
//  *  > 콜백 = 로그인 끝나고 돌아오는 자리
//  *  > 세션 교환을 해줘야 로그인 상태가 됨
//  */
// export async function GET(request: Request) {
//   const { searchParams, origin } = new URL(request.url);
//   const code = searchParams.get("code");
//   // if "next" is in param, use it as the redirect URL
//   const next = searchParams.get("next") ?? "/";

//   if (code) {
//     const supabase = await createSupabaseClient();
//     const { error } = await supabase.auth.exchangeCodeForSession(code);
//     if (!error) {
//       //세션 교환 성공, /lumi/start로 리다이렉트
//       return NextResponse.redirect(`${origin}/lumi/start`);
//     }
//   }
//   // 실패 시 로그인 페이지로
//   return NextResponse.redirect(`${origin}/signin`);
// }
// app/auth/callback/route.ts
import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  if (code) {
    // 1) 쿠키 스토어를 먼저 해석
    const cookieStore = await cookies();

    // 2) 스토어의 메서드를 이용해 createServerClient에 전달
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value ?? null;
          },
          set(name: string, value: string, options: any) {
            // Next 15 타입에서 options는 넉넉하게 any로 둬도 OK
            cookieStore.set({ name, value, ...options });
          },
          remove(name: string, options: any) {
            cookieStore.set({ name, value: "", ...options });
          },
        },
      }
    );

    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) return NextResponse.redirect(`${origin}/lumi/start`);
  }

  return NextResponse.redirect(`${origin}/signin`);
}
