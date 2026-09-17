import { useState,type FormEvent } from "react";
import Header from "../../components/layout/header";
import Footer from "../../components/layout/footer";
import { MapPinIcon, PhoneIcon, EnvelopeIcon } from "@heroicons/react/24/outline";

type FormData = {
  fullName: string;
  email: string;
  subject: string;
  message: string;
};

type FormErrors = Partial<Record<keyof FormData, string>>;

export default function ContactPage() {
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    email: "",
    subject: "",
    message: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = "Vui lòng nhập họ tên.";
    if (!formData.email.trim()) {
      newErrors.email = "Vui lòng nhập email.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Email không hợp lệ.";
    }
    if (!formData.subject.trim()) newErrors.subject = "Vui lòng chọn chủ đề.";
    if (!formData.message.trim() || formData.message.length < 10)
      newErrors.message = "Tin nhắn phải có ít nhất 10 ký tự.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    setLoading(false);
    setSubmitted(true);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] font-sans text-gray-800">
      <Header />

      <main>
        {/* ── HERO + FORM SECTION ── */}
        <section className="container mx-auto px-6 md:px-12 lg:px-20 pt-16 pb-20">
          {/* Label */}
          <p className="text-[10px] tracking-[0.3em] uppercase text-gray-400 mb-5">
            Get in touch
          </p>

          {/* Heading */}
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-serif text-[#1A362D] leading-[1.05] mb-4">
            Hãy bắt đầu một{" "}
            <em className="italic font-serif">cuộc trò chuyện</em>.
          </h1>
          <p className="text-gray-500 text-sm leading-relaxed max-w-lg mb-14">
            Dù bạn đang tìm kiếm một ấn bản đặc biệt hay muốn thảo luận về bộ
            sưu tập sách cá nhân, đội ngũ của chúng tôi luôn sẵn sàng hỗ trợ.
          </p>

          {/* Form + Contact Info Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-16 items-start">
            {/* ── FORM – 3 cols ── */}
            <div className="lg:col-span-3">
              {submitted ? (
                <div className="bg-white border border-gray-100 p-12 text-center shadow-sm">
                  <div className="w-14 h-14 rounded-full bg-[#F5F2EB] flex items-center justify-center mx-auto mb-5">
                    <svg className="h-7 w-7 text-[#2A4B41]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                  </div>
                  <h3 className="font-serif italic text-2xl text-[#2A4B41] mb-3">
                    Tin nhắn đã được gửi!
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed mb-8 max-w-xs mx-auto">
                    Cảm ơn bạn đã liên hệ. Chúng tôi sẽ phản hồi qua{" "}
                    <span className="text-[#2A4B41] font-medium">{formData.email}</span>{" "}
                    trong vòng 24 giờ.
                  </p>
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({ fullName: "", email: "", subject: "", message: "" });
                    }}
                    className="text-xs tracking-[0.2em] uppercase border-b border-[#2A4B41] text-[#2A4B41] pb-0.5 hover:opacity-70 transition-opacity"
                  >
                    Gửi tin nhắn khác
                  </button>
                </div>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  noValidate
                  className="bg-white border border-gray-100 p-8 md:p-10 shadow-sm"
                >
                  {/* Row 1: Full name + Email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label
                        htmlFor="cf-fullName"
                        className="block text-[10px] tracking-[0.2em] uppercase text-gray-400 mb-2"
                      >
                        Họ và tên
                      </label>
                      <input
                        id="cf-fullName"
                        name="fullName"
                        type="text"
                        value={formData.fullName}
                        onChange={handleChange}
                        placeholder="Nguyễn Văn A"
                        className={`w-full pb-3 bg-transparent border-b text-sm text-gray-700 placeholder-gray-300 focus:outline-none transition-colors ${
                          errors.fullName
                            ? "border-red-400 focus:border-red-500"
                            : "border-gray-200 focus:border-[#2A4B41]"
                        }`}
                      />
                      {errors.fullName && (
                        <p className="text-red-400 text-xs mt-1">{errors.fullName}</p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="cf-email"
                        className="block text-[10px] tracking-[0.2em] uppercase text-gray-400 mb-2"
                      >
                        Địa chỉ email
                      </label>
                      <input
                        id="cf-email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="example@email.com"
                        className={`w-full pb-3 bg-transparent border-b text-sm text-gray-700 placeholder-gray-300 focus:outline-none transition-colors ${
                          errors.email
                            ? "border-red-400 focus:border-red-500"
                            : "border-gray-200 focus:border-[#2A4B41]"
                        }`}
                      />
                      {errors.email && (
                        <p className="text-red-400 text-xs mt-1">{errors.email}</p>
                      )}
                    </div>
                  </div>

                  {/* Row 2: Subject */}
                  <div className="mb-6">
                    <label
                      htmlFor="cf-subject"
                      className="block text-[10px] tracking-[0.2em] uppercase text-gray-400 mb-2"
                    >
                      Chủ đề
                    </label>
                    <div className="relative">
                      <select
                        id="cf-subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        className={`w-full pb-3 bg-transparent border-b text-sm focus:outline-none transition-colors appearance-none cursor-pointer pr-6 ${
                          errors.subject
                            ? "border-red-400 text-red-400"
                            : "border-gray-200 focus:border-[#2A4B41]"
                        } ${!formData.subject ? "text-gray-300" : "text-gray-700"}`}
                      >
                        <option value="" disabled>
                          Hỏi về một ấn bản quý hiếm
                        </option>
                        <option value="order">Hỗ trợ đơn hàng</option>
                        <option value="product">Hỏi về sản phẩm</option>
                        <option value="return">Đổi trả hàng</option>
                        <option value="rare">Tìm ấn bản đặc biệt</option>
                        <option value="partnership">Hợp tác kinh doanh</option>
                        <option value="feedback">Góp ý & phản hồi</option>
                        <option value="other">Khác</option>
                      </select>
                      <svg
                        className="absolute right-0 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                    {errors.subject && (
                      <p className="text-red-400 text-xs mt-1">{errors.subject}</p>
                    )}
                  </div>

                  {/* Row 3: Message */}
                  <div className="mb-8">
                    <label
                      htmlFor="cf-message"
                      className="block text-[10px] tracking-[0.2em] uppercase text-gray-400 mb-2"
                    >
                      Nội dung tin nhắn
                    </label>
                    <textarea
                      id="cf-message"
                      name="message"
                      rows={4}
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Chúng tôi có thể giúp gì cho bạn hôm nay?"
                      className={`w-full pb-3 bg-transparent border-b text-sm text-gray-700 placeholder-gray-300 focus:outline-none transition-colors resize-none ${
                        errors.message
                          ? "border-red-400 focus:border-red-500"
                          : "border-gray-200 focus:border-[#2A4B41]"
                      }`}
                    />
                    {errors.message && (
                      <p className="text-red-400 text-xs mt-1">{errors.message}</p>
                    )}
                  </div>

                  {/* Submit */}
                  <button
                    id="contact-submit-btn"
                    type="submit"
                    disabled={loading}
                    className="inline-flex items-center gap-3 bg-[#2A4B41] text-white text-[11px] tracking-[0.25em] uppercase px-7 py-4 hover:bg-[#1A362D] transition-colors disabled:opacity-60"
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin h-3.5 w-3.5" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                        </svg>
                        Đang gửi...
                      </>
                    ) : (
                      <>
                        Gửi tin nhắn
                        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                        </svg>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>

            {/* ── CONTACT INFO – 2 cols ── */}
            <div className="lg:col-span-2 space-y-4">
              {/* Address */}
              <div className="bg-white border border-gray-100 shadow-sm p-7">
                <div className="flex gap-4 items-start mb-4">
                  <div className="w-8 h-8 rounded-full bg-[#F5F2EB] flex items-center justify-center shrink-0 mt-0.5">
                    <MapPinIcon className="h-4 w-4 text-[#2A4B41]" />
                  </div>
                  <div>
                    <h3 className="font-serif text-base text-[#1A362D] mb-1">
                      Địa chỉ cửa hàng
                    </h3>
                    <p className="text-gray-500 text-sm leading-relaxed">
                      123 Đường Sách, Quận Hoàn Kiếm
                      <br />
                      Hà Nội, Việt Nam
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 items-start mb-4 pt-4 border-t border-gray-50">
                  <div className="w-8 h-8 rounded-full bg-[#F5F2EB] flex items-center justify-center shrink-0 mt-0.5">
                    <PhoneIcon className="h-4 w-4 text-[#2A4B41]" />
                  </div>
                  <div>
                    <h3 className="font-serif text-base text-[#1A362D] mb-1">
                      Điện thoại
                    </h3>
                    <p className="text-gray-500 text-sm leading-relaxed">
                      +84 24 1234 5678
                      <br />
                      Thứ Hai – Thứ Sáu: 09:00 – 18:00
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 items-start pt-4 border-t border-gray-50">
                  <div className="w-8 h-8 rounded-full bg-[#F5F2EB] flex items-center justify-center shrink-0 mt-0.5">
                    <EnvelopeIcon className="h-4 w-4 text-[#2A4B41]" />
                  </div>
                  <div>
                    <h3 className="font-serif text-base text-[#1A362D] mb-1">
                      Kỹ thuật số
                    </h3>
                    <p className="text-gray-500 text-sm leading-relaxed">
                      hello@nguyenhoang-bookstore.vn
                      <br />
                      support@nguyenhoang-bookstore.vn
                    </p>
                  </div>
                </div>
              </div>

              {/* Social */}
              <div className="bg-[#F5F2EB] border border-gray-100 p-7">
                <p className="text-[10px] tracking-[0.25em] uppercase text-gray-400 mb-4">
                  Kết nối với chúng tôi
                </p>
                <div className="flex gap-3">
                  {[
                    {
                      label: "FB",
                      title: "Facebook",
                      href: "#",
                      icon: (
                        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                        </svg>
                      ),
                    },
                    {
                      label: "IG",
                      title: "Instagram",
                      href: "#",
                      icon: (
                        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                        </svg>
                      ),
                    },
                    {
                      label: "TW",
                      title: "Twitter/X",
                      href: "#",
                      icon: (
                        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                        </svg>
                      ),
                    },
                    {
                      label: "TK",
                      title: "TikTok",
                      href: "#",
                      icon: (
                        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
                        </svg>
                      ),
                    },
                  ].map((s) => (
                    <a
                      key={s.label}
                      href={s.href}
                      title={s.title}
                      className="w-9 h-9 bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-[#2A4B41] hover:text-white hover:border-[#2A4B41] transition-all duration-200"
                    >
                      {s.icon}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── MAP FULL WIDTH ── */}
        <section className="relative h-[420px] md:h-[520px] overflow-hidden">
          {/* Dark overlay map */}
          <iframe
            title="Bản đồ NguyenHoang BookStore"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3723.8!2d105.8520!3d21.0285!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ab953357c995%3A0x1f954b37f1e4b8c5!2zSMOgIE7hu5lpLCBWaeG7h3QgTmFt!5e0!3m2!1svi!2svn!4v1700000000000!5m2!1svi!2svn"
            className="w-full h-full border-0"
            style={{ filter: "grayscale(100%) invert(90%) contrast(90%)" }}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />

          {/* Dark overlay tint */}
          <div className="absolute inset-0 bg-[#1A362D]/60 pointer-events-none" />

          {/* Find Us Card */}
          <div className="absolute bottom-10 left-8 md:left-16 bg-white p-6 md:p-8 shadow-xl max-w-xs">
            <p className="text-[10px] tracking-[0.25em] uppercase text-[#2A4B41] mb-2">
              Tìm chúng tôi
            </p>
            <h3 className="font-serif italic text-xl text-[#1A362D] mb-2">
              Ghé thăm kho sách
            </h3>
            <p className="text-gray-500 text-sm leading-relaxed mb-5">
              Ghé thăm kho lưu trữ sách của chúng tôi để xem các bộ sưu tập
              mới nhất theo yêu cầu riêng.
            </p>
            <a
              href="https://maps.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[10px] tracking-[0.2em] uppercase text-[#2A4B41] border-b border-[#2A4B41] pb-0.5 hover:opacity-60 transition-opacity"
            >
              Mở Google Maps
            </a>
          </div>
        </section>

        {/* ── FAQ STRIP ── */}
        <section className="bg-[#F5F2EB] py-16 md:py-20">
          <div className="container mx-auto px-6 md:px-12 lg:px-20">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-16">
              <div>
                <p className="text-[10px] tracking-[0.25em] uppercase text-gray-400 mb-3">
                  Câu hỏi thường gặp
                </p>
                <h2 className="text-3xl font-serif italic text-[#2A4B41] leading-tight">
                  Bạn còn câu hỏi nào?
                </h2>
              </div>

              <div className="md:col-span-2 space-y-6">
                {[
                  {
                    q: "Thời gian giao hàng là bao lâu?",
                    a: "Nội thành Hà Nội: 1–2 ngày làm việc. Các tỉnh thành khác: 3–5 ngày làm việc.",
                  },
                  {
                    q: "Chính sách đổi trả như thế nào?",
                    a: "Chấp nhận đổi trả trong vòng 7 ngày nếu sách bị lỗi in ấn hoặc hư hỏng trong quá trình vận chuyển.",
                  },
                  {
                    q: "Làm thế nào để đặt ấn bản đặc biệt?",
                    a: "Gửi tin nhắn qua form hoặc email cho chúng tôi. Đội ngũ sẽ tư vấn và tìm kiếm ấn bản theo yêu cầu.",
                  },
                  {
                    q: "Có chương trình thành viên không?",
                    a: "Có! Đăng ký tài khoản miễn phí để tích điểm, nhận ưu đãi sinh nhật và ưu tiên mua sách mới.",
                  },
                ].map((faq, i) => (
                  <div
                    key={i}
                    className="border-b border-gray-200 pb-6 last:border-0"
                  >
                    <h4 className="font-serif italic text-base text-[#1A362D] mb-2">
                      {faq.q}
                    </h4>
                    <p className="text-gray-500 text-sm leading-relaxed">
                      {faq.a}
                    </p>
                  </div>
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
