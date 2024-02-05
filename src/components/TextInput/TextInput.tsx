import { FC, InputHTMLAttributes, ReactNode } from "react";
import "./TextInput.scss";

interface iTextInput extends InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label?: string;
  className?: string;
  errors?: string[];
  children?: ReactNode;
  onlyDigits?: boolean;
};

export const TextInput: FC<iTextInput> = ({ id, label, className = "", errors, children, ...props }) => {

  return (
    <div className={`TextInput ${className}`}>
      {label && (
        <label
          htmlFor={id}
          className="TextInput-label">
          {label}
        </label>
      )}

      {children}
      
      <div className="TextInput-input-wrap">
        <input
          id={id}
          className="TextInput-input"
          {...props}
        />
        <div className="TextInput-errors">
          {errors?.map(err => err ? <span key={err} className="TextInput-error">{err}</span> : null)}
        </div>
      </div>
    </div>
  );
};
