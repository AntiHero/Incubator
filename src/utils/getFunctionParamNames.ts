export function getFunctionParamNames<T extends (...args: any) => any>(
  fn: T
): string[] {
  return fn
    .toString()
    .replace(/[/][/].*$/gm, '')
    .replace(/\s+/g, '')
    .replace(/[/][*][^/*]*[*][/]/g, '')
    .split('){', 1)[0]
    .replace(/^[^(]*[(]/, '')
    .replace(/=[^,]+/g, '')
    .split(',')
    .filter(Boolean);
}
