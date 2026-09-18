/** Tiny immutable path helpers so all edits are "set value at path" — one mutation primitive for every field. */
export type Path = (string | number)[];

export function getAt(obj: unknown, path: Path): unknown {
  return path.reduce<any>((acc, k) => (acc == null ? undefined : acc[k as any]), obj);
}
export function setAt<T>(obj: T, path: Path, value: unknown): T {
  if (path.length === 0) return value as T;
  const [k, ...rest] = path;
  const isIdx = typeof k === 'number';
  const base: any = Array.isArray(obj) ? [...(obj as any)] : { ...(obj as any) };
  base[k as any] = setAt(isIdx ? (obj as any)?.[k] ?? [] : (obj as any)?.[k] ?? {}, rest, value);
  return base;
}
export function updateAt<T>(obj: T, path: Path, fn: (prev: any) => any): T {
  return setAt(obj, path, fn(getAt(obj, path)));
}
export function pathKey(p: Path) { return p.join('.'); }
