'use server';

import { AppError, Errors, makeRequestId } from '@/lib';
import { getHomeSummaryServer } from '../services/home.server';

export async function getHomeSummaryAction() {
  const requestId = makeRequestId();
  try {
    const data = await getHomeSummaryServer();
    return { ok: true, data, requestId } as const;
  } catch (e) {
    const error = e instanceof AppError ? e : Errors.internal();
    return {
      ok: false,
      code: error.code,
      message: error.message,
      requestId,
    } as const;
  }
}
