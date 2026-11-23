
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  ArrowUpRight,
  User,
  Mail,
  LockKeyhole,
  Eye,
  EyeOff,
  Stethoscope,
  Building2,
  Globe2,
  Sun,
  Moon,
} from "lucide-react";
import "./Signup.css";

function Signup({ onSignup, theme, onToggleTheme }) {
  const navigate = useNavigate();
  const { i18n } = useTranslation();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    specialty: "",
    hospital: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const isArabic = i18n.language.startsWith("ar");

  const toggleLanguage = () => {
    const nextLanguage = isArabic ? "en" : "ar";

    i18n.changeLanguage(nextLanguage);
    localStorage.setItem("appLanguage", nextLanguage);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));

    setError("");
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (formData.password.length < 6) {
      setError(
        isArabic
          ? "كلمة المرور يجب أن تتكون من 6 أحرف على الأقل."
          : "Password must be at least 6 characters."
      );
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError(
        isArabic
          ? "كلمتا المرور غير متطابقتين."
          : "Passwords do not match."
      );
      return;
    }

    const existingUsers = JSON.parse(
      localStorage.getItem("axiomUsers") || "[]"
    );

    const emailExists = existingUsers.some(
      (user) =>
        user.email.toLowerCase() ===
        formData.email.trim().toLowerCase()
    );

    if (emailExists) {
      setError(
        isArabic
          ? "هذا البريد الإلكتروني مسجل بالفعل."
          : "An account with this email already exists."
      );
      return;
    }

    const newUser = {
      name: formData.name.trim(),
      email: formData.email.trim().toLowerCase(),
      password: formData.password,
      specialty: formData.specialty,
      hospital: formData.hospital,
      workplace: "",
      picture: "",
    };

    onSignup(newUser);
    navigate("/");
  };

  return (
    <main
      className="signup-page"
      dir={isArabic ? "rtl" : "ltr"}
    >
      <div className="signup-glow signup-glow-one" />
      <div className="signup-glow signup-glow-two" />

      {/* Language Toggle */}
      <button
        type="button"
        className="signup-language-toggle"
        onClick={toggleLanguage}
        aria-label={
          isArabic
            ? "Change language to English"
            : "تغيير اللغة إلى العربية"
        }
      >
        <Globe2 size={16} />
        <span>{isArabic ? "EN" : "عربي"}</span>
      </button>

      {/* Theme Toggle */}
      <button
        type="button"
        className="signup-theme-toggle"
        onClick={onToggleTheme}
        aria-label={
          theme === "dark"
            ? "Switch to light mode"
            : "Switch to dark mode"
        }
        title={
          theme === "dark"
            ? "Light Mode"
            : "Dark Mode"
        }
      >
        {theme === "dark" ? (
          <Sun size={19} />
        ) : (
          <Moon size={19} />
        )}
      </button>

      {/* Logo */}
      <Link to="/" className="signup-logo">
        <span>✳</span>
      </Link>

      <section className="signup-container">
        <div className="signup-heading">
          <span className="signup-eyebrow">
            {isArabic
              ? "إنشاء حساب جديد"
              : "CREATE YOUR ACCOUNT"}
          </span>

          <h1>
            {isArabic ? (
              <>انضم إلينا</>
            ) : (
              <>
                Join your <span>workspace.</span>
              </>
            )}
          </h1>

          <p>
            {isArabic
              ? "أنشئ حسابك وابدأ رحلتك في مساحة عملك الطبية."
              : "Create your account and get started with your medical workspace."}
          </p>
        </div>

        <form className="signup-form" onSubmit={handleSubmit}>
          <label htmlFor="signup-name">
            {isArabic ? "الاسم بالكامل" : "Full Name"}
          </label>

          <div className="signup-input">
            <User size={18} />
            <input
              id="signup-name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder={
                isArabic
                  ? "اكتب اسمك بالكامل"
                  : "Enter your full name"
              }
              required
            />
          </div>

          <label htmlFor="signup-email">
            {isArabic ? "البريد الإلكتروني" : "Email Address"}
          </label>

          <div className="signup-input">
            <Mail size={18} />
            <input
              id="signup-email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="doctor@example.com"
              required
            />
          </div>

          <label htmlFor="signup-specialty">
            {isArabic ? "التخصص الطبي" : "Medical Specialty"}
          </label>

          <div className="signup-input">
            <Stethoscope size={18} />
            <input
              id="signup-specialty"
              name="specialty"
              value={formData.specialty}
              onChange={handleChange}
              placeholder={
                isArabic
                  ? "اكتب تخصصك الطبي"
                  : "Your medical specialty"
              }
            />
          </div>

          <label htmlFor="signup-hospital">
            {isArabic
              ? "المستشفى / المؤسسة"
              : "Hospital / Organization"}
          </label>

          <div className="signup-input">
            <Building2 size={18} />
            <input
              id="signup-hospital"
              name="hospital"
              value={formData.hospital}
              onChange={handleChange}
              placeholder={
                isArabic
                  ? "اسم المستشفى أو المؤسسة"
                  : "Hospital or organization"
              }
            />
          </div>

          <label htmlFor="signup-password">
            {isArabic ? "كلمة المرور" : "Password"}
          </label>

          <div className="signup-input">
            <LockKeyhole size={18} />
            <input
              id="signup-password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={handleChange}
              placeholder={
                isArabic
                  ? "أنشئ كلمة مرور"
                  : "Create a password"
              }
              minLength={6}
              required
            />

            <button
              type="button"
              className="signup-password-toggle"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={
                isArabic
                  ? "إظهار أو إخفاء كلمة المرور"
                  : "Toggle password visibility"
              }
            >
              {showPassword ? (
                <EyeOff size={18} />
              ) : (
                <Eye size={18} />
              )}
            </button>
          </div>

          <label htmlFor="signup-confirm-password">
            {isArabic
              ? "تأكيد كلمة المرور"
              : "Confirm Password"}
          </label>

          <div className="signup-input">
            <LockKeyhole size={18} />
            <input
              id="signup-confirm-password"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder={
                isArabic
                  ? "أعد كتابة كلمة المرور"
                  : "Confirm your password"
              }
              required
            />
          </div>

          {error && (
            <p className="signup-error">{error}</p>
          )}

          <button type="submit" className="signup-submit">
            {isArabic ? "إنشاء الحساب" : "Create Account"}
            <ArrowUpRight size={18} />
          </button>
        </form>

        <div className="signup-footer">
          <span>
            {isArabic
              ? "لديك حساب بالفعل؟"
              : "ALREADY HAVE AN ACCOUNT?"}
          </span>

          <Link to="/login">
            {isArabic ? "تسجيل الدخول" : "Sign in"}
          </Link>
        </div>
      </section>
    </main>
  );
}

export default Signup;
