import { iCurrencyOptions, iPasswordValidators, iPhoneValidators } from "./interfaces";

const regexps = {
  email: /^\w+([\.-_]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,7})+$/,
  UnicodeLetters: /[^\p{L}'`\s-]+/gmu,
  twoChars: /(\s){2,}|(`){2,}|('){2,}|(-){2,}/gm,
  onlyNumbers: /\D/g,
  password: {
    digits: /\d/gm,
    upperLetters: /\p{Lu}/gmu,
    lowerLetters: /\p{Ll}/gmu,
    chars: /[^\p{L}\d]/gmu,
  },
  currency: {
    sign: (value: string, sign?: string) => {
      if (!sign) return true;
      const singRegExp = reg.bind(null, `\\${sign}`);
      return singRegExp().test(value) && (value.match(singRegExp("g"))?.length ?? 0) === 1;
    },
    delimiter: (value: string, options: { sign?: string; length?: number }) => {
      const { sign, length = 2 } = options;
      if (!sign) return true;
      const delimiters = reg.bind(null, `\\${sign}`);
      const numbersAfter = value.match(reg(`\\${sign}\\d{1,}`))?.[0];
      const numbersOverflow = (numbersAfter?.replace(delimiters(), "").length ?? 99999) <= length;
      const integer = value.match(delimiters()) === null;
      const oneDelimiter = (value.match(delimiters("g"))?.length || 0) <= 1;
      return (integer || numbersOverflow) && oneDelimiter;
    },
  },
};

const reg = (...params: Parameters<typeof RegExp>) => new RegExp(...params);

const validatePassword = (value: string, keys: string[]) => keys.reduce((acc, key) => {
  const regExpression = regexps.password[key as keyof typeof regexps.password];
  const test = reg(regExpression).test(value);
  if (!test) acc.isValid = test;
  acc.results[key] = test;
  return acc;
}, { isValid: true, results: {} as any });

const validateCurrency = (value: string, entries: [string, any][]) => entries.reduce((acc, [key, args]) => {
  const fn = regexps.currency[key as keyof typeof regexps.currency];
  const test = fn(value, args);
  if (!test) acc.isValid = test;
  acc.results[key] = test;
  return acc;
}, { isValid: true, results: {} as any });

const length = (value: string, options = 8) =>
  ({ isValid: value.length <= options });

const email = (email: string) =>
  ({ isValid: !email.includes("@") ? { isValid: false } : reg(regexps.email, "u").test(email) });

const name = (value: string) =>
  ({ isValid: !reg(regexps.UnicodeLetters).test(value) && !reg(regexps.twoChars).test(value) && value.length >= 2 });

const phone = (value: string, options: iPhoneValidators) => {
  const clean = value.replace(reg(regexps.onlyNumbers), "");
  return { isValid: clean.length >= (options?.length || 10) };
};

const password = (value: string, options?: iPasswordValidators) => {
  const keys = Object.keys(options || {});
  const validation = validatePassword(value, keys)

  return {
    isValid: value.length >= (options?.length || 8) && validation.isValid,
    ...validation.results
  };
};

const currency = (value: string, options?: iCurrencyOptions) => {
  const entries = Object.entries(options || {});
  const { isValid, results } = validateCurrency(value, entries);
  return { isValid, ...results };
};

export const validators = { name, email, password, phone, currency, length, };