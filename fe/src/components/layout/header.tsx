import { useState } from "react";
import {
  ShoppingCartIcon,
  UserIcon,
  MagnifyingGlassIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

export default function Header() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleClickButton = (value: string) => {
    navigate(value);
    setMenuOpen(false);
  };

  return (
    <header className="glass-navbar sticky top-0 z-50 bg-surface border-b border-black">
      <div className="mx-auto flex items-center justify-between px-4 md:px-8 lg:px-12">
        {/* Logo & Brand */}
        <div className="flex items-center gap-2 md:gap-4">
          <img src="/logo.webp" alt="Bookstore Logo" className="h-[60px] md:h-[80px] lg:h-[100px] w-auto" />
          <div className="flex flex-col">
            <h3 className="text-xs md:text-sm lg:text-headline-sm font-serif text-primary-container leading-tight">
              NguyenHoang_BookStore
            </h3>
          </div>
        </div>

        {/* Navigation Links – desktop only */}
        <nav className="hidden lg:flex mx-10 xl:mx-20">
          <ul className="flex gap-8 xl:gap-12 items-center">
            <li><a href="/" className="nav-link">Home</a></li>
            <li><a href="/books" className="nav-link">Books</a></li>
            <li><a href="#about" className="nav-link">About</a></li>
            <li><a href="#contact" className="nav-link">Contact</a></li>
          </ul>
        </nav>

        {/* Search Bar – desktop only */}
        <div className="hidden lg:flex items-end">
          <div className="relative">
            <input
              type="text"
              placeholder="Tìm kiếm tác phẩm..."
              className="w-56 xl:w-80 rounded-md px-4 py-2 bg-gray-100 hover:border-none focus:outline-none outline-none focus:ring-0"
            />
            <button
              onClick={() => handleClickButton("/search")}
              className="absolute right-2 top-1/2 transform -translate-y-1/2"
            >
              <MagnifyingGlassIcon className="h-4 w-4 stroke-2 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Action Icons */}
        <div className="flex gap-1 md:gap-3 items-center">
          {/* Search icon – mobile/tablet only */}
          <button
            onClick={() => handleClickButton("/search")}
            className="lg:hidden p-2 text-on-surface hover:text-primary-container transition-colors duration-200"
            aria-label="Search"
          >
            <MagnifyingGlassIcon className="h-5 w-5 stroke-2" />
          </button>

          <button
            onClick={() => handleClickButton("/cart")}
            className="p-2 text-on-surface hover:text-primary-container transition-colors duration-200 hover:bg-surface-container-low rounded-none"
            title="Shopping Cart"
            aria-label="Shopping Cart"
          >
            <ShoppingCartIcon className="h-5 md:h-6 w-5 md:w-6 stroke-2" />
          </button>

          <button
            onClick={() => handleClickButton("/account")}
            className="flex items-center gap-2 p-2 text-on-surface hover:text-primary-container transition-colors duration-200 hover:bg-surface-container-low rounded-none"
            title="Account"
            aria-label="Account"
          >
            <UserIcon className="h-5 md:h-6 w-5 md:w-6 stroke-2" />
            {user && (
              <span className="hidden md:inline text-body-sm font-sans text-black">
                {user.fullName}
              </span>
            )}
          </button>

          {/* Hamburger – mobile/tablet only */}
          <button
            className="lg:hidden p-2 text-on-surface"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? (
              <XMarkIcon className="h-6 w-6 stroke-2" />
            ) : (
              <Bars3Icon className="h-6 w-6 stroke-2" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <div className="lg:hidden bg-surface border-t border-black/10 px-4 py-4 flex flex-col gap-1">
          {/* Mobile Search */}
          <div className="relative mb-3">
            <input
              type="text"
              placeholder="Tìm kiếm tác phẩm..."
              className="w-full rounded-md px-4 py-2 bg-gray-100 focus:outline-none"
            />
            <button
              onClick={() => handleClickButton("/search")}
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              <MagnifyingGlassIcon className="h-4 w-4 text-gray-500" />
            </button>
          </div>

          {[
            { label: "Home", href: "/" },
            { label: "Books", href: "/books" },
            { label: "About", href: "#about" },
            { label: "Contact", href: "#contact" },
          ].map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={() => setMenuOpen(false)}
              className="py-3 px-2 text-sm font-medium text-on-surface border-b border-outline-variant/30 hover:text-primary-container transition-colors"
            >
              {item.label}
            </a>
          ))}
        </div>
      )}
    </header>
  );
}
