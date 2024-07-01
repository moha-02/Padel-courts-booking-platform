import React from "react";
import { UseFormRegister } from "react-hook-form";

interface Errors {
  [key: string]: any;
}

interface InputProps {
  id?: string;
  name?: string;
  value?: string | number;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  type: string;
  placeholder: string;
  label: string;
  visualLabel?: string;
  disabled?: boolean;
  register: UseFormRegister<any>;
  errors?: Errors;
  required?: boolean;
  minLength?: number;
  pattern?: string;
}

export default function Input({
  id,
  name,
  value,
  type,
  visualLabel,
  onChange,
  label,
  placeholder,
  disabled,
  register,
  errors,
  required,
  minLength,
  pattern,
  ...props
}: InputProps) {

  let patternOptions;

  if (pattern === "phone") {
    patternOptions = {
      value: /^[0-9]{9}$/i,
      message: `El formato del teléfono no es válido`,
    };
  } else if (pattern === "email") {
    patternOptions = {
      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
      message: `El formato del email no es válido`,
    };
  }

  return (
    <>
      <label
        className={`block ml-2 mt-4  text-sm font-medium  text-gray-300 ${
          errors && errors[label] && "text-red-600"
        }`}
      >
        {visualLabel}
      </label>
      <input
        {...register(label, {
          required: {
            value: required ? required : true,
            message: `Este campo es requerido`,
          },
          minLength: {
            value: minLength ? minLength : 0,
            message: `Este campo debe tener al menos ${minLength} caracteres`,
          },
          pattern: patternOptions,
          onChange,
          disabled,
        })}
        value={value}
        type={type}
        className={`border-gray-300  focus:border-padel-green border-b-2 focus:border-b-2 text-gray-900 text-sm block w-full p-2.5 focus:outline-none focus:transition focus:duration-300 focus:ease-in-out ${
          errors && errors[label] && "bg-red-100"
        }`}
        placeholder={placeholder}
      />
      {errors && errors[label] && (
        <p className="text-red-500">{errors[label].message}</p>
      )}
    </>
  );
}
