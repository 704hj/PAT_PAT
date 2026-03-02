import { ZodError } from 'zod';
import { AppError } from '../errors/AppError';
import { Errors } from '../errors/Errors';

export type ActionErr = {
  code: string;
  message: string;
  details?: unknown;
  requestId: string;
};

export function toActionErr(e: unknown, requestId: string): ActionErr {
  if (e instanceof AppError) {
    return {
      code: e.code,
      message: e.message,
      details: e.details,
      requestId,
    };
  }

  if (e instanceof ZodError) {
    return {
      code: 'VALIDATION_ERROR',
      message: '데이터를 불러오는 중 문제가 발생했어요.',
      details: e.issues,
      requestId,
    };
  }

  const msg = e instanceof Error ? e.message : 'Unknown error';
  const wrapped = Errors.internal(msg);
  return {
    code: wrapped.code,
    message: wrapped.message,
    details: wrapped.details,
    requestId,
  };
}
