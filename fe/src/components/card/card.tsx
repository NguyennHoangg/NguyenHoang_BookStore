interface CardProps {
  children: React.ReactNode;
  className?: string;
  elevated?: boolean;
  clickable?: boolean;
  onClick?: () => void;
}

export default function Card({
  children,
  className,
  elevated = false,
  clickable = false,
  onClick,
}: CardProps) {
  const baseStyles = "rounded-none transition-all duration-200 p-6";
  
  const styles = elevated
    ? "bg-surface-container shadow-lg"
    : "bg-surface-container-low hover:bg-surface-container-highest hover:shadow-hover";

  const cursor = clickable ? "cursor-pointer" : "";

  return (
    <div
      onClick={onClick}
      className={`${baseStyles} ${styles} ${cursor} ${className || ""}`}
    >
      {children}
    </div>
  );
}