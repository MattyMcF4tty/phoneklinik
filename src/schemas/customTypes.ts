/**
 * Type looks like `'HH:MM:SS'`.
 * Hours only go to `23`.
 * Minutes only go to `59`.
 * Seconds only go to `59`.
 */
export type Time = `${`${0 | 1}${number}` | `2${0 | 1 | 2 | 3}`}:${`${
  | 0
  | 1
  | 2
  | 3
  | 4
  | 5}${number}`}:${`${0 | 1 | 2 | 3 | 4 | 5}${number}`}`;

export const timeRegex = /^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/;
export const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
