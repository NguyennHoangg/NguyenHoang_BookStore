import { Link } from "react-router-dom";

interface NavLinkProps {
  to: string;
  label: string;
  active?: boolean;
  className?: string;
}

export default function NavLink({ to, label, active = false, className }: NavLinkProps) {
  return (
    <Link
      to={to}
      className={`text-label-md font-sans font-semibold tracking-wider uppercase transition-all duration-200 relative pb-1 ${
        active 
          ? "text-primary-container" 
          : "text-on-surface hover:text-primary-container"
      } ${className || ""}`}
    >
      {label}
      <span
        className={`absolute bottom-0 left-0 h-0.5 bg-primary-container transition-all duration-200 ${
          active ? "w-full" : "w-0 group-hover:w-full"
        }`}
      />
    </Link>
  );
}