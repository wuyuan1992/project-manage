export function getEnv<T>(key: string) {
  return process.env[key];
}

export function getBooleanEnv(key: string, defaultValue: boolean) {
  if (process.env[key] === undefined) return defaultValue;
  return Boolean(process.env[key]);
}

export function getNumericEnv(key: string, defaultValue: number) {
  if (process.env[key] === undefined) return defaultValue;
  const value = parseInt(process.env[key] as string, 10);
  return isNaN(value) ? defaultValue : value;
}

export function getStringEnv(key: string, defaultValue = '') {
  return process.env[key] ?? defaultValue;
}

export function getArrayEnv<T>(key: string, formatter?: (value: string) => T) {
  if (typeof process.env[key] !== 'string') return [];
  const values = process.env[key]?.split(',') ?? [];

  if (typeof formatter !== 'function') return values;
  return values.map((val) => formatter?.(val));
}

export function getJsonEnv<T>(key: string, defaultValue: T) {
  if (typeof process.env[key] !== 'string') return defaultValue;
  try {
    return JSON.parse(process.env[key] as string) as T;
  } catch {
    return defaultValue;
  }
}
