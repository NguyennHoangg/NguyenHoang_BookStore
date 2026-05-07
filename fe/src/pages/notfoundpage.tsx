export default function NotFoundPage() {
  return (
    <>
      <style>{`
        @keyframes fadeUp {
          from { transform: translateY(20px); opacity: 0; }
          to   { transform: translateY(0);    opacity: 1; }
        }
        @keyframes floatY {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-12px); }
        }
        .anim-1 { animation: fadeUp 0.5s ease 0.1s both; }
        .anim-2 { animation: fadeUp 0.5s ease 0.2s both; }
        .anim-3 { animation: fadeUp 0.5s ease 0.3s both; }
        .float  { animation: floatY 3.5s ease-in-out infinite; }
      `}</style>

      <div className="min-h-screen flex flex-col items-center justify-center bg-surface px-6 text-center">

        {/* Big 404 */}
        <div className="float select-none mb-6">
          <span
            className="font-serif font-bold leading-none"
            style={{ fontSize: "clamp(6rem, 20vw, 14rem)", color: "#001e14", opacity: 0.08 }}
          >
            404
          </span>
        </div>

        {/* Decorative line */}
        <div className="anim-1 flex items-center gap-4 mb-6">
          <div className="h-px w-12 bg-outline-variant" />
          <span className="font-sans text-label-md uppercase tracking-widest text-on-surface-variant">
            Trang không tồn tại
          </span>
          <div className="h-px w-12 bg-outline-variant" />
        </div>

        {/* Message */}
        <div className="anim-2 max-w-sm mb-10">
          <h1 className="font-serif text-headline-sm text-on-surface mb-3">
            Có vẻ bạn bị lạc rồi
          </h1>
          <p className="font-sans text-body-sm text-on-surface-variant leading-relaxed">
            Trang bạn đang tìm kiếm không tồn tại, đã bị xoá, hoặc đường dẫn không chính xác.
          </p>
        </div>

        {/* CTA */}
        <div className="anim-3 flex flex-col sm:flex-row items-center gap-3">
          <a
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 font-sans text-label-md font-semibold uppercase tracking-widest text-on-primary bg-primary-container hover:bg-primary transition-colors duration-200"
          >
            ← Về trang chủ
          </a>
          <a
            href="/login"
            className="inline-flex items-center gap-2 px-6 py-3 font-sans text-label-md font-semibold uppercase tracking-widest text-on-surface border border-outline-variant hover:border-on-surface transition-colors duration-200"
          >
            Đăng nhập
          </a>
        </div>

      </div>
    </>
  );
}
