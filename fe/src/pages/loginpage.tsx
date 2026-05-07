import { useState } from "react";
import Input from "../components/inputs/input";
import Button from "../components/button/button";

type Mode = "login" | "register";

/* ─── Decorative book-spine pattern ─── */
function BookPattern() {
  const spines = [
    { h: 160, color: "#153328", delay: 0 },
    { h: 120, color: "#1e4a38", delay: 0.1 },
    { h: 180, color: "#0d2219", delay: 0.2 },
    { h: 140, color: "#2a5c48", delay: 0.3 },
    { h: 100, color: "#112c1e", delay: 0.4 },
    { h: 170, color: "#1a3d2e", delay: 0.5 },
    { h: 130, color: "#0a1a11", delay: 0.6 },
    { h: 155, color: "#224735", delay: 0.7 },
    { h: 115, color: "#183026", delay: 0.8 },
    { h: 175, color: "#0f2418", delay: 0.9 },
    { h: 145, color: "#1c3d2d", delay: 1.0 },
    { h: 125, color: "#264e3c", delay: 1.1 },
  ];
  return (
    <div className="flex items-end gap-[3px] opacity-30">
      {spines.map((s, i) => (
        <div
          key={i}
          style={{
            height: s.h,
            width: 18,
            backgroundColor: s.color,
            borderRadius: "2px 2px 0 0",
            animation: `bookRise 1.2s ease ${s.delay}s both`,
          }}
        />
      ))}
    </div>
  );
}

export default function LoginPage() {
  {/* --- States --- */}
  const [mode, setMode] = useState<Mode>("login");
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [registerData, setRegisterData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [animating, setAnimating] = useState(false);

  {/* --- Functions --- */}
  const handleLoginChange = (field: string, value: string) => {
    setLoginData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleRegisterChange = (field: string, value: string) => {
    setRegisterData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validateLogin = () => {
    const e: Record<string, string> = {};
    if (!loginData.email) e.email = "Email không được để trống";
    if (!loginData.password) e.password = "Mật khẩu không được để trống";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validateRegister = () => {
    const e: Record<string, string> = {};
    if (!registerData.fullName) e.fullName = "Họ tên không được để trống";
    if (!registerData.email) e.email = "Email không được để trống";
    if (!registerData.password) e.password = "Mật khẩu không được để trống";
    if (registerData.password !== registerData.confirmPassword)
      e.confirmPassword = "Mật khẩu xác nhận không khớp";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (mode === "login") {
      if (!validateLogin()) return;
      console.log("Login:", loginData);
    } else {
      if (!validateRegister()) return;
      console.log("Register:", registerData);
    }
  };

  const switchMode = (next: Mode) => {
    if (next === mode || animating) return;
    setAnimating(true);
    setErrors({});
    setMode(next);
    setTimeout(() => setAnimating(false), 350);
  };

  return (
    <>
      <style>{`
        @keyframes bookRise {
          from { transform: translateY(40px); opacity: 0; }
          to   { transform: translateY(0);   opacity: 1; }
        }
        @keyframes fadeUp {
          from { transform: translateY(16px); opacity: 0; }
          to   { transform: translateY(0);    opacity: 1; }
        }
        .fade-up   { animation: fadeUp 0.4s ease both; }
        .fade-up-1 { animation: fadeUp 0.4s ease 0.05s both; }
        .fade-up-2 { animation: fadeUp 0.4s ease 0.10s both; }
        .fade-up-3 { animation: fadeUp 0.4s ease 0.15s both; }
        .fade-up-4 { animation: fadeUp 0.4s ease 0.20s both; }
      `}</style>

      <div className="min-h-screen flex bg-surface">

        {/* ─── LEFT PANEL ─── */}
        <div
          className="hidden lg:flex flex-col justify-between w-[480px] shrink-0 px-12 py-14 relative overflow-hidden"
          style={{ backgroundColor: "#001e14" }}
        >
          {/* Radial glow */}
          <div style={{
            position: "absolute", top: "-20%", left: "-20%",
            width: "80%", height: "80%", borderRadius: "50%",
            background: "radial-gradient(circle, rgba(42,92,72,0.4) 0%, transparent 70%)",
            pointerEvents: "none",
          }} />

          {/* Brand */}
          <div className="fade-up relative z-10">
            <span className="font-serif text-xl tracking-widest" style={{ color: "#a8c5b8" }}>
              NGUYỄN HOÀNG
            </span>
            <span className="block font-serif text-4xl font-bold leading-tight mt-1" style={{ color: "#ffffff" }}>
              Bookstore
            </span>
          </div>

          {/* Quote */}
          <div className="relative z-10 space-y-6">
            <BookPattern />
            <blockquote className="fade-up-1">
              <p className="font-serif text-2xl leading-snug" style={{ color: "#e8f0ec" }}>
                "A reader lives a thousand lives before he dies."
              </p>
              <cite className="block mt-3 font-sans text-label-md uppercase tracking-widest" style={{ color: "#6b9980" }}>
                — George R.R. Martin
              </cite>
            </blockquote>
          </div>

          {/* Footer */}
          <p className="fade-up-2 relative z-10 font-sans text-label-sm uppercase tracking-widest" style={{ color: "#3d6655" }}>
            © 2026 Nguyễn Hoàng · All rights reserved
          </p>
        </div>

        {/* ─── RIGHT PANEL ─── */}
        <div className="flex-1 flex items-center justify-center px-6 py-12">
          <div className="w-full max-w-[420px]">

            {/* Mobile brand */}
            <div className="lg:hidden mb-10 text-center fade-up">
              <span className="font-serif text-3xl font-bold text-on-surface">Bookstore</span>
            </div>

            {/* Heading */}
            <div className="mb-8 fade-up">
              <h1 className="font-serif text-headline-md text-on-surface leading-tight">
                {mode === "login" ? "Chào mừng trở lại" : "Tạo tài khoản"}
              </h1>
              <p className="font-sans text-body-sm text-on-surface-variant mt-2">
                {mode === "login"
                  ? "Đăng nhập để tiếp tục khám phá kho sách."
                  : "Tham gia cộng đồng độc giả của chúng tôi."}
              </p>
            </div>

            {/* ── Tab switcher — underline only ── */}
            <div className="flex mb-8 fade-up-1">
              <button
                id="tab-login"
                type="button"
                onClick={() => switchMode("login")}
                className="relative flex-1 pb-3 font-sans text-label-md font-semibold uppercase tracking-wider text-center focus:outline-none text-on-surface"
              >
                Đăng nhập
                <span className={`absolute bottom-0 left-0 w-full h-[2px] bg-on-surface transition-transform duration-300 origin-left ${mode === "login" ? "scale-x-100" : "scale-x-0"}`} />
              </button>
              <button
                id="tab-register"
                type="button"
                onClick={() => switchMode("register")}
                className="relative flex-1 pb-3 font-sans text-label-md font-semibold uppercase tracking-wider text-center focus:outline-none text-on-surface"
              >
                Đăng ký
                <span className={`absolute bottom-0 left-0 w-full h-[2px] bg-on-surface transition-transform duration-300 origin-left ${mode === "register" ? "scale-x-100" : "scale-x-0"}`} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} noValidate className="space-y-5" key={mode}>
              {mode === "register" && (
                <div className="fade-up">
                  <Input
                    label="Họ và tên"
                    type="text"
                    placeholder="Nguyễn Văn A"
                    value={registerData.fullName}
                    onChange={(e) => handleRegisterChange("fullName", e.target.value)}
                    error={errors.fullName}
                  />
                </div>
              )}

              <div className="fade-up-1">
                <Input
                  label="Email"
                  type="email"
                  placeholder="example@email.com"
                  value={mode === "login" ? loginData.email : registerData.email}
                  onChange={(e) =>
                    mode === "login"
                      ? handleLoginChange("email", e.target.value)
                      : handleRegisterChange("email", e.target.value)
                  }
                  error={errors.email}
                />
              </div>

              <div className="fade-up-2">
                <Input
                  label="Mật khẩu"
                  type="password"
                  placeholder="••••••••"
                  value={mode === "login" ? loginData.password : registerData.password}
                  onChange={(e) =>
                    mode === "login"
                      ? handleLoginChange("password", e.target.value)
                      : handleRegisterChange("password", e.target.value)
                  }
                  error={errors.password}
                />
              </div>

              {mode === "register" && (
                <div className="fade-up-3">
                  <Input
                    label="Xác nhận mật khẩu"
                    type="password"
                    placeholder="••••••••"
                    value={registerData.confirmPassword}
                    onChange={(e) => handleRegisterChange("confirmPassword", e.target.value)}
                    error={errors.confirmPassword}
                  />
                </div>
              )}

              {mode === "login" && (
                <div className="text-right fade-up-3">
                  <a href="#" className="font-sans text-label-sm text-on-surface-variant hover:text-on-surface transition-colors duration-200 underline underline-offset-2">
                    Quên mật khẩu?
                  </a>
                </div>
              )}

              <div className="fade-up-4 pt-2">
                <Button className="w-full py-3 text-label-lg tracking-widest">
                  {mode === "login" ? "Đăng nhập" : "Tạo tài khoản"}
                </Button>
              </div>
            </form>

            {/* Divider */}
            <div className="relative flex items-center my-6">
              <div className="flex-1 h-px bg-outline-variant" />
              <span className="mx-4 font-sans text-label-sm text-on-surface-variant">hoặc</span>
              <div className="flex-1 h-px bg-outline-variant" />
            </div>

            {/* Switch hint */}
            <p className="text-center font-sans text-body-sm text-on-surface-variant">
              {mode === "login" ? "Chưa có tài khoản? " : "Đã có tài khoản? "}
              <button
                id="switch-mode-link"
                type="button"
                onClick={() => switchMode(mode === "login" ? "register" : "login")}
                className="font-semibold text-on-surface underline underline-offset-2 hover:opacity-60 transition-opacity duration-200"
              >
                {mode === "login" ? "Đăng ký ngay" : "Đăng nhập"}
              </button>
            </p>

          </div>
        </div>
      </div>
    </>
  );
}
