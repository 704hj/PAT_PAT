"use client";
import { createBrowserClient } from "@supabase/ssr";

//브라우저 전용
export function createSupabaseClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
