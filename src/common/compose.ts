export const compose = (...args: Function[]) => (value: any) => {
  if (!args.length) return value;
  let result = value;
  for (const fn of args) result = fn(result);
  return result;
};