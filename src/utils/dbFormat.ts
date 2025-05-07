// --- Type-Level Utilities ---

// Converts PascalCase or camelCase to snake_case at the type level (best effort)
type SnakeCase<S extends string> = S extends `${infer Head}${infer Tail}`
  ? Tail extends Uncapitalize<Tail>
    ? `${Lowercase<Head>}${SnakeCase<Tail>}`
    : `${Lowercase<Head>}_${SnakeCase<Tail>}`
  : S;

// Converts snake_case to camelCase at the type level (best effort)
type CamelCase<S extends string> = S extends `${infer Head}_${infer Tail}`
  ? `${Lowercase<Head>}${Capitalize<CamelCase<Tail>>}`
  : S;

// Maps all keys of an object from PascalCase to snake_case
export type Serialize<T> = {
  [K in keyof T as SnakeCase<Extract<K, string>>]: T[K];
};

// Maps all keys of an object from snake_case to camelCase
export type Deserialize<T> = {
  [K in keyof T as CamelCase<Extract<K, string>>]: T[K];
};

// --- Runtime String Conversion Helpers ---

// Converts "FirstName" → "first_name"
function toSnakeCase(str: string): string {
  return str
    .replace(/([A-Z])/g, '_$1')
    .toLowerCase()
    .replace(/^_/, '');
}

// Converts "first_name" → "firstName"
function toCamelCase(str: string): string {
  const [first, ...rest] = str.split('_');
  return (
    first.toLowerCase() +
    rest.map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join('')
  );
}

// --- Runtime Object Converters ---

// Serializes an object to database format (snake_case keys)
export function serializeToDbFormat<T extends Record<string, any>>(
  obj: T
): Serialize<T> {
  const result: any = {};

  for (const [key, value] of Object.entries(obj)) {
    const snakeKey = toSnakeCase(key);
    result[snakeKey] = value instanceof Date ? value.toISOString() : value;
  }

  return result;
}

// Deserializes an object from database format (snake_case keys → camelCase keys)
export function deserializeFromDbFormat<T extends Record<string, any>>(
  obj: Record<string, any>
): T {
  const result: any = {};

  for (const [key, value] of Object.entries(obj)) {
    const camelKey = toCamelCase(key);
    result[camelKey] = value;
  }

  return result as T;
}
