"use server";

import {
  queryDiaries,
  type QueryDiariesParams,
} from "@/features/diary-archive/server/queryDiaries";
import "server-only";

/**
 * 내부(서버 컴포넌트/액션)에서 URL 없이 같은 로직 재사용하고 싶을 때만 사용
 */
export async function getDiariesAction(params: QueryDiariesParams) {
  return queryDiaries(params);
}
