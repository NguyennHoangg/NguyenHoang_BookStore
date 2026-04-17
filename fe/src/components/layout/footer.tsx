export default function Footer() {
  const handleMouseEnter = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.currentTarget.style.color = "#FBF9F5";
    e.currentTarget.style.textDecoration = "underline";
    e.currentTarget.style.transform = "translateY(-2px)";
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.currentTarget.style.color = "#FBF9F5";
    e.currentTarget.style.textDecoration = "none";
    e.currentTarget.style.transform = "translateY(0)";
  };

  return (
    <footer className="gradient-archive text-white">
      <div className="mx-auto px-8 py-12 max-w-7xl">
        <div className="flex items-start justify-between">
          {/* Left Section */}
          <div className="flex flex-col">
            <h3 className="font-serif text-xl font-bold mb-2 text-white">
              NguyenHoang_BookStore
            </h3>
            <p className="text-sm opacity-80">
              © 2024 NGUYENHOANG_BOOKSTORE. AN ARCHIVE OF FINE LITERATURE.
            </p>
          </div>

          {/* Right Section - Links */}
          <nav>
            <ul className="flex gap-8">
              <li>
                <a
                  href="#privacy"
                  className="text-xs font-bold tracking-widest transition-all text-white"
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                >
                  PRIVACY POLICY
                </a>
              </li>
              <li>
                <a
                  href="#terms"
                  className="text-xs font-bold tracking-widest transition-all text-white"
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                >
                  TERMS OF SERVICE
                </a>
              </li>
              <li>
                <a
                  href="#shipping"
                  className="text-xs font-bold tracking-widest transition-all text-white"
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                >
                  SHIPPING INFO
                </a>
              </li>
              <li>
                <a
                  href="#returns"
                  className="text-xs font-bold tracking-widest transition-all text-white"
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                >
                  RETURNS
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </footer>
  );
}