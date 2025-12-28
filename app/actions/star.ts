"use server";

import { unstable_cache as cache } from "next/cache";
import { supabase } from "../utils/supabase/client";
import { makeRequestId } from "../api/_lib";
type StarCountResult =
  | { ok: true; data: number; requestId?: string }
  | { ok: false; code?: string; message?: string; requestId?: string };

export const getStarCountAction = async (): Promise<StarCountResult> => {
  const requestId = makeRequestId();

  try {
    const { data: auth } = await supabase.auth.getUser();
    if (!auth?.user) {
      return {
        ok: false,
        code: "UNAUTHORIZED",
        message: "unauthorized",
        requestId,
      };
    }

    const { count, error } = await supabase
      .from("star")
      .select("*", { count: "exact", head: true })
      .eq("user_id", auth.user.id);

    if (error) throw error;

    return {
      ok: true,
      data: count ?? 0,
      requestId,
    };
  } catch (err) {
    return {
      ok: false,
      code: "INTERNAL_ERROR",
      message: (err as Error).message,
      requestId,
    };
  }
};
