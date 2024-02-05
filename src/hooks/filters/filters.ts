const symbols = {
  dot: "."
};

const regexps = {
  unicodeName: /[^\p{L}'`\s-]+/gmu,
  nameSpaces: /(\s){2,}/gm,
  slug: /[\W]+/gi,
  digits: /\D/,
  unicodeNumbers: /[^\p{S}\d.,\s]/gu,
  fractions: /\^|(\.){2,}|(,){2,}|(\p{S}){2,}/gu,
  fractioned: /[^\d\.]/g,
  dot: /\./g,
  not_digit_dot: /[^\d.]+/g,
  profit: /[^\d\.\-]/g,
  secondDot: /(.*\..*)(\.)(\d*)/g,
  secondMinus: /(.+\-.*)/g,
};

const cash = (value: string) => {
  let filteredValue = value.replace(regexps.not_digit_dot, "");

  const dotCount = (filteredValue.match(/\./g) || []).length;
  if (dotCount > 1) {
    const firstDotIndex = filteredValue.indexOf(symbols.dot);
    const beforeFirstDot = filteredValue.slice(0, firstDotIndex);
    const afterFirstDot = filteredValue.slice(firstDotIndex + 1);
    filteredValue = `${beforeFirstDot}.${afterFirstDot.replace(regexps.dot, "")}`;
  }

  return filteredValue;
}

const profit = (value: string) => value.replace(regexps.profit, "")
  .replace(regexps.secondDot, (_, prev) => prev)
  .replace(regexps.secondMinus, substring => substring.slice(0, substring.length - 1));

export const filters = {
  name: (value: string): string => value.replace(regexps.unicodeName, "").replace(regexps.nameSpaces, " "),
  slug: (value: string): string => value.replace(regexps.slug, "-").toLowerCase(),
  phone: (value: string): string => value.replace(regexps.digits, ""),
  number: (value: string) => value.replace(regexps.unicodeNumbers, "").replace(regexps.fractions, "").replace(regexps.nameSpaces, " "),
  fractioned: (value: string) => value.replace(regexps.fractioned, ""),
  cash,
  profit,
};