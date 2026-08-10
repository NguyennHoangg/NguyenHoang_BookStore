interface ButtonProps {
  children: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  className?: string;
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  loading?: boolean;
}

export default function Button({
  children,
  onClick,
  className,
  variant = "primary",
  size = "md",
  type = "submit",
  disabled = false,
  loading = false,
}: ButtonProps) {
  const base =
    "relative inline-flex items-center justify-center font-sans font-semibold uppercase tracking-widest transition-all duration-200 focus:outline-none disabled:opacity-40 disabled:cursor-not-allowed overflow-hidden group";

  const variants = {
    primary:
      "bg-primary-container text-on-primary hover:bg-primary active:scale-[0.98]",
    secondary:
      "bg-transparent border border-on-surface text-on-surface hover:bg-on-surface hover:text-surface active:scale-[0.98]",
    ghost:
      "bg-transparent text-on-surface-variant hover:text-on-surface underline-offset-4 hover:underline active:opacity-60",
  };

  const sizes = {
    sm: "px-4 py-2 text-label-sm",
    md: "px-6 py-3 text-label-md",
    lg: "px-8 py-4 text-label-lg",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${base} ${variants[variant]} ${sizes[size]} ${className || ""}`}
    >
      {/* Shimmer effect on hover */}
      <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none" />

      {loading ? (
        <span className="flex items-center gap-2">
          <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
          <span>Đang xử lý...</span>
        </span>
      ) : (
        children
      )}
    </button>
  );
}
