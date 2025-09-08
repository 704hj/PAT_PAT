"use server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * 서버 전용
 * 서버에서 세션 검사할 때 필요
 */
export async function createServerSupabaseClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );
}
