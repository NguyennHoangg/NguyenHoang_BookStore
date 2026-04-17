interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  variant?: "primary" | "secondary";
  size?: "sm" | "md" | "lg";
}

export default function Button({
  children,
  onClick,
  className,
  variant = "primary",
  size = "md",
}: ButtonProps) {
  const baseStyles = "font-sans font-semibold uppercase tracking-wider transition-all duration-200 border-none cursor-pointer rounded-none focus:outline-offset-2";
  
  const variants = {
    primary: "bg-primary-container text-on-primary hover:bg-primary hover:shadow-hover hover:translate-y-[-2px] active:translate-y-0",
    secondary: "bg-transparent border text-on-surface hover:opacity-30" + " border-outline-variant opacity-20"
  };

  const sizes = {
    sm: "px-3 py-2 text-label-sm",
    md: "px-5 py-3 text-label-md",
    lg: "px-6 py-4 text-body-md"
  };

  return (
    <button
      onClick={onClick}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className || ""}`}
    >
      {children}
    </button>
  );
}
