export const getErrorMessage = (err: unknown, message: string): string =>
  err instanceof Error ? err.message : message;
