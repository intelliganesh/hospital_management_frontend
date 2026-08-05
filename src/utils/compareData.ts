/**
 * Recursively checks if two objects are equal
 * @param a - The first object to compare
 * @param b - The second object to compare
 * @returns true if the objects are equal, false if not
 */
export function isEqual(a: any, b: any): boolean {
  if (a === b) return true;
  if (a === null || b === null) return false;
  if (typeof a !== "object" || typeof b !== "object") return false;
  const keysA = Object.keys(a);
  const keysB = Object.keys(b);
  if (keysA.length !== keysB.length) return false;
  for (const key of keysA) {
    if (!isEqual(a[key], b[key])) return false;
  }
  return true;
}
 