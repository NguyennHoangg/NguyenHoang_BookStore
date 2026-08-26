import { useState } from "react";
import Header from "../../components/layout/header";
import Footer from "../../components/layout/footer";
import Button from "../../components/button/button";
import { NotificationModal } from "../../components/modals/notificationModal";
import formatPrice from "../../utils/format";
import useBook from "../../hooks/useBook";
import useUser from "../../hooks/useUser";
import { useNavigate } from "react-router-dom";
import { BookCard } from "../../components";
import Skeleton from "../../utils/Skeleton";
import ErrorPage from "../ErrorPage";

type NotifState = { message: string; type: "success" | "error" } | null;

export default function HomePage() {
  const [notif, setNotif] = useState<NotifState>(null);

  const { newBooks , loading, topSellingLoading, error, topSellingBooks } =
    useBook();
  const {reviews } = useUser();
  const navigate = useNavigate();

  const handleClickBook = (bookUrl: string) => {
    const normalizedUrl = bookUrl.replace(/^\/+/, "");
    navigate(`/book/${normalizedUrl}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] font-sans text-gray-800 relative">
        <Header />

        <main>
          <section className="relative h-screen min-h-[500px] bg-slate-900 text-white flex items-center overflow-hidden">
            <div className="container mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-12 gap-8 relative z-10">
              <div className="md:col-span-6 flex flex-col justify-center space-y-5">
                <Skeleton className="h-3 w-48 bg-white/20" />
                <Skeleton className="h-16 md:h-20 w-11/12 bg-white/20" />
                <Skeleton className="h-4 w-4/5 bg-white/20" />
                <div className="flex gap-3 pt-2">
                  <Skeleton className="h-10 md:h-12 w-32 md:w-40 bg-white/20" />
                  <Skeleton className="h-10 md:h-12 w-36 md:w-44 bg-white/20" />
                </div>
              </div>
              <div className="hidden md:flex md:col-span-6 relative justify-center items-center">
                <Skeleton className="w-[300px] md:w-[520px] h-[400px] md:h-[720px] bg-white/20" />
                <Skeleton className="absolute bottom-10 left-10 h-28 w-64 bg-white/30" />
              </div>
            </div>
          </section>

          <section className="bg-[#F5F2EB] py-24">
            <div className="container mx-auto px-8">
              <div className="flex justify-between items-end mb-12">
                <div className="space-y-3">
                  <Skeleton className="h-3 w-40" />
                  <Skeleton className="h-10 w-60" />
                </div>
                <Skeleton className="h-4 w-20" />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-4 md:gap-x-8 gap-y-8 md:gap-y-12 items-stretch">
                {Array.from({ length: 8 }).map((_, index) => (
                  <div key={`book-loading-${index}`} className="space-y-4">
                    <Skeleton className="aspect-[2/3] w-full" />
                    <Skeleton className="h-7 w-4/5" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-6 w-2/5" />
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="container mx-auto px-4 md:px-8 py-16 md:py-32">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-20 items-center">
              <div className="relative pl-0 md:pl-10">
                <Skeleton className="aspect-[3/4] w-4/5" />
                <Skeleton className="hidden md:block absolute top-1/2 right-0 transform -translate-y-1/2 h-64 w-80" />
              </div>
              <div className="pr-0 md:pr-10 space-y-5">
                <Skeleton className="h-3 w-40" />
                <Skeleton className="h-14 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <div className="space-y-5 pt-4">
                  {Array.from({ length: 4 }).map((_, index) => (
                    <Skeleton
                      key={`top-loading-${index}`}
                      className="h-14 w-full"
                    />
                  ))}
                </div>
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    );
  }

  if (error) {
    return <ErrorPage />;
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7] font-sans text-gray-800">
      <Header />

      <main>
        {/* 2. HERO SECTION */}
        <section className="relative bg-[url('/homepage.webp')] bg-cover bg-center min-h-[calc(100vh-60px)] md:min-h-[calc(100vh-80px)] lg:min-h-[calc(100vh-100px)] bg-slate-900 text-white flex items-center overflow-hidden">
          {/* Dải chữ Banner trên cùng */}
          <div className="absolute top-4 md:top-8 w-full z-10 text-center tracking-[0.2em] text-[10px] md:text-xs text-white/50 uppercase border-b border-white/10 pb-3 md:pb-4">
            The Arcanum Rare Books & Manuscripts
          </div>

          <div className="container mx-auto px-5 md:px-8 grid grid-cols-1 md:grid-cols-12 gap-8 relative z-10 py-8 md:py-0">
            {/* Cột trái: Nội dung */}
            <div className="md:col-span-6 flex flex-col justify-center">
              <p className="text-xs tracking-[0.2em] uppercase text-white/50 mb-4">
                Khám phá tri thức mới
              </p>
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[80px] font-serif mb-5 md:mb-6 leading-[1.1] text-emerald-50">
                <span className="italic">The Silent</span>
                <br />
                Language of
                <br />
                Books
              </h1>
              <p className="mb-8 md:mb-10 text-white/70 max-w-md text-sm leading-relaxed">
                Khám phá những ấn bản quý hiếm và bản thảo mang theo trí tuệ của
                thời đại, được bảo quản cẩn thận...
              </p>
              <div className="flex flex-wrap gap-3 md:gap-4">
                <Button
                  variant="primary"
                  className="bg-[#2A4B41] border-[#2A4B41] text-white hover:bg-opacity-90"
                >
                  Khám phá ngay
                </Button>
                <Button
                  variant="secondary"
                  className="bg-[#111] border-[#111] text-gray-900 hover:bg-opacity-90"
                >
                  Xem bộ sưu tập
                </Button>
              </div>
            </div>

            {/* Cột phải: Khối hình ảnh – ẩn trên mobile */}
            <div className="hidden md:flex md:col-span-6 relative justify-center items-center">
              {/* Khối chữ nhật giả lập cuốn sách 3D */}
              <div
                className="w-[320px] lg:w-[520px] h-[440px] lg:h-[720px] bg-[#111] shadow-2xl border border-white/10 overflow-hidden"
                style={{
                  transform:
                    "perspective(1200px) rotateY(-15deg) rotateX(4deg)",
                  transformOrigin: "center center",
                }}
              >
                <img
                  src={newBooks[2]?.imageurl || "/default-book.jpg"}
                  alt={newBooks[2]?.title || "Book cover"}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Thẻ nổi (Floating Card) */}
              <div className="absolute bottom-10 left-10 bg-white/90 backdrop-blur-sm text-black p-4 shadow-xl flex gap-4 items-center">
                <div className="w-12 h-16 bg-gray-300"></div>
                <div className="pr-4">
                  <p className="text-[10px] uppercase tracking-wider text-gray-500 mb-1">
                    Lựa chọn của biên tập viên
                  </p>
                  <p className="font-serif italic font-bold text-sm mb-0.5">
                    {newBooks[2]?.title}
                  </p>
                  <p className="text-[10px] text-gray-500">
                    Bởi {newBooks[2]?.author}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. CATEGORY SECTION */}
        <section className="container mx-auto px-4 sm:px-8 md:px-12 lg:px-20 py-12 md:py-24">
          <h2 className="text-2xl md:text-3xl font-serif italic mb-6 md:mb-10 text-[#2A4B41]">
            Danh mục sách
          </h2>

          {/* Desktop grid */}
          <div className="hidden md:grid grid-cols-12 grid-rows-2 gap-6 h-[500px] lg:h-[600px]">
            {/* Khối lớn bên trái */}
            <a
              href="/category"
              className="col-span-6 row-span-2 bg-gray-700 relative overflow-hidden flex items-end p-6 lg:p-8 text-white group cursor-pointer hover:opacity-95 transition-all rounded-xl"
            >
              <img
                src="/Fiction.webp"
                alt="Literature"
                className="absolute inset-0 w-full h-full object-cover object-center opacity-80"
              />
              <span className="relative z-10 text-xl lg:text-2xl font-serif italic">
                Văn học & Tiểu thuyết
              </span>
            </a>
            {/* Hai khối nhỏ bên phải */}
            <div className="col-span-3 row-span-1 rounded-md bg-[#F6D8CE] relative overflow-hidden flex items-end p-6 lg:p-8 text-gray-900 group cursor-pointer hover:opacity-90 transition-all">
              <img
                src="/Philosophy.webp"
                alt="Philosophy"
                className="absolute inset-0 w-full h-full object-cover object-center opacity-80"
              />
              <span className="relative z-10 text-xl lg:text-2xl font-serif italic">Triết lý</span>
            </div>
            <div className="col-span-3 row-span-1 rounded-md bg-[#1A362D] text-white relative overflow-hidden flex items-end p-6 lg:p-8 group cursor-pointer hover:opacity-90 transition-all">
              <img
                src="/Technology.webp"
                alt="Science"
                className="absolute inset-0 w-full h-full object-cover object-center opacity-80"
              />
              <span className="relative z-10 text-xl lg:text-2xl font-serif italic">Khoa học & Công nghệ</span>
            </div>
            <div className="col-span-6 row-span-1 bg-[#E5E0D8] flex items-center justify-center cursor-pointer hover:bg-[#dcd6ce] transition-colors rounded-xl">
              <p className="text-[#2A4B41] font-serif italic text-lg">
                Khám phá thêm các danh mục khác →
              </p>
            </div>
          </div>

          {/* Mobile grid */}
          <div className="md:hidden flex flex-col gap-4">
            <a
              href="/category"
              className="h-52 bg-gray-700 relative overflow-hidden flex items-end p-5 text-white rounded-xl"
            >
              <img src="/Fiction.webp" alt="Literature" className="absolute inset-0 w-full h-full object-cover opacity-80" />
              <span className="relative z-10 text-xl font-serif italic">Văn học & Tiểu thuyết</span>
            </a>
            <div className="grid grid-cols-2 gap-4">
              <div className="h-36 rounded-md bg-[#F6D8CE] relative overflow-hidden flex items-end p-4 text-gray-900">
                <img src="/Philosophy.webp" alt="Philosophy" className="absolute inset-0 w-full h-full object-cover opacity-80" />
                <span className="relative z-10 text-base font-serif italic">Triết lý</span>
              </div>
              <div className="h-36 rounded-md bg-[#1A362D] text-white relative overflow-hidden flex items-end p-4">
                <img src="/Technology.webp" alt="Science" className="absolute inset-0 w-full h-full object-cover opacity-80" />
                <span className="relative z-10 text-base font-serif italic">Khoa học</span>
              </div>
            </div>
            <div className="h-16 bg-[#E5E0D8] flex items-center justify-center rounded-xl">
              <p className="text-[#2A4B41] font-serif italic text-sm">Khám phá thêm →</p>
            </div>
          </div>
        </section>

        {/* 4. NEW ARRIVALS */}
        <section className="bg-[#F5F2EB] py-24">
          <div className="container mx-auto px-8">
            <div className="flex justify-between items-end mb-12">
              <div>
                <p className="text-xs tracking-[0.2em] uppercase text-gray-500 mb-2">
                  Hàng mới cập bến
                </p>
                <h2 className="text-4xl font-serif italic text-[#2A4B41]">
                  Sách mới về
                </h2>
              </div>
              <a
                href="#"
                className="text-xs tracking-widest uppercase border-b border-black pb-1 font-semibold"
              >
                Xem tất cả
              </a>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-4 md:gap-x-8 gap-y-8 md:gap-y-12 items-stretch">
              {newBooks.map((book) => (
                <BookCard
                  key={book.bookid}
                  book={book}
                  onClick={() => handleClickBook(book.url)}
                />
              ))}
            </div>
          </div>
        </section>

        {/* 5. BEST SELLERS */}
        <section className="container mx-auto px-4 md:px-8 py-16 md:py-32">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-20 items-center">
            {/* Bên trái: Ảnh + Thẻ nổi đè */}
            <div className="relative pl-0 md:pl-10">
              <div className="aspect-[3/4] bg-[#222] shadow-2xl w-4/5 overflow-hidden">
                <img
                  src={
                    topSellingBooks[0]?.imageurl ||
                    newBooks[0]?.imageurl ||
                    "/default-book.jpg"
                  }
                  alt={
                    topSellingBooks[0]?.title ||
                    newBooks[0]?.title ||
                    "Best seller cover"
                  }
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Thẻ nổi – desktop only */}
              <div className="hidden md:block absolute top-1/2 right-0 transform -translate-y-1/2 bg-[#FDFBF7] p-6 lg:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.1)] w-56 lg:w-80">
                <p className="text-xs tracking-widest uppercase text-gray-500 mb-3">
                  Tác giả {topSellingBooks[0]?.author || "Đang cập nhật"}
                </p>
                <h3 className="font-serif italic text-xl lg:text-3xl mb-4 text-[#2A4B41]">
                  {topSellingBooks[0]?.title || "Sách bán chạy nhất"}
                </h3>

                <div className="flex justify-between items-center border-t border-gray-200 pt-4 lg:pt-6">
                  <span className="font-bold text-base lg:text-lg">
                    {topSellingBooks[0]
                      ? formatPrice(topSellingBooks[0].price)
                      : "..."}
                  </span>
                  <Button
                    variant="primary"
                    className="bg-[#2A4B41] border-[#2A4B41] text-white py-2 text-sm hover:bg-opacity-90"
                  >
                    Mua ngay
                  </Button>
                </div>
              </div>

              {/* Mobile inline card */}
              <div className="md:hidden mt-4 bg-[#FDFBF7] p-4 shadow-md">
                <p className="text-xs tracking-widest uppercase text-gray-500 mb-1">
                  Tác giả {topSellingBooks[0]?.author || "Đang cập nhật"}
                </p>
                <h3 className="font-serif italic text-xl mb-3 text-[#2A4B41]">
                  {topSellingBooks[0]?.title || "Sách bán chạy nhất"}
                </h3>
                <div className="flex justify-between items-center border-t border-gray-200 pt-3">
                  <span className="font-bold">
                    {topSellingBooks[0] ? formatPrice(topSellingBooks[0].price) : "..."}
                  </span>
                  <Button variant="primary" className="bg-[#2A4B41] border-[#2A4B41] text-white py-1.5 text-sm">
                    Mua ngay
                  </Button>
                </div>
              </div>
            </div>

            {/* Bên phải: Danh sách xếp hạng */}
            <div className="pr-0 md:pr-10">
              <p className="text-xs tracking-[0.2em] uppercase text-gray-500 mb-3">
                Được yêu thích nhất
              </p>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif mb-6 md:mb-8 text-[#2A4B41] leading-tight">
                Sách bán chạy
                <br />
                nhất hệ thống
              </h2>
              <p className="text-gray-600 mb-8 md:mb-12 leading-relaxed text-sm md:text-base">
                Khám phá những tựa sách đang làm mưa làm gió trong cộng đồng độc
                giả. Từ văn học kinh điển đến sách kỹ năng...
              </p>

              {topSellingLoading ? (
                <div className="space-y-5 pt-2">
                  {Array.from({ length: 4 }).map((_, index) => (
                    <Skeleton
                      key={`top-selling-skeleton-${index}`}
                      className="h-16 w-full"
                    />
                  ))}
                </div>
              ) : (
                <ul className="space-y-5 md:space-y-8">
                  {topSellingBooks.map((book, index) => (
                    <li
                      key={book.bookid}
                      className="flex items-center gap-4 md:gap-8 border-b border-gray-200 pb-4 md:pb-6 group cursor-pointer"
                    >
                      <span className="text-3xl md:text-5xl font-light text-gray-300 italic font-serif group-hover:text-[#2A4B41] transition-colors shrink-0">
                        {(index + 1).toString().padStart(2, "0")}
                      </span>
                      <div>
                        <h4 className="font-serif text-base md:text-xl font-bold mb-1 group-hover:text-[#2A4B41] transition-colors">
                          {book.title}
                        </h4>
                        <p className="text-sm text-gray-500">{book.author}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </section>

        {/* 6. TESTIMONIALS */}
        <section className="bg-[#1A362D] text-white py-24">
          <div className="container mx-auto px-8">
            <p className="text-center text-xs tracking-[0.2em] uppercase text-white/50 mb-3">
              Đánh giá từ độc giả
            </p>
            <h2 className="text-center text-4xl font-serif italic mb-16 text-emerald-50">
              Trải nghiệm từ những người yêu sách
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-8">
              {reviews.map((review) => (
                <div
                  key={review.reviewid}
                  className="bg-white/5 p-6 md:p-10 border border-white/10 hover:bg-white/10 transition-colors"
                >
                  <div className="text-[#F6D8CE] mb-4 md:mb-6 text-xl tracking-widest">
                    {Array.from({ length: review.rating }).map((_, index) => (
                      <span key={index}>★</span>
                    ))}
                  </div>
                  <p className="text-white/80 leading-relaxed mb-6 md:mb-8">
                    {review.comment}
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/20 shrink-0"></div>
                    <div>
                      <p className="font-serif font-bold text-emerald-50">
                        Độc giả {review.fullname}
                      </p>
                      <p className="text-xs text-white/50 uppercase tracking-wider mt-1">
                        {review.role}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />

      {notif && (
        <NotificationModal
          message={notif.message}
          type={notif.type}
          onClose={() => setNotif(null)}
        />
      )}
    </div>
  );
}
