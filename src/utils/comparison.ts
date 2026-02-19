export function getComparable(value: unknown): {
  type: 'number' | 'date' | 'string' | 'boolean';
  v: number | string | boolean;
} {
  if (value instanceof Date) return { type: 'date', v: value.getTime() };
  if (typeof value === 'number') return { type: 'number', v: value };
  if (typeof value === 'boolean') return { type: 'boolean', v: value };
  return { type: 'string', v: value == null ? '' : String(value) };
}

export function compareValues(a: unknown, b: unknown): number {
  const ca = getComparable(a);
  const cb = getComparable(b);
  if (ca.type !== cb.type) {
    // Fallback to string compare across types
    return String(ca.v).localeCompare(String(cb.v));
  }
  if (ca.type === 'string')
    return (ca.v as string).localeCompare(cb.v as string, undefined, { numeric: true, sensitivity: 'base' });
  if (ca.type === 'number' || ca.type === 'date') return (ca.v as number) - (cb.v as number);
  if (ca.type === 'boolean') return ca.v === cb.v ? 0 : ca.v ? 1 : -1;
  return 0;
}
