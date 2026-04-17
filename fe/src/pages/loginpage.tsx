import { useState } from "react";
import Input from "../components/inputs/input";

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    fullName: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Form data:", formData);
  };

  return (
    <div className="grid grid-cols-2 min-h-screen bg-surface">
      {/* Left Side - Brand & Quote */}
      <div className="bg-gradient-to-br from-blue-400 to-blue-600 flex flex-col justify-between p-16 text-white">
        <div>
          <h1 className="text-2xl font-serif font-semibold italic">NguyenHoang_BookStore</h1>
        </div>

        <div>
          <h2 className="text-5xl font-serif italic font-light leading-tight mb-8">
            "Books are a uniquely portable magic."
          </h2>
          <p className="text-base leading-relaxed">
            Enter our curated archives where every volume tells a story of heritage, wisdom, and modern scholarship.
          </p>
        </div>

        <div className="space-y-1">
          <p className="text-sm tracking-widest uppercase font-light">ESTABLISHED 1984</p>
          <p className="text-sm tracking-widest uppercase font-light">CURATING WISDOM</p>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex items-center justify-center px-16 py-8">
        <div className="w-full max-w-md">
          {/* Heading */}
          <h1 className="text-5xl font-serif text-on-surface mb-3">Welcome Back</h1>
          <p className="text-sm text-on-surface-variant mb-10">
            Please enter your credentials to access your library.
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <Input
              label="EMAIL ADDRESS"
              placeholder="scholar@archives.com"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
            />

            {/* Password */}
            <div className="relative">
              <Input
                label="PASSWORD"
                placeholder="••••••••"
                type="password"
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
              />
              <a
                href="#forgot"
                className="absolute right-0 -top-6 text-xs text-primary-container hover:text-primary transition-colors"
              >
                Forgot Password?
              </a>
            </div>

            {/* Remember Me */}
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                className="w-4 h-4 rounded-none border border-outline-variant accent-primary-container"
              />
              <span className="text-sm text-on-surface-variant">Remember me for 30 days</span>
            </label>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-primary-container text-white font-sans font-semibold text-sm uppercase tracking-widest px-6 py-3 rounded-none transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 mt-8"
            >
              Sign In to Library
            </button>

            {/* Sign Up Link */}
            <p className="text-center text-sm text-on-surface-variant pt-2">
              New to our archive?{" "}
              <button
                type="button"
                className="text-primary-container hover:text-primary font-semibold transition-colors"
              >
                Create an Account
              </button>
            </p>

            {/* Divider */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-outline-variant border-opacity-20"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="px-3 bg-surface text-on-surface-variant text-xs uppercase tracking-wider">
                  External Authentication
                </span>
              </div>
            </div>

            {/* Social Buttons */}
            <div className="grid grid-cols-2 gap-4">
              <button 
                type="button"
                className="py-3 px-4 border border-outline-variant border-opacity-40 rounded-none font-sans text-sm font-semibold text-on-surface hover:bg-surface-container-low transition-colors"
              >
                ☐ GOOGLE
              </button>
              <button 
                type="button"
                className="py-3 px-4 border border-outline-variant border-opacity-40 rounded-none font-sans text-sm font-semibold text-on-surface hover:bg-surface-container-low transition-colors"
              >
                ◻ GITHUB
              </button>
            </div>
          </form>

          {/* Footer Info */}
         
        </div>
      </div>
    </div>
  );
}
