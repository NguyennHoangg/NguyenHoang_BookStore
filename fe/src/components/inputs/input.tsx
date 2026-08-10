import { useId } from "react";

interface InputProps {
  label?: string;
  placeholder?: string;
  type?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  disabled?: boolean;
  className?: string;
}

export default function Input({
  label,
  placeholder,
  type = "text",
  value,
  onChange,
  error,
  disabled = false,
  className,
}: InputProps) {
  const id = useId();

  return (
    <div className={`flex flex-col gap-1 ${className || ""}`}>
      {label && (
        <label
          htmlFor={id}
          className="font-sans text-body-sm font-semibold text-on-surface"
        >
          {label}
        </label>
      )}
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`
          w-full px-4 py-3 rounded-md bg-white font-sans text-body-md text-on-surface
          border transition-all duration-150 focus:outline-none
          disabled:opacity-40 disabled:cursor-not-allowed
          ${error
            ? "border-error focus:border-error"
            : "border-outline-variant focus:border-on-surface"
          }
        `}
      />
      {error && (
        <span className="font-sans text-label-sm text-error">{error}</span>
      )}
    </div>
  );
}