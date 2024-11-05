/**
 * check str passed in is a string type of not
 * @param str obj to be checked
 * @returns boolean
 */
export function isString(str: any): boolean {
  return {}.toString.call(str) === '[object String]';
}
