export interface iCurrencyOptions {
  sign?: string;
  delimiter?: { sign: string, length?: number };
};

export interface iPasswordValidators {
  digits?: boolean;
  upperLetters?: boolean;
  lowerLetters?: boolean;
  chars?: boolean;
  length?: number;
};

export interface iPhoneValidators {
  length?: number;
};

export interface iValidators {
  password?: {
    msg?: string;
    options?: iPasswordValidators;
  };
  phone?: {
    msg?: string;
    options?: iPhoneValidators;
  };
  currency?: {
    msg?: string;
    options?: iCurrencyOptions;
  };
  name?: {
    msg?: string;
    options?: never;
  };
  email?: {
    msg?: string;
    options?: never;
  };
  length?: {
    msg?: string;
    options?: number;
  }
};