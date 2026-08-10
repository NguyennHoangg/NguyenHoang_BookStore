import { Link } from "react-router-dom";

interface CuratorNavItem {
  to: string;
  label: string;
  active?: boolean;
}

interface CuratorNavigationProps {
  items: CuratorNavItem[];
  className?: string;
}

export default function CuratorNavigation({ items, className }: CuratorNavigationProps) {
  return (
    <nav className={`flex flex-col gap-6 ${className || ""}`}>
      {items.map((item) => (
        <Link
          key={item.to}
          to={item.to}
          className={`flex items-center gap-3 text-label-md font-sans font-semibold tracking-wider uppercase transition-all duration-200 ${
            item.active
              ? "text-primary-container"
              : "text-on-surface hover:text-primary-container"
          }`}
        >
          {item.active && (
            <span className="text-2xl leading-none text-primary-container">•</span>
          )}
          {!item.active && <span className="w-2" />}
          {item.label}
        </Link>
      ))}
    </nav>
  );
}