import classNames from "classnames";
import { type HTMLInputTypeAttribute } from "react";
import {
  type FieldErrors,
  type FieldValues,
  type Path,
  type UseFormRegister,
} from "react-hook-form";

export function InputWithLabel<Schema extends FieldValues>({
  placeholder,
  type,
  register,
  name,
  label,
  required,
  errors,
  textarea,
}: {
  placeholder?: string;
  label: string;
  name: Path<Schema>;
  errors: FieldErrors<Schema>;
  register: UseFormRegister<Schema>;
  type?: HTMLInputTypeAttribute;
  required?: boolean;
  textarea?: boolean;
}) {
  const errorMessage = errors?.[name]?.message?.toString();

  const styles = classNames({
    "w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 outline-none focus:border-blue-500 focus:ring-blue-500":
      true,
    "resize-none h-40": textarea,
  });
  return (
    <div className="w-full">
      <label
        className="mb-2 block text-sm font-medium text-gray-900"
        htmlFor={name}
      >
        {label}
      </label>
      {textarea ? (
        <textarea
          className={styles}
          placeholder={placeholder}
          required={required}
          {...register(name)}
        />
      ) : (
        <input
          type={type}
          className={styles}
          placeholder={placeholder}
          required={required}
          {...register(name)}
        />
      )}
      {Boolean(errorMessage) && <ErrorText message={errorMessage} />}
    </div>
  );
}

function ErrorText(props: { message?: string }) {
  return <p className="text-xs text-red-500">{props.message}</p>;
}
