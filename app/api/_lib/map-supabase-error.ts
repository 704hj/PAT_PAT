import { AppError, Errors } from "./errors";

type PGError = {
  code?: string;
  message: string;
  details?: unknown;
  hint?: string;
};

export function mapSupabaseError(e: PGError): AppError {
  switch (e.code) {
    case "23505":
      return Errors.conflict("Duplicate resource", e);
    case "23503":
      return Errors.invalid("Invalid reference (FK violation)", e);
    case "23514":
      return Errors.invalid("Value violates constraint", e);
    case "42P01": // undefined_table
    case "42703": // undefined_column
      return Errors.db("Database schema error", e);
    default:
      return Errors.db(e.message || "Database error", e);
  }
}
