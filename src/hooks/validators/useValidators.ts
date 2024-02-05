import { iValidators } from "./interfaces";
import { validators } from "./validators";

const texts = {
  name: "Please enter a valid name",
  email: "Please enter a valid email",
  password: "Please enter a valid password",
  phone: "Please enter a valid phone number",
  currency: "Please enter a valid number",
  length: ""
};

export const useValidators = (list?: iValidators | undefined) => {
  const keys = Object.entries(list || {});

  const builded = keys.map(([key, value]) => ({
    fn: validators[key as keyof typeof validators],
    msg: value?.msg || texts[key as keyof typeof texts],
    options: value?.options,
  }))

  const applyValidators = (value: string) => {
    const messages = [];
    for (const { fn, msg, options } of builded) {
      !fn(value, options).isValid && messages.push(msg);
    }
    return messages;
  }

  return {
    applyValidators,
    validators: builded,
    messages: builded?.map(({ msg }) => msg)
  };
};