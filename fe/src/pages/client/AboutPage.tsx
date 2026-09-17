import { useEffect, useRef } from "react";
import Header from "../../components/layout/header";
import Footer from "../../components/layout/footer";
import { useNavigate } from "react-router-dom";

export default function AboutPage() {
  const navigate = useNavigate();
  const parallaxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (parallaxRef.current) {
        parallaxRef.current.style.transform = `translateY(${window.scrollY * 0.15}px)`;
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#FDFBF7] font-sans text-gray-800">
      <Header />

      <main>
        {/* ── HERO ── */}
        <section className="container mx-auto px-6 md:px-12 lg:px-20 pt-14 pb-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            {/* Left: text */}
            <div>
              <p className="text-[10px] tracking-[0.3em] uppercase text-gray-400 mb-5">
                Câu chuyện của chúng tôi
              </p>
              <h1 className="text-5xl sm:text-6xl md:text-7xl font-serif italic text-[#1A362D] leading-[1.08] mb-6">
                Nơi lưu giữ linh<br />
                hồn của những<br />
                trang sách.
              </h1>
              <p className="text-gray-500 text-sm leading-relaxed max-w-md">
                Từ năm 2012, NguyenHoang_BookStore đã và đang là điểm kết nối
                giữa những cuốn sách quý giá và những độc giả trân trọng tri
                thức. Chúng tôi không chỉ bán sách — chúng tôi lưu giữ những
                câu chuyện.
              </p>
            </div>

            {/* Right: stacked book image with label */}
            <div className="relative flex justify-end">
              <div ref={parallaxRef} className="relative w-full max-w-sm md:max-w-full">
                <img
                  src="/homepage.webp"
                  alt="Stack of books"
                  className="w-full h-[380px] md:h-[480px] object-cover object-center"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/Fiction.webp";
                  }}
                />
                {/* Floating label */}
                <div className="absolute top-5 right-5 bg-[#F5F2EB] px-4 py-2 shadow-sm">
                  <p className="text-[10px] tracking-[0.2em] uppercase text-gray-500 font-medium">
                    Bookshelf
                  </p>
                  <p className="text-[10px] tracking-[0.15em] uppercase text-gray-400">
                    — Archive
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── MISSION ── */}
        <section className="container mx-auto px-6 md:px-12 lg:px-20 py-14 border-t border-gray-100">
          <p className="text-[10px] tracking-[0.3em] uppercase text-gray-400 mb-3">
            Sứ mệnh
          </p>
          <h2 className="text-3xl md:text-4xl font-serif italic text-[#2A4B41] mb-10 max-w-xl leading-tight">
            Sứ mệnh của chúng tôi
          </h2>
          <p className="text-gray-500 text-sm leading-relaxed max-w-2xl mb-12">
            Làm cho sách trở nên dễ tiếp cận hơn với mọi người. Chúng tôi tin
            rằng tri thức không có giới hạn và mỗi người đều xứng đáng được tiếp
            cận với những tác phẩm tốt nhất.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 md:gap-12">
            {[
              {
                icon: "◎",
                title: "Sứ Truyền",
                desc: "Truyền tải giá trị văn hóa và tri thức qua từng trang sách, kết nối thế hệ và cộng đồng.",
              },
              {
                icon: "◈",
                title: "Tầm Lượng",
                desc: "Tuyển chọn kỹ lưỡng từng đầu sách, đảm bảo chất lượng nội dung và trải nghiệm đọc hoàn hảo.",
              },
              {
                icon: "✦",
                title: "Cộng Đồng",
                desc: "Xây dựng cộng đồng độc giả sôi động, nơi mọi người cùng chia sẻ tình yêu với văn học.",
              },
            ].map((item) => (
              <div key={item.title}>
                <span className="text-2xl text-[#2A4B41] block mb-4">
                  {item.icon}
                </span>
                <h3 className="font-serif italic text-lg text-[#1A362D] mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ── GALLERY + STORY ── */}
        <section className="container mx-auto px-6 md:px-12 lg:px-20 py-14 border-t border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
            {/* Left: 2x2 image mosaic */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { src: "/Fiction.webp", alt: "Reading room" },
                { src: "/Philosophy.webp", alt: "Book shelves" },
                { src: "/Technology.webp", alt: "Open book" },
                {
                  src: "",
                  alt: "",
                  quote: true,
                  text: '"Sách là người bạn không bao giờ phản bội."',
                },
              ].map((item, i) =>
                item.quote ? (
                  <div
                    key={i}
                    className="aspect-square bg-[#F6D8CE] flex items-center justify-center p-4"
                  >
                    <p className="text-[#1A362D] font-serif italic text-xs leading-relaxed text-center">
                      {item.text}
                    </p>
                  </div>
                ) : (
                  <div key={i} className="aspect-square overflow-hidden bg-gray-200">
                    <img
                      src={item.src}
                      alt={item.alt}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                )
              )}
            </div>

            {/* Right: text */}
            <div>
              <p className="text-[10px] tracking-[0.3em] uppercase text-gray-400 mb-4">
                Không gian của chúng tôi
              </p>
              <h2 className="text-3xl md:text-4xl font-serif italic text-[#2A4B41] mb-5 leading-tight">
                Tài mỗi bộ sách giúp các bạn thành không gian cộng đồng.
              </h2>
              <p className="text-gray-500 text-sm leading-relaxed mb-5">
                Không gian cửa hàng của chúng tôi được thiết kế như một thư
                viện riêng tư — ấm cúng, yên tĩnh và đầy cảm hứng. Nơi bạn có
                thể dành hàng giờ đồng hồ khám phá kho tàng tri thức.
              </p>
              <p className="text-gray-500 text-sm leading-relaxed mb-8">
                Mỗi góc nhỏ đều được chăm chút, từ ánh đèn vàng dịu đến những
                chiếc kệ sách bằng gỗ thô — tất cả tạo nên một không gian đọc
                đúng nghĩa.
              </p>
              <button
                onClick={() => navigate("/contact")}
                className="text-[10px] tracking-[0.25em] uppercase text-[#2A4B41] border-b border-[#2A4B41] pb-0.5 hover:opacity-60 transition-opacity"
              >
                Khám phá thêm →
              </button>
            </div>
          </div>
        </section>

        {/* ── VALUES CARDS ── */}
        <section className="container mx-auto px-6 md:px-12 lg:px-20 py-14 border-t border-gray-100">
          <p className="text-[10px] tracking-[0.3em] uppercase text-gray-400 mb-3">
            Giá trị cốt lõi
          </p>
          <h2 className="text-3xl md:text-4xl font-serif italic text-[#2A4B41] mb-10">
            Giá trị của chúng tôi
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* Card 1 – dark green */}
            <div className="bg-[#1A362D] text-white p-8 md:p-10">
              <div className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center mb-6">
                <span className="text-white/60 text-xs">◎</span>
              </div>
              <h3 className="font-serif italic text-xl mb-3 text-emerald-50">
                Chất lượng Tuyệt vời
              </h3>
              <p className="text-white/60 text-sm leading-relaxed">
                Mỗi cuốn sách được tuyển chọn kỹ lưỡng. Chúng tôi không chỉ
                bán sách — chúng tôi mang đến trải nghiệm đọc hoàn hảo nhất.
              </p>
            </div>

            {/* Card 2 – two sub-cards stacked */}
            <div className="flex flex-col gap-5">
              <div className="bg-[#F6D8CE] p-7 flex-1">
                <h3 className="font-serif italic text-lg text-[#1A362D] mb-2">
                  Tri thức & Đam mê
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Chúng tôi là những người yêu sách thực sự, luôn tìm kiếm và
                  chia sẻ những tác phẩm đỉnh cao.
                </p>
              </div>
              <div className="bg-[#4A1A2D] text-white p-7 flex-1">
                <h3 className="font-serif italic text-lg text-pink-100 mb-2">
                  Cộng đồng Sáng tạo
                </h3>
                <p className="text-white/60 text-sm leading-relaxed">
                  Kết nối tác giả và độc giả trong không gian văn học đầy sáng
                  tạo và cảm hứng.
                </p>
              </div>
            </div>

            {/* Card 3 – light */}
            <div className="bg-[#F5F2EB] p-8 md:p-10">
              <div className="w-8 h-8 rounded-full border border-[#2A4B41]/20 flex items-center justify-center mb-6">
                <span className="text-[#2A4B41] text-xs">✦</span>
              </div>
              <h3 className="font-serif italic text-xl text-[#2A4B41] mb-3">
                Tính bền vững
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                Cam kết sử dụng vật liệu thân thiện môi trường và đóng gói tái
                chế trong mọi hoạt động kinh doanh.
              </p>
            </div>
          </div>
        </section>

        {/* ── TEAM ── */}
        <section className="container mx-auto px-6 md:px-12 lg:px-20 py-14 border-t border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
            {/* Left: team photo */}
            <div className="relative">
              <div className="aspect-[4/3] overflow-hidden bg-gray-200">
                <img
                  src="/team-1.webp"
                  alt="Đội ngũ NguyenHoang BookStore"
                  className="w-full h-full object-cover object-center"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=800&auto=format&fit=crop&q=60";
                  }}
                />
              </div>
              {/* Stat badge */}
              <div className="absolute bottom-6 right-6 bg-white shadow-md px-5 py-4 text-center">
                <p className="text-3xl font-serif italic text-[#2A4B41] leading-none">
                  12+
                </p>
                <p className="text-[10px] tracking-widest uppercase text-gray-400 mt-1">
                  Năm kinh nghiệm
                </p>
              </div>
            </div>

            {/* Right: team info */}
            <div>
              <p className="text-[10px] tracking-[0.3em] uppercase text-gray-400 mb-3">
                Đội ngũ của chúng tôi
              </p>
              <h2 className="text-3xl md:text-4xl font-serif italic text-[#2A4B41] mb-5 leading-tight">
                Đội ngũ đứng sau chúng tôi
              </h2>
              <p className="text-gray-500 text-sm leading-relaxed mb-8">
                Đội ngũ NguyenHoang_BookStore gồm những người yêu sách thực sự —
                biên tập viên, nhà thiết kế, và chuyên gia tư vấn — cùng nhau
                tạo nên trải nghiệm mua sách khác biệt.
              </p>

              <div className="space-y-5">
                {[
                  {
                    name: "Nguyễn Hoàng",
                    role: "Nhà sáng lập & CEO",
                    initials: "NH",
                  },
                  {
                    name: "Trần Minh Anh",
                    role: "Giám đốc nội dung",
                    initials: "MA",
                  },
                  {
                    name: "Lê Thu Hằng",
                    role: "Trải nghiệm khách hàng",
                    initials: "TH",
                  },
                ].map((m) => (
                  <div
                    key={m.name}
                    className="flex items-center gap-4 pb-5 border-b border-gray-100 last:border-0"
                  >
                    <div className="w-10 h-10 rounded-full bg-[#2A4B41] flex items-center justify-center shrink-0">
                      <span className="text-white text-xs font-medium">
                        {m.initials}
                      </span>
                    </div>
                    <div>
                      <p className="font-serif italic text-[#1A362D] text-base leading-tight">
                        {m.name}
                      </p>
                      <p className="text-[10px] tracking-widest uppercase text-gray-400">
                        {m.role}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── STATS ── */}
        <section className="border-t border-gray-100 py-14">
          <div className="container mx-auto px-6 md:px-12 lg:px-20">
            <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-gray-100">
              {[
                { number: "50K+", label: "Đầu sách" },
                { number: "200K+", label: "Khách hàng" },
                { number: "12+", label: "Năm hoạt động" },
                { number: "4.9 ★", label: "Đánh giá TB" },
              ].map((s) => (
                <div key={s.label} className="text-center py-6 px-4">
                  <p className="text-4xl md:text-5xl font-serif italic text-[#2A4B41] mb-2">
                    {s.number}
                  </p>
                  <p className="text-[10px] tracking-[0.2em] uppercase text-gray-400">
                    {s.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA BANNER ── */}
        <section className="bg-[#2A4B41] py-16 md:py-20">
          <div className="container mx-auto px-6 md:px-12 lg:px-20">
            <div className="max-w-2xl">
              <p className="text-[10px] tracking-[0.3em] uppercase text-white/40 mb-4">
                Hãy ghé thăm
              </p>
              <h2 className="text-4xl md:text-5xl font-serif italic text-emerald-50 leading-tight mb-6">
                Hãy ghé thăm không gian của chúng tôi.
              </h2>
              <p className="text-white/60 text-sm leading-relaxed mb-8 max-w-lg">
                Đến trực tiếp cửa hàng để trải nghiệm không gian sách độc đáo,
                hoặc liên hệ để chúng tôi tư vấn bộ sưu tập sách phù hợp nhất
                với bạn.
              </p>
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={() => navigate("/books")}
                  className="bg-white text-[#2A4B41] text-[11px] tracking-[0.25em] uppercase px-7 py-4 hover:bg-[#F5F2EB] transition-colors font-medium"
                >
                  Khám phá sách →
                </button>
                <button
                  onClick={() => navigate("/contact")}
                  className="border border-white/30 text-white text-[11px] tracking-[0.25em] uppercase px-7 py-4 hover:bg-white/10 transition-colors"
                >
                  Liên hệ ngay
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
