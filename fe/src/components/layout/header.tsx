import { ShoppingCartIcon, UserIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";

export default function Header() {
  const navigate = useNavigate();

  const handleClickButton = (value: string) => {
    navigate(value);
  };

  return (
    <header className="glass-navbar border-b border-outline-variant border-opacity-10 sticky top-0 z-50">
      <div className="mx-auto flex items-center justify-between px-12">
        {/* Logo & Brand */}
        <div className="flex items-center gap-4">
          <img src="/logo.webp" alt="Bookstore Logo" className="h-[100px] w-auto" />
          <div className="flex flex-col">
         
            <h3 className="text-headline-sm font-serif text-primary-container">
              NguyenHoang_BookStore
            </h3>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex mx-20">
          <ul className="flex gap-12 items-center">
            <li>
              <a
                href="/"
                className="nav-link"
              >
                Home
              </a>
            </li>
            <li>
              <a
                href="/books"
                className="nav-link"
              >
                Books
              </a>
            </li>
            <li>
              <a
                href="#about"
                className="nav-link"
              >
                About
              </a>
            </li>
            <li>
              <a
                href="#contact"
                className="nav-link"
              >
                Contact
              </a>
            </li>
          </ul>
        </nav>

        {/* Action Buttons */}
        <div className="flex gap-6 items-center">
          <button
            onClick={() => handleClickButton("/cart")}
            className="p-2 text-on-surface hover:text-primary-container transition-colors duration-200 hover:bg-surface-container-low rounded-none"
            title="Shopping Cart"
            aria-label="Shopping Cart"
          >
            <ShoppingCartIcon className="h-6 w-6 stroke-2" />
          </button>
          <button
            onClick={() => handleClickButton("/account")}
            className="p-2 text-on-surface hover:text-primary-container transition-colors duration-200 hover:bg-surface-container-low rounded-none"
            title="Account"
            aria-label="Account"
          >
            <UserIcon className="h-6 w-6 stroke-2" />
          </button>
        </div>
      </div>
    </header>
  );
}
