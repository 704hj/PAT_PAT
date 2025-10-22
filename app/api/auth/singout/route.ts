// app/api/auth/signout/route.ts
import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function POST(request: Request) {
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
          // next/headers엔 delete가 없으므로 set으로 무효화
          cookieStore.set({ name, value: "", ...options });
        },
      },
    }
  );

  await supabase.auth.signOut();

  const { origin, searchParams } = new URL(request.url);
  const next = searchParams.get("next") ?? "/lumi/auth/signin";
  return NextResponse.redirect(new URL(next, origin), { status: 302 });
}
