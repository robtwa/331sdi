/**
 * Determines whether the given value is a record.
 * @param val the value to check
 */
export const isRecord = (val: unknown): val is Record<string, unknown> => {
  return val !== null && typeof val === "object";
};