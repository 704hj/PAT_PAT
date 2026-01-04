import { z } from "zod";
import { Errors } from "./errors";

export async function parseJsonBody<T extends z.ZodTypeAny>(
  req: Request,
  schema: T
) {
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    throw Errors.invalid("Invalid request body", parsed.error.format());
  }
  return parsed.data as z.infer<T>;
}
