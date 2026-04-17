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
  return (
    <div className={`flex flex-col gap-2 ${className || ""}`}>
      {label && (
        <label className="text-label-md font-sans font-semibold uppercase tracking-wide text-on-surface-variant">
          {label}
        </label>
      )}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className="w-full px-4 py-3 bg-surface-container-low text-on-surface font-sans text-body-md  transition-all duration-200 focus:outline-none focus:border-primary-container disabled:opacity-50 disabled:cursor-not-allowed"
      />
      {error && (
        <span className="text-label-sm font-sans text-error">
          {error}
        </span>
      )}
    </div>
  );
}