"use server";

import { unstable_cache as cache } from "next/cache";
import { supabase } from "../utils/supabase/client";

export const getTagsAction = cache(
  async () => {
    const { data, error } = await supabase
      .from("tag")
      .select("tag_id, tag_name")
      .order("order_no");

    if (error) throw new Error(error.message);
    return data;
  },
  ["tags"],
  { revalidate: 60 * 60 }
);
