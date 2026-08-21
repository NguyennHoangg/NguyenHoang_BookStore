interface CardProps {
  children: React.ReactNode;
  className?: string;
  elevated?: boolean;
  clickable?: boolean;
  onClick?: () => void;
  padding?: boolean;
}

export default function Card({
  children,
  className,
  elevated = false,
  clickable = false,
  onClick,
  padding = true,
}: CardProps) {
  const baseStyles = "rounded-none transition-all duration-300 overflow-hidden";
  const paddingStyles = padding ? "p-6" : "";
  
  const styles = elevated
    ? "bg-surface-container shadow-lg"
    : "bg-surface-container-low hover:bg-surface-container-highest hover:shadow-hover";

  const cursor = clickable || onClick ? "cursor-pointer hover:-translate-y-1" : "";

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (!onClick) return;

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onClick();
    }
  };

  return (
    <div
      onClick={onClick}
      onKeyDown={handleKeyDown}
      role={clickable || onClick ? "button" : undefined}
      tabIndex={clickable || onClick ? 0 : undefined}
      className={`${baseStyles} ${paddingStyles} ${styles} ${cursor} ${className || ""}`}
    >
      {children}
    </div>
  );
}