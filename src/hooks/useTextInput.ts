import { ChangeEvent, useEffect, useState, FocusEvent, useRef } from "react";
import { tFilters, useFilters } from "./filters/useFilters";
import { useValidators } from "./validators/useValidators";
import { iValidators } from "./validators/interfaces";

export interface iUseTextInput {
  value?: string;
  filters?: tFilters;
  validators?: iValidators;
  errors?: string[];
  isValid?: boolean;
  isRequired?: boolean;
  equalTo?: string;
  errorsText?: {
    empty?: string;
    notEqual?: string;
  };
  validateOnChange?: boolean;
  onBlurCallback?: (e: FocusEvent<HTMLInputElement | HTMLTextAreaElement, Element>) => void;
  onFocusCallback?: (e: FocusEvent<HTMLInputElement | HTMLTextAreaElement, Element>) => void;
  onChangeCallback?: () => void;
};

export const useTextInput = ({
  equalTo,
  errors = [],
  errorsText,
  filters: filtersProps,
  isRequired = true,
  isValid = false,
  onBlurCallback,
  onChangeCallback,
  onFocusCallback,
  validateOnChange = false,
  validators: validatorsProps,
  value = ""
}: iUseTextInput = {}) => {
  const [inputValue, setInputValue] = useState(value);
  const [errorsList, setErrorsList] = useState(errors);

  const isDirty = useRef(false);
  const changeValidate = useRef(validateOnChange);
  const isValueRequired = useRef(isRequired);
  const isInputValid = useRef(isValid);

  const { messages, applyValidators } = useValidators(validatorsProps);
  const applyFilters = useFilters(filtersProps);

  const errList = {
    empty: "This field can't be empty",
    notEqual: "Don't match",
    ...errorsText
  };

  useEffect(() => {
    if (!inputValue) return;
    if (!changeValidate.current) return onChangeCallback?.();

    checkValidity();
    onChangeCallback?.();
  }, [inputValue]); // eslint-disable-line

  useEffect(() => {
    isValueRequired.current && isDirty.current && checkValidity();
    !isValueRequired.current && isDirty.current && errorsList.includes(errList.empty) && setErrorsList(errors.filter(err => err !== errList.empty));
  }, [isValueRequired.current]); // eslint-disable-line

  useEffect(() => {
    isDirty.current && checkValidity();
  }, [equalTo]); // eslint-disable-line

  const setIsDirty = (v: boolean) => isDirty.current = v;
  const setChangeValidate = (v: boolean) => changeValidate.current = v;
  const setIsValueRequired = (v: boolean) => isValueRequired.current = v;
  const setIsInputValid = (v: boolean) => isInputValid.current = v;

  const customErrors = () =>
    errorsList.filter(err => !messages.includes(err) && err !== errList.empty && err !== errList.notEqual);

  const setValueAndValidate = (val = "") => {
    setInputValue(val);
    setChangeValidate(true);
    checkValidity(val);
    setIsDirty(true);
  };

  const checkValidity = (value = inputValue) => {
    const errors = customErrors();
    
    if (!isValueRequired.current && !value) {
      setErrorsList(errors);
      setIsInputValid(true);
      return true;
    }
  
    const newErrors = [...applyValidators(inputValue), ...errors];

    if (!newErrors?.length && isValueRequired.current && !value)  newErrors.push(errList.empty);
    if (!!equalTo && value !== equalTo) newErrors.push(errList.notEqual);
    
    setErrorsList(newErrors);
    setIsInputValid(!newErrors?.length);
    return !newErrors?.length;
  };

  const onFocus = (e: FocusEvent<HTMLInputElement | HTMLTextAreaElement, Element>) => {
    onFocusCallback?.(e);
  };

  const onBlur = (e: FocusEvent<HTMLInputElement | HTMLTextAreaElement, Element>) => {
    if (isDirty.current && !changeValidate.current) {
      setChangeValidate(true);
      checkValidity();
    }

    if (!isDirty.current && e.target.value) setIsDirty(true);
    !!e.target.value && checkValidity();
    onBlurCallback?.(e);
  };

  const onChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setErrorsList(pv => pv.filter(item => !customErrors().includes(item)));
    setInputValue(applyFilters(e.target.value));
    isDirty.current && !!inputValue && checkValidity(e.target.value);
  };

  return {
    value: inputValue,
    setValue: setInputValue,

    errors: errorsList,
    setErrors: setErrorsList,

    isValid: isInputValid.current,
    setIsValid: setIsInputValid,

    isRequired: isValueRequired.current,
    setIsRequired: setIsValueRequired,

    isDirty: isDirty.current,
    setIsDirty,

    validateOnChange: changeValidate.current,
    setValidateOnChange: setChangeValidate,

    setValueAndValidate,
    checkValidity,
    onChange,
    onBlur,
    onFocus,

    inputProps: {
      value: inputValue,
      onChange,
      onBlur,
      onFocus
    }
  };
};
