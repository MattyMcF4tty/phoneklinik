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
export function toSnakeCase(str: string): string {
  return str
    .replace(/([A-Z])/g, '_$1')
    .toLowerCase()
    .replace(/^_/, '');
}

// Converts "first_name" → "firstName"
export function toCamelCase(str: string): string {
  const [first, ...rest] = str.split('_');
  return (
    first.toLowerCase() +
    rest.map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join('')
  );
}

// --- Runtime Object Converters ---

// Serializes an object to database format (snake_case keys)
export function serializeToDbFormat<T extends object>(obj: T): Serialize<T> {
  return Object.entries(obj).reduce((acc, [key, value]) => {
    const snakeKey = toSnakeCase(key as string) as keyof Serialize<T>;
    acc[snakeKey] =
      value instanceof Date
        ? (value.toISOString() as Serialize<T>[typeof snakeKey])
        : (value as Serialize<T>[typeof snakeKey]);
    return acc;
  }, {} as Serialize<T>);
}

// Deserializes an object from database format (snake_case keys → camelCase keys)
export function deserializeFromDbFormat<T extends object>(
  obj: Record<string, unknown>
): T {
  const result: Partial<T> = {};

  for (const [key, value] of Object.entries(obj)) {
    const camelKey = toCamelCase(key) as keyof T;
    result[camelKey] = value as T[typeof camelKey];
  }

  return result as T;
}
