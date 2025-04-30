// --- Type-Level Utilities ---

// Converts PascalCase or camelCase to snake_case at the type level (best effort)
type SnakeCase<S extends string> = S extends `${infer Head}${infer Tail}`
  ? Tail extends Uncapitalize<Tail>
    ? `${Lowercase<Head>}${SnakeCase<Tail>}`
    : `${Lowercase<Head>}_${SnakeCase<Tail>}`
  : S;

// Converts snake_case to PascalCase at the type level (best effort)
type PascalCase<S extends string> = S extends `${infer Head}_${infer Tail}`
  ? `${Capitalize<Head>}${PascalCase<Tail>}`
  : Capitalize<S>;

// Maps all keys of an object from PascalCase to snake_case
export type Serialize<T> = {
  [K in keyof T as SnakeCase<Extract<K, string>>]: T[K];
};

// Maps all keys of an object from snake_case to PascalCase
export type Deserialize<T> = {
  [K in keyof T as PascalCase<Extract<K, string>>]: T[K];
};

// --- Runtime String Conversion Helpers ---

// Converts "FirstName" → "first_name"
function toSnakeCase(str: string): string {
  return str
    .replace(/([A-Z])/g, '_$1')
    .toLowerCase()
    .replace(/^_/, '');
}

// Converts "first_name" → "FirstName"
function toPascalCase(str: string): string {
  return str
    .split('_')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');
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

// Deserializes an object from database format (snake_case keys → PascalCase keys)
export function deserializeFromDbFormat<T extends Record<string, any>>(
  obj: T
): Deserialize<T> {
  const result: any = {};

  for (const [key, value] of Object.entries(obj)) {
    const pascalKey = toPascalCase(key);
    result[pascalKey] = value;
  }

  return result;
}
