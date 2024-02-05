const spacesFormatter = (options: Intl.NumberFormatOptions = {}, value: number | string) =>
  new Intl.NumberFormat("fi-FI", options).format(Number(value));

const regexps = {
  endDot: /\.$/,
  fraction: /\.\d+$/,
  exceptDigits: /[^\d\.]/g,
  secondDot: /(.*\..*)(\.)(\d*)/g,
};

const symbols = {
  dot: ".",
};

const formatter = spacesFormatter.bind(null, { maximumFractionDigits: 20 });

function parseString(value: string) {
  if (!value) return "";

  const [significant, zeros = ""] = value.split(symbols.dot);
  const parsed = formatter(significant);
  const fraction = (zeros ? symbols.dot + zeros : "");
  const result = parsed + fraction;

  if (value.match(regexps.endDot)) return parsed + symbols.dot;
  return result;
}

function unParseString(value: string) {
  if (value === symbols.dot) return "0" + value;
  return value
    ?.replace(regexps.exceptDigits, "")
    ?.replace(regexps.secondDot, (_, prev) => prev);
}

export const spacesMask = (value: string) => parseString(unParseString(value));
spacesMask.unParseString = unParseString;