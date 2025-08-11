export const deepEquals = (a: any, b: any): boolean => {
  if (a === b) return true;
  
  if (a instanceof Date && b instanceof Date) {
    return a.getTime() === b.getTime();
  }
  
  if (!a || !b || (typeof a !== 'object') || (typeof b !== 'object')) {
    return a === b;
  }
  
  if (Array.isArray(a) !== Array.isArray(b)) return false;
  
  const keysA = Object.keys(a);
  const keysB = Object.keys(b);
  
  if (keysA.length !== keysB.length) return false;
  
  for (const key of keysA) {
    if (!keysB.includes(key)) return false;
    if (!deepEquals(a[key], b[key])) return false;
  }
  
  return true;
};

export const isNumber = (value: any): value is number => {
  return typeof value === 'number' && !isNaN(value);
};