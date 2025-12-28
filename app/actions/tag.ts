"use server";

import { unstable_cache as cache } from "next/cache";
import { createClient } from "@supabase/supabase-js";

// 태그는 공개 데이터이므로 anon key로 직접 조회 (cookies 불필요)
const getSupabaseClient = () => {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
};

export const getTagsAction = cache(
  async () => {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from("tag")
      .select("id, name, name_ko, polarity")
      .order("created_at");

    if (error) throw new Error(error.message);
    
    // StarWrite 컴포넌트가 기대하는 형태로 변환
    return data?.map((tag) => ({
      tag_id: String(tag.id),
      tag_name: tag.name_ko || tag.name,
    })) || [];
  },
  ["tags"],
  { revalidate: 60 * 60 }
);
